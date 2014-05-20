var _utils = require('../../lib/index').utils;

describe('utils: ', function() {
    it('should expose methods required by the interface', function() {
       expect(typeof _utils.getArgArray).toBe('function'); 
    });

    describe('utils.getArgArray(): ', function() {
        it('should return an empty array if no args are passed', function() {
            var ret = _utils.getArgArray();

            expect(ret).toEqual([]);
        });

        it('should return an array of arguments (regular array)', function() {
            var args = [ 'a', 1, { foo: 'bar' } ];

            var ret = _utils.getArgArray(args);
            expect(ret).toEqual(args);
        });

        it('should return an array of arguments, (arguments array)', function() {
            var args = [ 'a', 1, { foo: 'bar' } ];

            var tester = function() {
                return _utils.getArgArray(arguments);
            };

            var ret = tester('a', 1, { foo: 'bar'});
            expect(ret).toEqual(args);
        });

        it('should return the first parameter, if it is an array (regular array)', function() {
            var first = [ '1', '2', 3 ];
            var args = [ first, 'a', 1, { foo: 'bar' } ];

            var ret = _utils.getArgArray(args);
            expect(ret).toEqual(first);
        });

        it('should return the first parameter, if it is an array (arguments array)', function() {
            var first = [ '1', '2', 3 ];
            var args = [ first, 'a', 1, { foo: 'bar' } ];

            var tester = function() {
                return _utils.getArgArray(arguments);
            };

            var ret = tester(first, 'a', 1, { foo: 'bar' });
            expect(ret).toEqual(first);
        });
    });

});
