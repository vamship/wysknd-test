/* jshint node:true, expr:true */
'use strict';

var _fs = require('fs');
var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _index = require('../../lib/index');

describe('index: ', function() {
    it('should expose methods required by the interface', function() {
        expect(_index).to.have.property('fs').to.be.an('object');
        expect(_index).to.have.property('object').to.be.an('object');
        expect(_index).to.have.property('utils').to.be.an('object');
        expect(_index).to.have.property('assertionHelper').to.be.an('object');
    });
});
