'use strict';

const _sinon = require('sinon');
const _clone = require('clone');

/**
 * Helper class that helps construct mock config objects.
 */
class ConfigMockBuilder {
    /**
     * @param {Object} [props={}] An optional config object that contains
     *        the config parameters represented by the mock
     */
    constructor(props) {
        if (!props || typeof props !== 'object') {
            props = {};
        }
        this._mock = {
            get: function() {},
            _props: _clone(props)
        };
        _sinon.stub(this._mock, 'get', (propPath) => {
            const reducer = (obj, propName) => {
                return (obj && typeof obj === 'object')? obj[propName]:undefined;
            };
            return propPath.split('.').reduce(reducer, this._mock._props);
        });
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

module.exports = ConfigMockBuilder;
