'use strict';

var _object = require('../../lib/index').object;

describe('object: ', function() {

    it('should expose methods required by the interface', function() {
       expect(typeof _object.verifyInterface).toBe('function'); 
    });

    describe('object.verifyInterface(): ', function() {

        it('should throw an error if the target arg is invalid', function() {
            var error = 'target object not specified, or is not valid (arg #1)';

           expect(function() {_object.verifyInterface(); }).toThrow(error); 
           expect(function() {_object.verifyInterface('bad arg'); }).toThrow(error); 
           expect(function() {_object.verifyInterface([]); }).toThrow(error); 
        });

        it('should throw an error if the interface arg is invalid', function() {
            var error = 'expected interface not specified, or is not valid (arg #2)';

           expect(function() {_object.verifyInterface({}); }).toThrow(error); 
           expect(function() {_object.verifyInterface({}, 'bad arg'); }).toThrow(error); 
           expect(function() {_object.verifyInterface({}, []); }).toThrow(error); 
        });

        it('should throw no errors if both target and expected interface are empty objects', function() {
            var errors = _object.verifyInterface({}, {});

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(0);
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

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(5);
            expect(errors[0]).toBe('Expected member not defined: [foo]');
            expect(errors[1]).toBe('Expected member not defined: [bar]');
            expect(errors[2]).toBe('Expected member not defined: [baz]');
            expect(errors[3]).toBe('Expected member not defined: [num]');
            expect(errors[4]).toBe('Expected member not defined: [bool]');
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

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(5);
            expect(errors[0]).toBe('Expected member [foo] to be of type [string], but was of type [number] instead');
            expect(errors[1]).toBe('Expected member [bar] to be of type [function], but was of type [string] instead');
            expect(errors[2]).toBe('Expected member [baz] to be of type [object], but was of type [string] instead');
            expect(errors[3]).toBe('Expected member [num] to be of type [number], but was of type [string] instead');
            expect(errors[4]).toBe('Expected member [bool] to be of type [boolean], but was of type [string] instead');
        });

        it('should identify additional members in the target that are not in the expected interface as errors by default', function() {
            var target = {
                foo: 1,
                bar: function(){}
            };
            var expectedInterface = {
                foo: 'number'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(1);
            expect(errors[0]).toBe('Expected member [bar] to be of type [undefined], but was of type [function] instead');
        });

        it('should ignore additional members in the target that are not in the expected interface when explicitly requested to do so', function() {
            var target = {
                foo: 1,
                bar: function(){}
            };
            var expectedInterface = {
                foo: 'number'
            };

            var errors = _object.verifyInterface(target, expectedInterface, true);

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(0);
        });

        it('should ignore members in the target that are marked "ignore" in the expected interface', function() {
            var target = {
                foo: 1,
                bar: function(){}
            };
            var expectedInterface = {
                foo: 'number',
                bar: 'ignore'
            };

            var errors = _object.verifyInterface(target, expectedInterface);

            expect(errors instanceof Array).toBe(true);
            expect(errors.length).toBe(0);
        });
    });
});
