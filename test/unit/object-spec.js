/* jshint node:true, expr:true */
'use strict';

var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _object = require('../../lib/object');

describe('object', function() {

    it('should expose methods required by the interface', function() {
        expect(_object).to.have.property('verifyInterface').and.to.be.a('function');
    });

    describe('verifyInterface(): ', function() {

        it('should throw an error if the target arg is invalid', function() {
            var error = 'target object not specified, or is not valid (arg #1)';

            expect(function() {
                _object.verifyInterface();
            }).to.throw(error);
            expect(function() {
                _object.verifyInterface('bad arg');
            }).to.throw(error);
            expect(function() {
                _object.verifyInterface([]);
            }).to.throw(error);
        });

        it('should throw an error if the interface arg is invalid', function() {
            var error = 'expected interface not specified, or is not valid (arg #2)';

            expect(function() {
                _object.verifyInterface({});
            }).to.throw(error);
            expect(function() {
                _object.verifyInterface({}, 'bad arg');
            }).to.throw(error);
            expect(function() {
                _object.verifyInterface({}, []);
            }).to.throw(error);
        });

        it('should throw no errors if both target and expected interface are empty objects', function() {
            var errors = _object.verifyInterface({}, {});

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(0)
        });

        it('should identify expected members that are not present in the target', function() {
            var target = {};
            var expectedInterface = {
                foo: 'string',
                bar: 'function',
                baz: 'object',
                num: 'number',
                bool: 'boolean'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(5)
            expect(errors[0]).to.equal('Expected member not defined: [foo]');
            expect(errors[1]).to.equal('Expected member not defined: [bar]');
            expect(errors[2]).to.equal('Expected member not defined: [baz]');
            expect(errors[3]).to.equal('Expected member not defined: [num]');
            expect(errors[4]).to.equal('Expected member not defined: [bool]');
        });

        it('should identify expected members that have an unexpected type in the target', function() {
            var target = {
                foo: 1,
                bar: 'function',
                baz: 'object',
                num: 'number',
                bool: 'boolean'
            };
            var expectedInterface = {
                foo: 'string',
                bar: 'function',
                baz: 'object',
                num: 'number',
                bool: 'boolean'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(5);
            expect(errors[0]).to.equal('Expected member [foo] to be of type [string], but was of type [number] instead');
            expect(errors[1]).to.equal('Expected member [bar] to be of type [function], but was of type [string] instead');
            expect(errors[2]).to.equal('Expected member [baz] to be of type [object], but was of type [string] instead');
            expect(errors[3]).to.equal('Expected member [num] to be of type [number], but was of type [string] instead');
            expect(errors[4]).to.equal('Expected member [bool] to be of type [boolean], but was of type [string] instead');
        });

        it('should identify additional members in the target that are not in the expected interface as errors by default', function() {
            var target = {
                foo: 1,
                bar: function() {}
            };
            var expectedInterface = {
                foo: 'number'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(1);
            expect(errors[0]).to.equal('Expected member [bar] to be of type [undefined], but was of type [function] instead');
        });

        it('should ignore additional members in the target that are not in the expected interface when explicitly requested to do so', function() {
            var target = {
                foo: 1,
                bar: function() {}
            };
            var expectedInterface = {
                foo: 'number'
            };

            var errors = _object.verifyInterface(target, expectedInterface, true);

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(0);
        });

        it('should ignore members in the target that are marked "ignore" in the expected interface', function() {
            var target = {
                foo: 1,
                bar: function() {}
            };
            var expectedInterface = {
                foo: 'number',
                bar: 'ignore'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).to.be.true;
            expect(errors).to.have.length(0);
        });
    });
});
