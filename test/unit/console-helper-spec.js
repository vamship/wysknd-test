/* jshint node:true, expr:true */
'use strict';

var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _consoleHelper = require('../../lib/console-helper');

describe('consoleHelper', function() {
    it('should expose methods required by the interface', function() {
        expect(_consoleHelper).to.have.property('mute').and.to.be.a('function');
        expect(_consoleHelper).to.have.property('unmute').and.to.be.a('function');
    });
});
