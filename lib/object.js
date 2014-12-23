/* jshint node:true, expr:true */
'use strict';

module.exports = {
    /**
     * Tests that the given object matches the specified interface.
     *
     * NOTE: This functionality is also available via a few mocha assertions,
     * and those can be used instead. This method is being retained for
     * backwards compatibility purposes.
     *
     * @param {Object} target The target object whose interface is being
     *                        verified.
     * @param {Object} expectedInterface An object that defines the expected
     *                        interface.
     * @param {boolean} [ignoreExtra = false] An optional parameter that
     *                        indicates whether or not extra methods in the
     *                        target will result in errors.
     * @return {Array} An array containing error messages (if any).
     */
    verifyInterface: function(target, expectedInterface, ignoreExtra) {
        if (typeof target !== 'object' || target instanceof Array) {
            throw new Error('target object not specified, or is not valid (arg #1)');
        }

        if (typeof expectedInterface !== 'object' || expectedInterface instanceof Array) {
            throw new Error('expected interface not specified, or is not valid (arg #2)');
        }
        var errors = [];
        var prop;

        // Make sure that every expected member exists.
        for (prop in expectedInterface) {
            if (!target[prop]) {
                errors.push('Expected member not defined: [' + prop + ']');
            }
        }

        // Make sure that every member has the correct type. This second
        // iteration will also ensure that no additional methods are
        // defined in the target.
        for (prop in target) {
            if (target.hasOwnProperty(prop)) {
                var expectedType = expectedInterface[prop] || 'undefined';
                if (expectedType !== 'undefined' || !ignoreExtra) {
                    var propertyType = (typeof target[prop]);
                    if (expectedType !== 'ignore' && propertyType !== expectedType) {
                        errors.push('Expected member [' + prop +
                            '] to be of type [' + expectedType +
                            '], but was of type [' + propertyType +
                            '] instead');
                    }
                }
            }
        }

        return errors;
    }
}
