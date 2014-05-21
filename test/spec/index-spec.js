'use strict';
var _fs = require('fs');
var _index = require('../../lib/index');

describe('index: ', function() {
    it('should expose methods required by the interface', function() {
       expect(typeof _index.fs).toBe('object'); 
       expect(typeof _index.object).toBe('object'); 
       expect(typeof _index.utils).toBe('object'); 
    });
});
