/* jshint node:true, expr:true */
'use strict';

var _sinon = require('sinon');
var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _assertionHelper = require('../../lib/assertion-helper');

describe('object', function() {

    var EMPTY_FUNC = function() {
    };

    it('should expose methods required by the interface', function() {
        expect(_assertionHelper).to.have.property('getNotifySuccessHandler').and.to.be.a('function');
        expect(_assertionHelper).to.have.property('getNotifyFailureHandler').and.to.be.a('function');
        expect(_assertionHelper).to.have.property('getDelayedRunner').and.to.be.a('function');
        expect(_assertionHelper).to.have.property('getResolver').and.to.be.a('function');
    });

    describe('getNotifySuccessHandler()', function() {
        it('should throw an error if invoked with an invalid done callback', function() {
            var error = 'invalid done callback method specified (arg #1)';
            
            function createHandler(done) {
                return function() {
                    return _assertionHelper.getNotifySuccessHandler(done);
                }
            }

            expect(createHandler()).to.throw(error);
            expect(createHandler(null)).to.throw(error);
            expect(createHandler('')).to.throw(error);
            expect(createHandler('foo')).to.throw(error);
            expect(createHandler(123)).to.throw(error);
            expect(createHandler(true)).to.throw(error);
            expect(createHandler({})).to.throw(error);
            expect(createHandler([])).to.throw(error);
        });

        it('should return a function when invoked', function() {
            var callback = _assertionHelper.getNotifySuccessHandler(EMPTY_FUNC);

            expect(callback).to.be.a('function');
        });

        it('should invoke the callback with no parameters when the return function is invoked', function() {
            var spy = _sinon.spy();

            var callback = _assertionHelper.getNotifySuccessHandler(spy);

            expect(spy).not.to.have.been.called;
            callback();
            expect(spy).to.have.been.calledOnce.calledWithExactly();
        });
    });

    describe('getNotifyFailureHandler()', function() {
        it('should throw an error if invoked with an invalid done callback', function() {
            var error = 'invalid done callback method specified (arg #1)';
            
            function createHandler(done) {
                return function() {
                    return _assertionHelper.getNotifyFailureHandler(done);
                }
            }

            expect(createHandler()).to.throw(error);
            expect(createHandler(null)).to.throw(error);
            expect(createHandler('')).to.throw(error);
            expect(createHandler('foo')).to.throw(error);
            expect(createHandler(123)).to.throw(error);
            expect(createHandler(true)).to.throw(error);
            expect(createHandler({})).to.throw(error);
            expect(createHandler([])).to.throw(error);
        });

        it('should return a function when invoked', function() {
            var callback = _assertionHelper.getNotifyFailureHandler(EMPTY_FUNC);

            expect(callback).to.be.a('function');
        });

        it('should invoke the callback with the error object when the return function is invoked', function() {
            var errorMessage = 'something went wrong';
            var spy = _sinon.spy();

            var callback = _assertionHelper.getNotifyFailureHandler(spy);

            expect(spy).not.to.have.been.called;
            callback(errorMessage);
            expect(spy).to.have.been.calledOnce.calledWithExactly(errorMessage);
        });
    });

    describe('getDelayedRunner()', function() {
        it('should throw an error if invoked with an invalid task wrapper', function() {
            var error = 'invalid task wrapper specified (arg #1)';
            
            function getDelayedRunner(task) {
                return function() {
                    return _assertionHelper.getDelayedRunner(task);
                }
            }

            expect(getDelayedRunner()).to.throw(error);
            expect(getDelayedRunner(null)).to.throw(error);
            expect(getDelayedRunner('')).to.throw(error);
            expect(getDelayedRunner('foo')).to.throw(error);
            expect(getDelayedRunner(123)).to.throw(error);
            expect(getDelayedRunner(true)).to.throw(error);
            expect(getDelayedRunner({})).to.throw(error);
            expect(getDelayedRunner([])).to.throw(error);
        });

        it('should throw an error if invoked with an invalid delay', function() {
            var error = 'invalid delay specified - should be a non negative number (arg #2)';
            
            function getDelayedRunner(delay) {
                return function() {
                    return _assertionHelper.getDelayedRunner(EMPTY_FUNC, delay);
                }
            }

            expect(getDelayedRunner()).to.throw(error);
            expect(getDelayedRunner(null)).to.throw(error);
            expect(getDelayedRunner('')).to.throw(error);
            expect(getDelayedRunner('foo')).to.throw(error);
            expect(getDelayedRunner(-123)).to.throw(error);
            expect(getDelayedRunner(true)).to.throw(error);
            expect(getDelayedRunner({})).to.throw(error);
            expect(getDelayedRunner([])).to.throw(error);
        });

        it('should return a function when invoked with correct parameters', function() {
            var runner = _assertionHelper.getDelayedRunner(EMPTY_FUNC, 100);

            expect(runner).to.be.a('function');
        });

        it('should return a promise when the runner function is invoked', function() {
            var runner = _assertionHelper.getDelayedRunner(EMPTY_FUNC, 100);
            var ret = runner();

            expect(ret).to.be.a('object');
            expect(ret).to.have.property('then').and.to.be.a('function');
        });

        it('should resolve the promise after a delay when the runner function is invoked with a non erroring task', function(done) {
            var delay = 100;
            var tolerance = 10;
            var runner = _assertionHelper.getDelayedRunner(EMPTY_FUNC, delay);
            var startTime = Date.now();
            var ret = runner();

            expect(ret).to.be.fulfilled.then(function() {
                try{
                    var endTime = Date.now();
                    expect(endTime - startTime).to.be.within(delay, delay + tolerance);
                    done();
                } catch (ex) {
                    done(ex);
                }
            }, function(err) {
                done(err);
            });
        });

        it('should reject the promise after a delay when the runner function is invoked with a erroring task', function(done) {
            var error = 'something went wrong';
            var delay = 100;
            var tolerance = 7;
            var runner = _assertionHelper.getDelayedRunner(function() {
                throw new Error(error);
            }, delay);
            var startTime = Date.now();
            var ret = runner();

            expect(ret).to.be.rejected.then(function() {
                try{
                    var endTime = Date.now();
                    expect(endTime - startTime).to.be.within(delay, delay + tolerance);
                    done();
                } catch (ex) {
                    done(ex);
                }
            }, function(err) {
                done(err);
            });
        });
    });

    describe('getResolver()', function() {

        function _getDeferred() {
            return {
                resolve: _sinon.spy(),
                reject: _sinon.spy()
            };
        }

        it('should throw an error if invoked without a valid deferred object', function() {
            var error = 'invalid deferred object specified for resolver (arg #1)'; 
            function invokeMethod(def) {
                return function() {
                   _assertionHelper.getResolver(def); 
                };
            };

            expect(invokeMethod()).to.throw(error);
            expect(invokeMethod('string')).to.throw(error);
            expect(invokeMethod(123)).to.throw(error);
            expect(invokeMethod(true)).to.throw(error);
            expect(invokeMethod({})).to.throw(error);
            expect(invokeMethod([])).to.throw(error);
        });

        it('should return a function when invoked with a valid deferred object', function() {
            var def = _getDeferred();
            var callback = _assertionHelper.getResolver(def);

            expect(callback).to.be.a('function');
        });

        it('should resolve the deferred with correct arguments if the callback is invoked without an error', function() {
            var def = _getDeferred();
            var arg1 = 'data1';
            var arg2 = 'data2';
            var callback = _assertionHelper.getResolver(def);

            expect(def.resolve).to.not.have.been.called;
            expect(def.reject).to.not.have.been.called;

            callback(null);
            expect(def.resolve).to.have.been.calledWithExactly();
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();

            callback(null, arg1);
            expect(def.resolve).to.have.been.calledWithExactly(arg1);
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();

            callback(null, arg1, arg2);
            expect(def.resolve).to.have.been.calledWithExactly(arg1, arg2);
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();
        });

        it('should resolve the deferred with the specified arguments when the resolveArgs parameter is specified', function() {
            var def = _getDeferred();
            var arg1 = 'data1';
            var arg2 = 'data2';
            var resolveArgs = 'foo';
            var callback = _assertionHelper.getResolver(def, resolveArgs);

            expect(def.resolve).to.not.have.been.called;
            expect(def.reject).to.not.have.been.called;

            callback(null);
            expect(def.resolve).to.have.been.calledWithExactly(resolveArgs);
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();

            callback(null, arg1);
            expect(def.resolve).to.have.been.calledWithExactly(resolveArgs);
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();

            callback(null, arg1, arg2);
            expect(def.resolve).to.have.been.calledWithExactly(resolveArgs);
            expect(def.reject).to.not.have.been.called;
            def.resolve.reset();
        });

        it('should reject the deferred with the error if the callback is invoked with an error', function() {
            var def = _getDeferred();
            var error = 'something went wrong';
            var callback = _assertionHelper.getResolver(def);

            expect(def.resolve).to.not.have.been.called;
            expect(def.reject).to.not.have.been.called;

            callback(error);
            expect(def.resolve).to.not.have.been.called;
            expect(def.reject).to.have.been.calledWithExactly(error);
        });
    });
});
