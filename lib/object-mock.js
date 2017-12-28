'use strict';

const _sinon = require('sinon');

/**
 * Class that creates a stub and contains useful methods to track the response
 * returned on each call. This is especially useful when tracking responses
 * from multiple async calls.
 */
class Stub {
    /**
     * @param {Object} instance The object instance on which the method will be
     *        stubbed.
     * @param {String} methodName The name of the method on the object that
     *        needs to be stubbed.
     * @param {Object|Function} returnValue A return value that will be
     *        returned by the stub. If a function is passed in, the function
     *        will be invoked, and ther return value of the function will be
     *        returned as the response.
     * @param {Boolean} [isAsync=false] An optional parameter that indicates if
     *        method being stubbed is an async method.
     * @param {Boolean} [create=false] An optional parameter that indicates if
     *        missing methods need to be created using an empty function.
     */
    constructor(instance, methodName, returnValue, create, isAsync) {
        if(create && typeof instance[methodName] !== 'function') {
            instance[methodName] = () => {};
        }

        this._firstAsync = {
            resolve: null,
            reject: null
        };
        this._firstAsync.promise = new Promise((resolve, reject) => {
            this._firstAsync.resolve = resolve;
            this._firstAsync.reject = reject;
        });
        this._firstAsync.promise.catch((err) => {});
        this._responses = [];
        const func = this._initReplaceFunction(isAsync, returnValue);
        this._stub = _sinon.stub(instance, methodName).callsFake(func);
    }

    /**
     * Creates a replacement function that will be used to replace the stubbed
     * method.
     *
     * @private
     * @param {Boolean} isAsync Determines if the method being stubbed is an
     *        async function.
     * @param {Object|Function} returnValue A return value that will be
     *        returned by the stub. If a function is passed in, the function
     *        will be invoked, and ther return value of the function will be
     *        returned as the response.
     *
     * @return {Function} A replacement function that will be added to the stub.
     */
    _initReplaceFunction(isAsync, returnValue) {
        const responses = this.responses;
        if(!isAsync) {
            return function() {
                const args = Array.prototype.slice.call(arguments);
                let ret = returnValue;
                if(typeof returnValue === 'function') {
                    ret = returnValue.apply(null, args);
                }
                responses.push({
                    isAsync: false,
                    args: Array.prototype.slice.call(arguments, 0),
                    ret
                });
                return ret;
            };
        } else {
            const firstAsync = this._firstAsync;
            return function() {
                const info = {
                    isAsync: true,
                    args: Array.prototype.slice.call(arguments, 0),
                };
                if(responses.length === 0) {
                    info.promise = firstAsync.promise;
                    info.resolve = firstAsync.resolve;
                    info.reject = firstAsync.reject;
                } else {
                    info.promise = new Promise((resolve, reject) => {
                        info.resolve = resolve;
                        info.reject = reject;
                    });
                }
                info.ret = info.promise;
                responses.push(info);
                return info.promise;
            };
        }
    }

    /**
     * An array containing return value information for each call to the stub.
     *
     * @return {Array} An array of return values.
     */
    get responses() {
        return this._responses;
    }

    /**
     * The return value from the first call to the stub.
     *
     * @return {Object} The return value from the first call to the stub.
     */
    get ret() {
        return this.responses.length > 0? this.responses[0].ret:undefined;
    }

    /**
     * The promise value returned by the first call to the stub.
     *
     * @return {Object} The promise value returned by the first call to the stub.
     */
    get promise() {
        return this.responses.length > 0? this.responses[0].promise:this._firstAsync.promise;
    }

    /**
     * The promise resolution function for the first call to the stub.
     *
     * @return {Object} The promise resolution function for the first call to
     *         the stub.
     */
    get resolve() {
        return this.responses.length > 0? this.responses[0].resolve:this._firstAsync.resolve;
    }

    /**
     * The promise rejection function for the first call to the stub.
     *
     * @return {Object} The promise rejection function for the first call to
     *         the stub.
     */
    get reject() {
        return this.responses.length > 0? this.responses[0].reject:this._firstAsync.reject;
    }

    /**
     * A reference to the created stub.
     *
     * @return {Object} Reference to the sinon stub object.
     */
    get stub() {
        return this._stub;
    }

    /**
     * Clears all responses that have been tracked up to this point.
     */
    clearResponses() {
        this.responses.splice(0);
    }

    /**
     * Clears all responses that have been tracked up to this point, and also
     * resets the stub.
     */
    reset() {
        this.stub.reset();
        this.responses.splice(0);
    }
}

/**
 * A mocker object that can be used to mock specific methods on an object.
 */
class ObjectMock {
    /**
     * @param {Object} [instance={}] An optional object that represents the
     *        container of the mock methods. If omitted, a default empty object
     *        will be used.
     */
    constructor(instance) {
        if(!instance || (instance instanceof Array) || typeof instance !== 'object') {
            instance = {};
        }
        this._instance = instance;
        this._ctor = _sinon.stub().returns(this._instance);
        this._methods = {};
    }

    /**
     * Returns a reference to the constructor of the mocked object.
     *
     * @return {Object} Reference to the object constructor.
     */
    get ctor() {
        return this._ctor;
    }

    /**
     * Reference to the original instance.
     *
     * @return {Object} Reference to the object instance.
     */
    get instance() {
        return this._instance;
    }

    /**
     * Reference to an object containing method stubs and additional
     * information regarding the stubs (for async methods).
     *
     * @return {Object} A map containing the info about defined stubs
     */
    get methods() {
        return this._methods;
    }

    /**
     * Adds a mock for the specified method.
     *
     * @param {Array|String} methods The name (or array of names) of the
     *        method(s) that will be mocked.  If the method does not exist,
     *        an error will be thrown, unless the create parameter is set to
     *        true.
     * @param {Object} [returnValue=undefined] An optional return value that
     *        will returned by the mock.
     * @param {Boolean} [create=false] If set to true, creates the method if
     *        one does not exist.
     *
     * @return {Object} A reference to the mock object (can be used to chain
     *         method calls)
     */
    addMock(methods, returnValue, create) {
        if(!(methods instanceof Array)) {
            methods = [ methods ];
        }
        methods.forEach((method) => {
            this.methods[method] = new Stub(this.instance, method, returnValue, create, false);
        });
        return this;
    }

    /**
     * Adds a mock for the specified async method. This method returns a promise
     * that can be resolved/rejected to continue the flow.
     *
     * @param {Array|String} methods The name (or array of names) of the
     *        method(s) that will be mocked.  If the method does not exist,
     *        an error will be thrown, unless the create parameter is set to
     *        true.
     * @param {Boolean} [create=false] If set to true, creates the method if
     *        one does not exist.
     *
     * @return {Object} A reference to the mock object (can be used to chain
     *         method calls)
     */
    addAsyncMock(methods, create) {
        if(!(methods instanceof Array)) {
            methods = [ methods ];
        }
        methods.forEach((method) => {
            this.methods[method] = new Stub(this.instance, method, undefined, create, true);
        });
        return this;
    }

    /**
     * Removes a mock for the specified method (sync or async). If no mocks have
     * been defined for the specified method name, no changes will be made for
     * that method.
     *
     * @param {Array|String} methods The name (or array of names) of the
     *        method(s) for which mocks will be removed.
     *
     * @return {Object} A reference to the mock object (can be used to chain
     *         method calls)
     */
    removeMock(methods) {
        if(!(methods instanceof Array)) {
            methods = [ methods ];
        }
        methods.forEach((method) => {
            if(this.methods[method]) {
                this.methods[method].stub.restore();
                delete this.methods[method];
            }
        });
    }
}

module.exports = ObjectMock;
