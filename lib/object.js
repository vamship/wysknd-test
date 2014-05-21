'use strict';

module.exports = {
    /*
     * Tests that the given object matches the specified interface.
     */
    verifyInterface: function(target, expectedInterface, ignoreExtra) {
        if(typeof target !== 'object' || target instanceof Array) {
            throw 'target object not specified, or is not valid (arg #1)';
        }

        if(typeof expectedInterface !== 'object'
                || expectedInterface instanceof Array) {
            throw 'expected interface not specified, or is not valid (arg #2)';
        }
        var errors = [];

        // Make sure that every expected member exists.
        for (var prop in expectedInterface) {
            if(!target[prop]) {
                errors.push('Expected member not defined: [' + prop + ']');
            }
        }

        // Make sure that every member has the correct type. This second
        // iteration will also ensure that no additional methods are
        // defined in the target.
        for (var prop in target) {
            if (target.hasOwnProperty(prop)) {
                var expectedType = expectedInterface[prop] || 'undefined';
                if(expectedType !== 'undefined' || !ignoreExtra) {
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
