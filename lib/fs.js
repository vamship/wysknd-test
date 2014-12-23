/* jshint node:true, expr:true */
'use strict';

var _fs = require('fs');
var _utils = require('./utils');

module.exports = {
    /**
     * Creates all of the folders specified in the array.
     */
    createFolders: function() {
        var items = _utils.getArgArray(arguments);
        if (items.length === 0) {
            throw new Error('no folders specified to create');
        }
        items.forEach(function(item) {
            try {
                _fs.mkdirSync(item);
            } catch (e) {
                // Eat the exception.
            }
        });
    },

    /**
     * Creates all of the files specified in the array.
     */
    createFiles: function() {
        var items = _utils.getArgArray(arguments);
        if (items.length === 0) {
            throw new Error('no files specified to create');
        }
        items.forEach(function(item) {
            var contents;
            var linkTarget;
            var filePath;
            if (typeof item === 'object') {
                filePath = item.path;
                contents = item.contents || '';
                linkTarget = item.linkTo;
            } else if (typeof item === 'string') {
                filePath = item;
                contents = '';
            }
            if (typeof filePath !== 'string' || filePath.length === 0) {
                throw new Error('file path not specified');
            }

            contents = contents || '';
            try {
                if (!!linkTarget) {
                    _fs.symlinkSync(linkTarget, filePath);
                } else {
                    _fs.writeFileSync(filePath, contents);
                }
            } catch (e) {
                // Eat the exception.
            }
        });
    },

    /**
     * Cleans up all of the folders specified in the array. If the folder
     * does not exist, the resultant error will be ignored.
     */
    cleanupFolders: function() {
        var items = _utils.getArgArray(arguments);
        if (items.length === 0) {
            throw new Error('no folders specified to clean up');
        }
        items.forEach(function(item) {
            try {
                _fs.rmdirSync(item);
            } catch (e) {
                // Eat the exception.
            }
        });
    },

    /**
     * Cleans up all of the files specified in the array. If the file
     * does not exist, the resultant error will be ignored.
     */
    cleanupFiles: function() {
        var items = _utils.getArgArray(arguments);
        if (items.length === 0) {
            throw new Error('no files specified to clean up');
        }
        items.forEach(function(item) {
            try {
                var path = (typeof item === 'string') ? item : item.path;
                _fs.unlinkSync(path);
            } catch (e) {
                // Eat the exception.
            }
        });
    }
}
