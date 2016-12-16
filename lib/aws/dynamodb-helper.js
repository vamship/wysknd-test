'use strict';

const _awsSdk = require('aws-sdk');
const _clone = require('clone');

/**
 * Utility class that can be used to query dynamo db for records, and
 * additionally track temporary records created in dynamo
 * db during testing. Provides the ability to register newly created records,
 * add records for testing, lookup records and ultimately clean up all of the
 * temporary records when testing is complete.
 */
class AwsDynamoDbHelper {
    /**
     * @param {String} tableName The name of the table that this client will be
     *        accessing.
     * @param {Object} options Connection options for the AWS client.
     */
    constructor(tableName, options) {
        if (typeof tableName !== 'string' || tableName.length <= 0) {
            throw new Error('Invalid table name specified (arg #1)');
        }
        if (!options || (options instanceof Array) || typeof options !== 'object') {
            throw new Error('Invalid options specified (arg #3)');
        }

        this._tableName = tableName;
        this._docClient = new _awsSdk.DynamoDB.DocumentClient(options);
        this._keys = [];
    }

    /**
     * Record a primary key for cleanup at a later point.
     *
     * @param {Object} keys A map containing the record keys.
     */
    track(keys) {
        if (!keys || (keys instanceof Array) || typeof keys !== 'object') {
            throw new Error('Invalid keys specified (arg #2)');
        }
        this._keys.push(keys);
    }

    /**
     * Loads a single record of data from dynamodb.
     * @return {Promise} A promise that is rejected/resolved based on the
     *         outcome of the fetch operation.
     */
    getRecord(keys) {
        if (!keys || (keys instanceof Array) || typeof keys !== 'object') {
            throw new Error('Invalid keys specified (arg #1)');
        }
        return new Promise((resolve, reject) => {
            this._docClient.get({
                TableName: this._tableName,
                Key: keys
            }, (err, data) => {
                if (err) {
                    reject(`Error fetching dynamo db record: [${err}]`);
                    return;
                }
                resolve(data);
            });
        });
    }

    /**
     * Creates a single record of data in dynamodb. This record is
     * automatically tracked for deletion during cleanup.
     *
     * @param {Object} keys A map containing the record keys.
     * @param {Object} properties An object containing properties for the
     *        record to write.
     * @return {Promise} A promise that is rejected/resolved based on the
     *         outcome of the put operation.
     */
    createRecord(keys, properties) {
        if (!keys || (keys instanceof Array) || typeof keys !== 'object') {
            throw new Error('Invalid keys specified (arg #1)');
        }
        if (!properties || (properties instanceof Array) || typeof properties !== 'object') {
            throw new Error('Invalid properties specified (arg #2)');
        }
        this.track(keys);
        return new Promise((resolve, reject) => {
            const item = Object.assign(properties, keys);
            this._docClient.put({
                TableName: this._tableName,
                Item: item
            }, (err, data) => {
                if (err) {
                    reject(`Error creating dynamo db record: [${err}]`);
                    return;
                }
                resolve(item);
            });
        });
    }

    /**
     * Deletes all records that are currently being tracked from the dynamo
     * db table.
     *
     * @return {Promise} A promise that is rejected/resolved based on the
     *         outcome of the fetch operation.
     */
    cleanup() {
        const promises = this._keys.map((keys) => {
            return new Promise((resolve, reject) => {
                this._docClient.delete({
                    TableName: this._tableName,
                    Key: keys
                }, (err, data) => {
                    if (err) {
                        reject(`Error deleting dynamo db record: [${err}]`);
                        return;
                    }
                    resolve(data);
                });
            });
        });
        return Promise.all(promises);
    }
}

module.exports = AwsDynamoDbHelper;
