'use strict';

const _clone = require('clone');

/**
 * Exposes methods that return input value arrays for testing.
 */
const testValueProvider = {

    /**
     * Returns an array of test values, omitting the requested arg types.
     *
     * @param {Array} argsToOmit Args to be omitted from the test values.
     *
     * @return {Array} An array of test values
     */
    allButSelected: function(argsToOmit) {
        if(!(argsToOmit instanceof Array)) {
            argsToOmit = Array.prototype.splice.call(arguments, 0);
        }
        const values = [ undefined, null, 123, 'abc', true, {}, [], function() {} ];

        return values.filter((testValue) => {
            let include = true;
            argsToOmit.forEach((itemToOmit) => {
                if((itemToOmit === 'null')  &&
                   testValue === null) {
                    include = false;
                 } else if (itemToOmit === 'array' &&
                            testValue instanceof Array) {
                    include = false;
                } else if (testValue instanceof Array || testValue === null) {
                    // Do nothing, because typeof Array or typeof null
                    // evaluates to "object"
                } else if (typeof testValue === itemToOmit) {
                    include = false;
                }
            });
            return include;
        });
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * a string.
     *
     * @param {...} args Optional extra parameters to append to the result
     * @return {Array} An array of test values
     */
    allButString: function() {
        const extra = Array.prototype.splice.call(arguments, 0);
        return [ undefined, null, 123, true, {}, [], function() {} ].concat(extra);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * a number.
     *
     * @param {...} args Optional extra parameters to append to the result
     * @return {Array} An array of test values
     */
    allButNumber: function() {
        const extra = Array.prototype.splice.call(arguments, 0);

        return [ undefined, null, 'abc', true, {}, [], function() {} ].concat(extra);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * an object.
     *
     * @param {...} args Optional extra parameters to append to the result
     * @return {Array} An array of test values
     */
    allButObject: function() {
        const extra = Array.prototype.splice.call(arguments, 0);
        return [ undefined, null, 123, 'abc', true, [], function() {} ].concat(extra);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * an array.
     *
     * @param {...} args Optional extra parameters to append to the result
     * @return {Array} An array of test values
     */
    allButArray: function() {
        const extra = Array.prototype.splice.call(arguments, 0);
        return [ undefined, null, 123, 'abc', true, {}, function() {} ].concat(extra);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * a function.
     *
     * @param {...} args Optional extra parameters to append to the result
     * @return {Array} An array of test values
     */
    allButFunction: function() {
        const extra = Array.prototype.splice.call(arguments, 0);
        return [ undefined, null, 123, 'abc', true, {}, [] ].concat(extra);
    }
}

module.exports = testValueProvider;
