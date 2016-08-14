/* jshint node:true, expr:true */
'use strict';

const methodNames = [ 'log', 'info', 'warn', 'error' ];
const consoleMethods = {
};

module.exports = {
    /**
     * Replaces all console messages with dummy implementations, effectively
     * muting all console related output. This action can be undone by invoking
     * unmute();
     */
    mute: function() {
        methodNames.forEach((method) => {
            consoleMethods[method] = console[method];
            console[method] = () => {};
        });
    },

    
    
    /**
     * Unmutes all console output methods by restoring previously saved
     * references to the methods.
     */
    unmute: function() {
       for(let method in consoleMethods) {
           console[method] = consoleMethods[method];
       }
    }
}
