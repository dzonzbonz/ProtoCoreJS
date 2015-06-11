/** @license
 * protocore-js <https://github.com/dzonzbonz/ProtoCoreJS>
 * Author: Nikola Ivanovic - Dzonz Bonz | MIT License
 * v0.0.1 (2015/06/11 09:27)
 */

(function () {
var factory = function (C) {
    C.Enviroment = {};
/**
 * 
 * @constructor
 * @returns {C.Enviroment.Object}
 */
C.Enviroment.Object = function () {
    
    this.guid = function () {};
    
    this.data = function () {};
    
    this.serialize = function () {};
    
    this.unserialize = function (serialized) {};
    
    this.toJSON = function () {};
};

C.factory(C.Enviroment, 'Object', function () {
    var __constructor = function () {
        var objectGUID = C.guid(4);
        var objectData = {};
        
        C.extend(this);
        
        this.guid = function () {
            return objectGUID;
        };
        C.mode(this, 'guid', C.MODE_LOCKED);
        
        this.data = function (key, value) {
            if (C.isDefined(value)) {
                if (!C.isDefined(key)) {
                // GETTER
                    return objectData;
                } 
                else if (C.isArray(key)
                        || C.isObject(key)) {
                // SETTER
                    objectData = key;
                } 
                else {
                // GETTER
                    if (!C.isDefined(objectData[key])) {
                        return null;
                    }
                    return objectData[key];
                }
            } 
            else {
            // SETTER
                if (null === key) {
                    objectData = {};
                } else {
                    objectData[key] = value;
                }
            }
            return this;
        };
        
        this.serialize = function () {
            return this.toJSON();
        };

        this.unserialize = function (serialized) {
            if (serialized['guid']) {
                objectGUID = serialized['guid'];
                objectData = C.unserialize(serialized['data']);
            }
            return this;
        };

        this.toString = function () {
            return {};
        };
        
        this.toJSON = function () {
            return {
                'guid': objectGUID,
                'data': C.serialize(objectData)
            };
        };
        
    };
    
    __constructor.prototype = new C.Enviroment.Object();
    
    return __constructor;
}, C.MODE_LOCKED);
    return C.Enviroment;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Enviroment'] = factory(C);
}

}());
