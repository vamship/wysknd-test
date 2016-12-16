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
     * Helper that provides arrays of test values
     */
    testValueProvider: require('./test-value-provider'),

    /**
     * Helper to mute/unmute console output.
     */
    consoleHelper: require('./console-helper'),

    /**
     * Helper to mock config objects.
     */
    ConfigMockBuilder: require('./config-mock-builder'),

    /**
     * Helper to mock logger objects.
     */
    LoggerMockBuilder: require('./logger-mock-builder'),

    /**
     * Returns a reference to the AWS specific test helpers contained
     * by this library.
     */
    aws: require('./aws'),
}
