/* jshint node:true, expr:true */
'use strict';

const Promise = require('bluebird').Promise;

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

        return function(data) {
            return new Promise((resolve, reject) => {
                setTimeout(function(){
                    try {
                        const ret = task(data);
                        resolve(data);
                    } catch (ex) {
                        reject(ex);
                    }
                }, delay);
            });
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
        return module.exports.getDelayedRunner(function(data) {
            return data;
        }, delay);
    },

    /**
     * Returns a handler that has a nodejs style callback signature
     * callback(err, args ...), and uses the value of the first parameter (err)
     * to appropriately resolve or reject the specified deferred object.
     *
     * @param {Object} def A CommonJS compliant deferred object.
     * @param {Boolean} [resolveArgs=null] Optional parameters that will override
     *                  the arguments passed to resolve(), irrespective of what
     *                  was passed via the callback.
     * @return {Function} A callback function that follows the nodejs
     *                   callback convention, which will resolve/reject
     *                   the deferred object based on invocation parameters.
     */
    getResolver: function(def, resolveArgs) {
        if(typeof def !== 'object' ||
           typeof def.reject !== 'function' ||
           typeof def.resolve !== 'function') {
            throw new Error('invalid deferred object specified for resolver (arg #1)');
        }

        return function(err) {
            if(err) {
                def.reject(err);
            } else {
                if(resolveArgs) {
                    def.resolve(resolveArgs);
                } else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    def.resolve.apply(def, args);
                }
            }
        };
    }
}
