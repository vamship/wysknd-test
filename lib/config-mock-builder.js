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
            _addProperties: (props) => {
                return this.addProperties(props).mock;
            },
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
     * Adds additional config properties to the existing config store.
     * These properties can then be retrieved as if they were a part
     * of the config object ex: config.get('prop.path.name'). Any existing
     * properties with the same name/path will be overwritten.
     *
     * @param {Object} props The properties to add to the config
     *
     * @return {Object} A reference to the builder - can be used for
     *         chaining.
     */
    addProperties(props) {
        if(!props || (props instanceof Array) || typeof props !== 'object') {
            throw new Error('Invalid properties specified (arg #1)');
        }
        this.mock._props = Object.assign(this.mock._props, props);

        return this;
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
