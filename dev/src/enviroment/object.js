ProtoCore.Enviroment.Object = function () {
    
    this.guid = function () {};
    
    this.data = function () {};
    
    this.serialize = function () {};
    
    this.unserialize = function (serialized) {};
    
    this.toJSON = function () {};
};

ProtoCore.factory(ProtoCore.Enviroment, 'Object', function () {
    var __constructor = function () {
        var objectGUID = ProtoCore.guid(4);
        var objectData = {};
        
        ProtoCore.extend(this);
        
        this.guid = function () {
            return objectGUID;
        };
        ProtoCore.mode(this, 'guid', ProtoCore.MODE_LOCKED);
        
        this.data = function (key, value) {
            if (ProtoCore.isDefined(value)) {
                if (!ProtoCore.isDefined(key)) {
                // GETTER
                    return objectData;
                } 
                else if (ProtoCore.isArray(key)
                        || ProtoCore.isObject(key)) {
                // SETTER
                    objectData = key;
                } 
                else {
                // GETTER
                    if (!ProtoCore.isDefined(objectData[key])) {
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
                objectData = ProtoCore.unserialize(serialized['data']);
            }
            return this;
        };

        this.toString = function () {
            return {};
        };
        
        this.toJSON = function () {
            return {
                'guid': objectGUID,
                'data': ProtoCore.serialize(objectData)
            };
        };
        
    };
    
    __constructor.prototype = new ProtoCore.Enviroment.Object();
    
    return __constructor;
}, ProtoCore.MODE_LOCKED);