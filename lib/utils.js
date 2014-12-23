/* jshint node:true, expr:true */
'use strict';

module.exports = {
    /**
     * Converts input arguments into an addy of args. If the first arg is an
     * array, it is used as is. If not, all input args are converted into a
     * single array.
     *
     * @param {Object} args The arguments object to be converted into an array.
     * @return {Array} An array representing the parsed arguments.
     */
    getArgArray: function(args) {
        if (!args) {
            return [];
        }

        if (args[0] instanceof Array) {
            return args[0];
        }
        return Array.prototype.slice.call(args, 0);
    }
}
