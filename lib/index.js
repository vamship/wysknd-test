/* jshint node:true, expr:true */
'use strict';

module.exports = {
    /**
     * File system utils.
     */
    fs: require('./fs'),

    /**
     * Object testing utils.
     */
    object: require('./object'),

    /**
     * General purpose utils.
     */
    utils: require('./utils'),

    /**
     * Helper methods that can be used when evaluating assertions.
     */
    assertionHelper: require('./assertion-helper'),

    /**
     * Wrapper class that can be used to test lambda functions.
     */
    AwsLambdaWrapper: require('./aws-lambda-wrapper'),

    /**
     * Helper class that can be used to generate aws lambda contexts.
     */
    AwsLambdaContext: require('./aws-lambda-context'),

    /**
     * Helper that provides arrays of test values
     */
    testValueProvider: require('./test-value-provider'),

    /**
     * Helper to mute/unmute console output.
     */
    consoleHelper: require('./console-helper')
}
