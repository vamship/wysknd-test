'use strict';

const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const _clone = require('clone');

/**
 * Class that provides a wrapper around lambda handlers, and exposes utility
 * methods that can be used during testing.
 */
class LambdaWrapper {
    /**
     * @param {Object} handler Reference to the lambda handler.
     * @param {Object} [event={}] The event object to pass to the handler
     *        when invoked.
     */
    constructor(handler, event) {
        if(typeof handler !== 'function') {
            throw new Error('Invalid handler specified (arg #1)');
        }
        if(!event || typeof event !== 'object') {
            event = {};
        }
        this._handler = handler;
        this._event = _clone(event);
        this._callback = _sinon.spy();
        // TODO: At some point, the context object may have to be mocked
        // out for testing purposes.
        this._context = {};
    }

    /**
     * Returns a reference to the callback spy that is passed to the lambda
     * function.
     */
    get callback() {
        return this._callback;
    }

    /**
     * Returns a reference to the context object that is passed to the lambda
     * function.
     */
    get context() {
        return this._context;
    }

    /**
     * Returns a reference to the event object that is passed to the lambda
     * function.
     */
    get event() {
        return this._event;
    }

    /**
     * Invokes the lamdba function with predefined event, context and callback
     * values.
     */
    invoke() {
        this._handler(this._event, this._context, this._callback);
    }

    /**
     * Invokes the lamdba function, and evaluates the callback function for
     * invocation with specific errors.
     *
     * @param {Object} error Reference to the expected error when the lambda
     *        function is invoked.
     */
    testError(error) {
        this._callback.reset();
        this._handler(this._event, this._context, this._callback);

        expect(this._callback).to.have.been.calledOnce;

        const errorArg = this._callback.args[0][0];
        expect(errorArg).to.be.an.instanceof(Error);
        if(error instanceof RegExp) {
            expect(errorArg.message).to.match(error);
        } else {
            expect(errorArg.message).to.equal(error);
        }
    }
}

module.exports = LambdaWrapper;
