'use strict';

const _clone = require('clone');

/**
 * Exposes methods that return input value arrays for testing.
 */
const testValueProvider = {

    /**
     * Returns an array of values that has valid samples of all types except
     * a string.
     *
     * @return {Array} An array of test values
     */
    allButString: function() {
        return _clone([ undefined, null, 123, '', true, {}, [], function() {} ]);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * a number.
     *
     * @return {Array} An array of test values
     */
    allButNumber: function() {
        return _clone([ undefined, null, -1, 'abc', true, {}, [], function() {} ]);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * an object.
     *
     * @return {Array} An array of test values
     */
    allButObject: function() {
        return _clone([ undefined, null, 123, 'abc', true, [], function() {} ]);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * an array.
     *
     * @return {Array} An array of test values
     */
    allButArray: function() {
        return _clone([ undefined, null, 123, 'abc', true, {}, function() {} ]);
    },

    /**
     * Returns an array of values that has valid samples of all types except
     * a function.
     *
     * @return {Array} An array of test values
     */
    allButFunction: function() {
        return _clone([ undefined, null, 123, 'abc', true, {} ]);
    }
}

module.exports = testValueProvider;
