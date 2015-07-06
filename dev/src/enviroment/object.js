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
    
    function C__Enviroment__Object() {
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
                // SETTER
                    objectData[key] = value;
                }
            } 
            else {
                if (!C.isDefined(key)) {
                // GETTER
                    return objectData;
                } else {
                // SETTER
                    if (C.isArray(key)
                        || C.isObject(key)) {
                    // SETTER
                        objectData = key;
                    }
                    else if (!C.isDefined(objectData[key])) {
                        return null;
                    }
                    return objectData[key];
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
        
//        this.toJSAN = function () {
//            return [
//                ["guid", objectGUID],
//                ["data", C.serialize(objectData)]
//            ];
//        };
        
    };
    
    C__Enviroment__Object.prototype = new C.Enviroment.Object();
    C__Enviroment__Object.prototype.constructor = C.Enviroment.Object;
    
//    C.constructable(C__Enviroment__Object);
    
    return C__Enviroment__Object;
}, C.MODE_LOCKED);