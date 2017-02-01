/* jshint node:true, expr:true */
'use strict';

var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _testValueProvider = require('../../lib/test-value-provider');

describe('testValueProvider', () => {

    function _getExpectedValues() {
        return {
            primitives: [ undefined, null, 123, 'abc', true ],
            complex: [ 'object', 'array', 'function' ]
        };
    }

    function _checkResults(values, expectedValues) {
        expectedValues.extra = expectedValues.extra || [];
        expectedValues.primitives.forEach((item, index) => {
            expect(values[index]).to.equal(item);
        });

        let baseIndex = expectedValues.primitives.length;

        expect(values).to.be.an('array');
        expectedValues.complex.forEach((itemType, index) => {
            expect(values[baseIndex + index]).to.be.an(itemType);
            if(itemType !== 'function') {
                expect(values[index + baseIndex]).to.be.empty;
            }
        });

        baseIndex += expectedValues.complex.length;
        expectedValues.extra.forEach((item, index) => {
            expect(values[baseIndex + index]).to.equal(item);
        });
    }

    it('should expose methods required by the interface', function() {
        expect(_testValueProvider.allButSelected).to.be.a('function');
        expect(_testValueProvider.allButString).to.be.a('function');
        expect(_testValueProvider.allButNumber).to.be.a('function');
        expect(_testValueProvider.allButObject).to.be.a('function');
        expect(_testValueProvider.allButArray).to.be.a('function');
        expect(_testValueProvider.allButFunction).to.be.a('function');
        expect(_testValueProvider.allButBoolean).to.be.a('function');
    });

    describe('allButSelected()', () => {
        it('should return an array of all test values when invoked without arguments', () => {
            const values = _testValueProvider.allButSelected();
            const expectedValues = _getExpectedValues();

            _checkResults(values, expectedValues);
        });

        it('should omit undefined values if one of the arguments is "undefined"', () => {
            const values = _testValueProvider.allButSelected('undefined');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(0, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit null values if one of the arguments is "null"', () => {
            const values = _testValueProvider.allButSelected('null');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(1, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit null values if one of the arguments is "number"', () => {
            const values = _testValueProvider.allButSelected('number');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(2, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit null values if one of the arguments is "string"', () => {
            const values = _testValueProvider.allButSelected('string');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(3, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit null values if one of the arguments is "boolean"', () => {
            const values = _testValueProvider.allButSelected('boolean');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(4, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit object values if one of the arguments is "object"', () => {
            const values = _testValueProvider.allButSelected('object');
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(0, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit array values if one of the arguments is "array"', () => {
            const values = _testValueProvider.allButSelected('array');
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(1, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit function values if one of the arguments is "function"', () => {
            const values = _testValueProvider.allButSelected('function');
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(2, 1);
            _checkResults(values, expectedValues);
        });

        it('should omit multiple arguments when multiple args are specified', () => {
            const values = _testValueProvider.allButSelected('function', 'string');
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(3, 1);
            expectedValues.complex.splice(2, 1);
            _checkResults(values, expectedValues);
        });
    });

    describe('allButUndefined()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButUndefined();
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(0, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButUndefined.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(0, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButNull()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButNull();
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(1, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButNull.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(1, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButNumber()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButNumber();
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(2, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButNumber.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(2, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButString()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButString();
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(3, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButString.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(3, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButObject()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButObject();
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(0, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButObject.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(0, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButArray()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButArray();
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(1, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButArray.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(1, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButFunction()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButFunction();
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(2, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButFunction.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.complex.splice(2, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });

    describe('allButBoolean()', () => {

        it('should return an array with expected values when invoked', () => {
            const values = _testValueProvider.allButBoolean();
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(4, 1);
            _checkResults(values, expectedValues);
        });

        it('should append the specified arguments to the return array', () => {
            const appendedValues = ['foo', -1, '', false];
            const values = _testValueProvider.allButBoolean.apply(_testValueProvider, appendedValues);
            const expectedValues = _getExpectedValues();

            expectedValues.primitives.splice(4, 1);
            expectedValues.extra = appendedValues;
            _checkResults(values, expectedValues);
        });
    });
});
