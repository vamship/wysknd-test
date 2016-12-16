'use strict';

const _sinon = require('sinon');

/**
 * Helper class that helps construct mock logger objects.
 */
class LoggerMockBuilder {
    /**
     */
    constructor() {
        this._mock = { };
        [ 'info', 'trace', 'debug', 'warn', 'error', 'fatal' ].forEach((funcName) => {
            this._mock[funcName] = _sinon.spy();
        });
        this._mock.child = _sinon.stub().returns(this._mock);
    }

    /**
     * Gets a reference to the mock object represented by this class.
     *
     * @return {Object} Reference to the mock object.
     */
    get mock() {
        return this._mock;
    }
}

module.exports = LoggerMockBuilder;
