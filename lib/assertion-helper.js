/* jshint node:true, expr:true */
'use strict';

var _q = require('q');

module.exports = {

    /**
     * Creates a handler that can be used to notify the test framework that all
     * assertions have been executed successfully.
     *
     * @param {Function} done The callback method used to notify the framework
     *                        of successful test execution.
     * @return {Function} A wrapper function that signals successful execution
     *                    to the test framework.
     */
    getNotifySuccessHandler: function(done) {
        if(typeof done !== 'function') {
            throw new Error('invalid done callback method specified (arg #1)');
        }

        return function(){
            done();
        }
    },

    /**
     * Creates a handler that can be used to notify the test framework that one
     * or more assertions failed.
     *
     * @param {Function} done The callback method used to notify the framework
     *                        of an error in test execution.
     * @return {Function} A wrapper function that signals an error when
     *                    executing test assertions.
     */
    getNotifyFailureHandler: function(done) {
        if(typeof done !== 'function') {
            throw new Error('invalid done callback method specified (arg #1)');
        }

        return function(err) {
            done(err);
        }
    },

    /**
     * Helper method that executes a function and rejects/resolves the passed
     * in deferred object based on whether or not the function executed without
     * errors. If the function returns a promise, eventual rejection/resolution
     * will be tied to the resolution/rejection of that promise (unless an
     * exception is thrown first).
     *
     * @param {Function} tasks A parameterless function that encapsulates the
     *                   tasks to be executed.
     * @param {Object} [deferred] A deferred object that will be rejected or
     *                 resolved based on whether or not the tasks execute
     *                 successfully. If omitted, a new deferred object will
     *                 be created and returned.
     * @return {Object} A promise that will be rejected or resolved based on
     *                  the status of execution of the tasks.
     */
    runDeferred: function(expectations, deferred) {
        if(typeof expectations !== 'function') {
            throw new Error('invalid expectation wrapper specified (arg #1)');
        }

       deferred = deferred || _q.defer();
       try {
           var ret = expectations();
           // Poor man's check to see if the return value is a promise.
           if(ret && typeof ret.then === 'function') {
               ret.then(function(data) {
                   deferred.resolve(data);
               }, function(err) {
                   deferred.reject(err);
               });
           } else {
               deferred.resolve(ret);
           }
       } catch(ex) {
           if(ex.message) {
               deferred.reject(ex.message);
           } else {
               deferred.reject(_util.inspect(ex));
           }
       }
       return deferred;
    },

    /**
     * Gets a method that executes the specified task after a delay. The method
     * also returns a promise that will be resolved or rejected based on the
     * whether or not the task executed without errors.
     *
     * @param {Function} task The task to execute after delay, wrapped in a
     *                   parameterless function.
     * @param {Number} delay The delay (in milliseconds) after which the task
     *                 will be executed.
     *
     * @return {Function} A function that can be used to trigger the delayed
     *                    execution of the task. This function will return
     *                    a promise after execution.
     */
    getDelayedRunner: function(task, delay) {
        if(typeof task !== 'function') {
            throw new Error('invalid task wrapper specified (arg #1)');
        }

        if(typeof delay !== 'number' || delay < 0) {
            throw new Error('invalid delay specified - should be a non negative number (arg #2)');
        }

        var taskWrapper = function(data) {
            return task(data);
        };
        return function() {
            var deferred = _q.defer();
            setTimeout(function(){
                module.exports.runDeferred(taskWrapper, deferred);
            }, delay);
            return deferred.promise;
        };
    },

    /**
     * Returns a promise that will be resolved after a specific delay.
     *
     * @param {Number} delay The delay (in milliseconds) after which the
     *                 promise will be resolved.
     * @return {Object} A promise that will be resolved once the delay
     *                  expires.
     */
    wait: function(delay) {
        return mod.getDelayedRunner(function(data) {
            return data;
        }, delay);
    },

    /**
     * Returns a handler that has a nodejs style callback signature
     * callback(err, args ...), and uses the value of the first parameter (err)
     * to appropriately resolve or reject the specified deferred object.
     *
     * @param {Object} def A CommonJS compliant deferred object.
     * @return {Function} A callback function that follows the nodejs
     *                   callback convention, which will resolve/reject
     *                   the deferred object based on invocation parameters.
     */
    getResolver: function(def) {
        if(typeof def !== 'object' ||
           typeof def.reject !== 'function' ||
           typeof def.resolve !== 'function') {
            throw new Error('invalid deferred object specified for resolver (arg #1)');
        }

        return function(err) {
            if(err) {
                def.reject(err);
            } else {
                var args = Array.prototype.slice.call(arguments, 1);
                def.resolve.apply(def, args);
            }
        };
    }
}
