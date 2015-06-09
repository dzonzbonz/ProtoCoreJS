/**
 * Base class
 * @constructor
 * @extends {Function}
 */
ProtoCore.Enviroment.Object = function () {
    var _guid = ProtoCore.guid(4),
        _data = {};
    
    var _instantiated = false;
    
    ProtoCore.extend(this);

    this.guid = function () {
        return _guid;
    };
    ProtoCore.mode(this, 'guid', ProtoCore.MODE_LOCKED);

    /**
     * 
     * @param {type} key
     * @param {type} value
     * @returns {ProtoCore.enviroment.object._data|ProtoCore.enviroment.object.data.key|ProtoCoreInterface.enviroment.object._data|value|ProtoCoreInterface.unserialize.obj|type|ProtoCoreInterface.instantiate.obj|key|ProtoCore.enviroment.object}
     */
    this.data = function (key, value) {
        if (typeof (value) == 'undefined') {
            // GETTER
            if (typeof (key) == 'undefined') {
                return _data;
            } 
            else if (ProtoCore.isArray(key)
                    || ProtoCore.isObject(key)) {
                _data = key;
            } 
            else {
                if (typeof (_data[key]) == 'undefined') {
                    return null;
                }
                return _data[key];
            }
        } 
        else {
            // SETTER
            if (null == key) {
                _data = {};
            } else {
                _data[key] = value;
            }
        }
        return this;
    };

    this.serialize = function () {
        return {
            '__guid__': _guid,
            '__data__': ProtoCore.serialize(_data)
        };
    };
    
    this.unserialize = function (serialized) {
        if (serialized['__guid__']) {
            _guid = serialized['__guid__'];
            _data = ProtoCore.unserialize(_data);
        }
        return this;
    };

    this.toString = function () {
        return {};
    };
    this.toJSON = function () {
        return {};
    };
    this.toJSAN = function () {
        return [];
    };
};

ProtoCore.Enviroment.Object.prototype.constructor = ProtoCore.Enviroment.Object;
ProtoCore.mode(ProtoCore.Enviroment, 'Object', ProtoCore.MODE_LOCKED);