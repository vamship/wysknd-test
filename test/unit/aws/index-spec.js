'use strict';
/* jshint node:true, expr:true */

var _fs = require('fs');
var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _index = require('../../../lib/aws/index');

describe('[aws.index]', function() {
    it('should expose methods required by the interface', function() {
        expect(_index).to.have.property('LambdaWrapper').to.be.a('function');
        expect(_index).to.have.property('LambdaContext').to.be.a('function');
        expect(_index).to.have.property('DynamoDbHelper').to.be.a('function');
        expect(_index).to.have.property('AwsSdkMockBuilder').to.be.a('function');
    });
});
