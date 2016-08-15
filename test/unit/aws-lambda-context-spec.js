/* jshint node:true, expr:true */
'use strict';

const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const AwsLambdaContext = require('../../lib/aws-lambda-context');

describe('AwsLambdaContext', () => {
    const DEFAULT_FUNCTION_NAME = '__function_name__';
    const DEFAULT_ARN_PREFIX = 'arn:aws:lambda:__aws_region__:__aws_account__:function'
    const DEFAULT_FUNCTION_VERSION = '$LATEST';

    function _getArn(functionName, alias) {
        functionName = functionName || DEFAULT_FUNCTION_NAME;
        let arn = `${DEFAULT_ARN_PREFIX}:${functionName}`;
        if(typeof alias === 'string' && alias.length > 0) {
            arn = `${arn}:${alias}`;
        }
        return arn;
    }

    describe('ctor()', () => {
      it('should expose the expected methods and properties', () => {
          const context = new AwsLambdaContext();

          expect(context).to.be.an('object');
          expect(context.env).to.be.a('string');
          expect(context.context).to.be.an('object');
      });

      it('should set default values for all properties', () => {
          const context = new AwsLambdaContext();

          expect(context.env).to.equal('na');
          expect(context.context).to.deep.equal({
              functionName: DEFAULT_FUNCTION_NAME,
              invokedFunctionArn: _getArn(),
              functionVersion: DEFAULT_FUNCTION_VERSION
          });
      });

      it('should add a lambda qualifier (but not the alias property) if an alias is specified', () => {
          const alias = 'dev';
          const context = new AwsLambdaContext({
              alias: alias
          });

          expect(context.context).to.deep.equal({
              functionName: '__function_name__',
              invokedFunctionArn: _getArn(DEFAULT_FUNCTION_NAME, alias),
              functionVersion: '$LATEST'
          });
      });

      it('should set the env property of the context to equal the alias value if a valid value is specified', () => {
          const alias = 'dev';
          const context = new AwsLambdaContext({
              alias: alias
          });

          expect(context.env).to.equal(alias);
      });
    });
});
