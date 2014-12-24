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
    assertionHelper: require('./assertion-helper')
}
