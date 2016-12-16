/* jshint node:true, expr:true */
'use strict';

const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const LambdaWrapper = require('../../../lib/aws/lambda-wrapper');

describe('LambdaWrapper', () => {
    let _event = null;
    let _context = null;
    let _callback = null;
    let _ext = null;

    const _handler = (event, context, callback, ext) => {
        _event = event;
        _context = context;
        _callback = callback;
        _ext = ext;
    };

    beforeEach(() => {
        _event = null;
        _context = null;
        _callback = null;
        _ext = null;
    });

    describe('ctor()', () => {
        it('should throw an error if invoked without a valid handler', () => {
            const error = 'Invalid handler specified (arg #1)';
            [ null, undefined, 'abc', 123, true, {}, [] ].forEach((handler) => {
                const wrapper = () => {
                    return new LambdaWrapper(handler);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should initialize event properties to an empty object if no valid value is specified', () => {
            [ null, undefined, 'abc', 123, true, function(){} ].forEach((event) => {
                const wrapper = new LambdaWrapper(_handler, event);
                expect(wrapper.event).to.be.an('object').and.to.be.empty;
            });
        });

        it('should initialize event properties to an empty object if no valid value is specified', () => {
            [ null, undefined, 'abc', 123, true, function(){}, [] ].forEach((contextProps) => {
                const wrapper = new LambdaWrapper(_handler, undefined, contextProps);
                expect(wrapper.contextProps).to.be.an('object').and.to.be.empty;
            });
        });

        it('should initialize config properties to an empty object if no valid value is specified', () => {
            [ null, undefined, 'abc', 123, true, function(){}, [] ].forEach((configProps) => {
                const wrapper = new LambdaWrapper(_handler, undefined, configProps);
                expect(wrapper.configProps).to.be.an('object').and.to.be.empty;
            });
        });
    });

    describe('addEventProperties()', () => {
        it('should throw an error if invoked without a valid object', () => {
            const error = 'Invalid event properties specified (arg #1)';
            [ null, undefined, 'abc', 123, true, function(){}, [] ].forEach((props) => {
                const wrapper = () => {
                    const wrapper = new LambdaWrapper(_handler);
                    wrapper.addEventProperties(props);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should add the specified properties to the event object', () => {
            const oldProps = {
                foo: 'baz',
                isTrue: false
            };
            const props = {
                foo: 'bar',
                abc: 123
            };
            const wrapper = new LambdaWrapper(_handler, oldProps);
            expect(wrapper.event).to.deep.equal(oldProps);
            wrapper.addEventProperties(props);
            expect(wrapper.event).to.deep.equal(Object.assign(oldProps, props));
        });
    });

    describe('addContextProperties()', () => {
        it('should throw an error if invoked without a valid object', () => {
            const error = 'Invalid context properties specified (arg #1)';
            [ null, undefined, 'abc', 123, true, function(){}, [] ].forEach((props) => {
                const wrapper = () => {
                    const wrapper = new LambdaWrapper(_handler);
                    wrapper.addContextProperties(props);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should add the specified properties to the context object', () => {
            const oldProps = {
                foo: 'baz',
                isTrue: false
            };
            const props = {
                foo: 'bar',
                abc: 123
            };
            const wrapper = new LambdaWrapper(_handler, undefined, oldProps);
            expect(wrapper.contextProps).to.deep.equal(oldProps);
            wrapper.addContextProperties(props);
            expect(wrapper.contextProps).to.deep.equal(Object.assign(oldProps, props));
        });
    });

    describe('addConfigProperties()', () => {
        it('should throw an error if invoked without a valid object', () => {
            const error = 'Invalid config properties specified (arg #1)';
            [ null, undefined, 'abc', 123, true, function(){}, [] ].forEach((props) => {
                const wrapper = () => {
                    const wrapper = new LambdaWrapper(_handler);
                    wrapper.addConfigProperties(props);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should add the specified properties to the config object', () => {
            const oldProps = {
                foo: 'baz',
                isTrue: false
            };
            const props = {
                foo: 'bar',
                abc: 123
            };
            const wrapper = new LambdaWrapper(_handler, undefined, undefined, oldProps);
            expect(wrapper.configProps).to.deep.equal(oldProps);
            wrapper.addConfigProperties(props);
            expect(wrapper.configProps).to.deep.equal(Object.assign(oldProps, props));
        });
    });

    describe('setEnvironment()', () => {
        it('should throw an error if invoked without a valid string', () => {
            const error = 'Invalid environment string specified (arg #1)';
            [ null, undefined, '', 123, true, {}, function(){}, [] ].forEach((props) => {
                const wrapper = () => {
                    const wrapper = new LambdaWrapper(_handler);
                    wrapper.setEnvironment(props);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should update the alias on the context property with the specified value', () => {
            const wrapper = new LambdaWrapper(_handler);
            const env = 'abcd';

            expect(wrapper.contextProps.alias).to.be.undefined;
            wrapper.setEnvironment(env);
            expect(wrapper.contextProps.alias).to.equal(env);
        });
    });

    describe('setFunctionName()', () => {
        it('should throw an error if invoked without a valid string', () => {
            const error = 'Invalid function name specified (arg #1)';
            [ null, undefined, '', 123, true, {}, function(){}, [] ].forEach((props) => {
                const wrapper = () => {
                    const wrapper = new LambdaWrapper(_handler);
                    wrapper.setFunctionName(props);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should update the alias on the context property with the specified value', () => {
            const wrapper = new LambdaWrapper(_handler);
            const functionName = 'xyz';

            expect(wrapper.contextProps.functionName).to.be.undefined;
            wrapper.setFunctionName(functionName);
            expect(wrapper.contextProps.functionName).to.equal(functionName);
        });
    });

    describe('[invoke behavior]', () => {
        it('should invoke the handler with a callback function', () => {
            const wrapper = new LambdaWrapper(_handler);
            wrapper.invoke();
            expect(_callback).to.be.a('function');
        });

        it('should invoke the handler with the correct event parameter', () => {
            const firstProps = {
                foo: 'bar'
            };
            const secondProps ={
                abc: 123
            };
            const thirdProps ={
                isTrue: false
            };

            const wrapper = new LambdaWrapper(_handler, firstProps);
            wrapper.addEventProperties(secondProps)
                .addEventProperties(thirdProps);
            wrapper.invoke();

            expect(_event).to.deep.equal(Object.assign(firstProps, secondProps, thirdProps));
        });

        it('should invoke the handler with the correct context parameter', () => {
            const firstProps = {
                foo: 'bar'
            };
            const secondProps ={
                abc: 123
            };
            const env = 'foobar';
            const functionName = 'myLambdaFunction';

            const wrapper = new LambdaWrapper(_handler, undefined, firstProps);
            wrapper.addContextProperties(secondProps)
                .setEnvironment(env)
                .setFunctionName(functionName);

            wrapper.invoke();
            expect(_context).to.be.an('object');
            expect(_context.alias).to.be.undefined;
            expect(_context.functionName).to.equal(functionName);
            expect(_context.invokedFunctionArn).to.equal(`arn:aws:lambda:__aws_region__:__aws_account__:function:${functionName}:${env}`);

            const combinedProps = Object.assign(firstProps, secondProps);
            for(var propName in combinedProps) {
                expect(_context[propName]).to.equal(combinedProps[propName]);
            }
        });

        it('should invoke the handler with the correct extension parameter', () => {
            const wrapper = new LambdaWrapper(_handler);

            wrapper.invoke();
            expect(_ext).to.be.an('object');
            expect(_ext).to.have.property('logger').and.to.be.an('object');
            expect(_ext).to.have.property('config').and.to.be.an('object');
            expect(_ext).to.have.property('env').and.to.be.a('string');
        });

        it('should pass the environment string as a part of the extension parameter', () => {
            const env = 'production';
            const wrapper = new LambdaWrapper(_handler);
            wrapper.setEnvironment(env);

            wrapper.invoke();
            expect(_ext.env).to.equal(env);
        });

        it('should pass a logger as a part of the extension parameter', () => {
            const wrapper = new LambdaWrapper(_handler);

            wrapper.invoke();
            expect(_ext.logger.child).to.be.a('function');
            [ 'info', 'trace', 'debug', 'warn', 'error', 'fatal' ].forEach((funcName) => {
                expect(_ext.logger[funcName]).to.be.a('function');
            });
        });

        it('should pass a config as a part of the extension parameter', () => {
            const wrapper = new LambdaWrapper(_handler);

            wrapper.invoke();
            expect(_ext.config.get).to.be.a('function');
        });

        it('should return predefined config properties when config.get() is invoked', () => {
            const firstProps = {
                appName: 'tester'
            };
            const secondProps = {
                aws: {
                    region: 'us-east-1',
                    profile: 'foobar'
                }
            };
            const thirdProps = {
                logger: {
                    level: 'debug'
                }
            };
            const wrapper = new LambdaWrapper(_handler, undefined, undefined, firstProps);
            wrapper.addConfigProperties(secondProps)
                .addConfigProperties(thirdProps);

            wrapper.invoke();
            expect(_ext.config.get('appName')).to.equal(firstProps.appName);
            expect(_ext.config.get('aws.region')).to.equal(secondProps.aws.region);
            expect(_ext.config.get('aws.profile')).to.equal(secondProps.aws.profile);
            expect(_ext.config.get('logger.level')).to.equal(thirdProps.logger.level);
        });

        it('should return a promise when invoked', () => {
            const wrapper = new LambdaWrapper(_handler);
            const ret = wrapper.invoke();

            expect(ret).to.be.an('object');
            expect(ret.then).to.be.a('function');
        });

        it('should resolve the promise if the callback is invoked with no errors', (done) => {
            const wrapper = new LambdaWrapper(_handler);
            const ret = wrapper.invoke();
            const expectedArg = 'success!';

            const doTest = (arg) => {
                expect(arg).to.equal(expectedArg);
            };
            setTimeout(() => {
                _callback(null, expectedArg);
            }, 100);

            expect(ret).to.be.fulfilled
                .then(doTest)
                .then(() => done(), (err) => done(err));
        });

        it('should resolve the promise if the callback is invoked with no errors', (done) => {
            const wrapper = new LambdaWrapper(_handler);
            const ret = wrapper.invoke();
            const expectedArg = 'something went wrong!';

            const doTest = (arg) => {
                expect(arg).to.equal(expectedArg);
            };
            setTimeout(() => {
                _callback(expectedArg);
            }, 100);

            expect(ret).to.be.rejected
                .then(doTest)
                .then(() => done(), (err) => done(err));
        });
    });
});

