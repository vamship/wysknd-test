'use strict';

const _sinon = require('sinon');

/**
 * Helper class that helps construct AWS SDK mock objects.
 */
class AwsSdkMockBuilder {
    /**
     */
    constructor() {
        this._mock = {};
    }

    /**
     * Gets a reference to the mock object represented by this class.
     *
     * @return {Object} Reference to the mock object.
     */
    get mock() {
        return this._mock;
    }

    /**
     * Adds a mock for the dynamo db object to the mock represented by this
     * class.
     * 
     * @return {Object} A reference to this instance - can be used to chain
     *         calls.
     */
    addDynamoDB() {
        const documentClientMock = {
            update: _sinon.spy()
        };
        this._mock._dynamoDbRef = {
            _documentClient: {
                update: _sinon.spy()
            }
        };
        this.mock.DynamoDB = _sinon.stub().returns(this._mock._dynamoDbRef);
        this.mock.DynamoDB.DocumentClient = _sinon.stub().returns(this._mock._dynamoDbRef._documentClient);

        return this;
    }

    /**
     * Adds a mock for the s3 object to the mock represented by this class.
     * 
     * @return {Object} A reference to this instance - can be used to chain
     *         calls.
     */
    addS3() {
        this._mock._s3Ref = {
            listObjectsV2: _sinon.spy(),
            getSignedUrl: _sinon.spy()
        };
        this.mock.S3 = _sinon.stub().returns(this._mock._s3Ref);

        return this;
    }
}

module.exports = AwsSdkMockBuilder;
