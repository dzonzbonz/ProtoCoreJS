C.Enviroment.EventData = function (initialData) {
    
    this.stopPropagation = function () {};
    
    this.continuePropagation = function () {};
    
    this.preventDefault = function () {};
    
    this.assumeDefault = function () {};
    
    this.stopped = function () {};
    
    this.assumed = function () {};
};

C.Enviroment.EventData.prototype = new C.Enviroment.Object();
C.Enviroment.EventData.prototype.constructor = C.Enviroment.EventData;

C.factory(C.Enviroment, 'EventData', function () {
    /**
     * @extends C.Enviroment.Object
     * @returns {C.Enviroment.EventData}
     */
    var __constructor = function (initialData) {
    /* Variables */
        var eventResult = null,
            breakEvent = false,
            defaultAction = true;

    /* Inheritance */
        var parent = new C.Enviroment.Object();
        C.extend(this, parent);
    
    /* Implementation */
        /**
         * Stops event propagation
         * @returns {C.Enviroment.EventData}
         */
        this.stopPropagation = function () {
            breakEvent = true;
            return this;
        };

        /**
         * Continues event propagation
         * @returns {C.Enviroment.EventData}
         */
        this.continuePropagation = function () {
            breakEvent = false;
            return this;
        };

        /**
         * Prevents default action
         * @returns {C.Enviroment.EventData}
         */
        this.preventDefault = function () {
            defaultAction = false;
            return this;
        };

        /**
         * Assumes the default action
         * @returns {C.Enviroment.EventData}
         */
        this.assumeDefault = function () {
            defaultAction = true;
            return this;
        };

        /**
         * Is event propagation stopped
         * @returns {Boolean}
         */
        this.stoped = function () {
            return breakEvent;
        };

        /**
         * Is event assuming the default action
         * @returns {Boolean}
         */
        this.assumed = function () {
            return defaultAction;
        };

        /* Constructor */
        this.data(initialData);
        
        C.mode(this, [
            'assumed', 'stoped', 'assumeDefault', 'preventDefault',
            'continuePropagation', 'stopPropagation'
        ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.Object();
    __constructor.prototype.constructor = new C.Enviroment.EventData();
    
    return __constructor;
}, C.MODE_LOCKED);

///**
// * @namespace C.Enviroment;
// * 
// * @class Event;
// * 
// * @constructor
// * 
// * @uses C.Enviroment.Object;
// * 
// * @param {type} _initialData
// * 
// * @returns {C.Enviroment.EventData}
// */
//C.Enviroment.EventData = function (_initialData) {
//    /* Variables */
//    var _result = null,
//        _break = false,
//        _default = true;
//
//    /* Inheritance */
//    var parent = new C.Enviroment.Object();
//    C.extend(this, parent);
//    
//    /* Implementation */
//    /**
//     * Stops event propagation
//     * @returns {C.Enviroment.EventData}
//     */
//    this.stopPropagation = function () {
//        _break = true;
//        return this;
//    };
//    C.mode(this, 'stopPropagation', C.MODE_LOCKED);
//
//    /**
//     * Continues event propagation
//     * @returns {C.Enviroment.EventData}
//     */
//    this.continuePropagation = function () {
//        _break = false;
//        return this;
//    };
//    C.mode(this, 'continuePropagation', C.MODE_LOCKED);
//
//    /**
//     * Prevents default action
//     * @returns {C.Enviroment.EventData}
//     */
//    this.preventDefault = function () {
//        _default = false;
//        return this;
//    };
//    C.mode(this, 'preventDefault', C.MODE_LOCKED);
//
//    /**
//     * Assumes the default action
//     * @returns {C.Enviroment.EventData}
//     */
//    this.assumeDefault = function () {
//        _default = true;
//        return this;
//    };
//    C.mode(this, 'assumeDefault', C.MODE_LOCKED);
//
//    /**
//     * Is event propagation stopped
//     * @returns {Boolean}
//     */
//    this.stoped = function () {
//        return _break;
//    };
//    C.mode(this, 'stoped', C.MODE_LOCKED);
//
//    /**
//     * Is event assuming the default action
//     * @returns {Boolean}
//     */
//    this.assumed = function () {
//        return _default;
//    };
//    C.mode(this, 'assumed', C.MODE_LOCKED);
//
//    /* Constructor */
//    this.data(_initialData);
//};
//C.Enviroment.EventData.prototype = new C.Enviroment.Object();
//C.Enviroment.EventData.prototype.constructor = C.Enviroment.EventData;
//C.register('C.Enviroment.EventData', C.Enviroment.EventData);
//C.mode(C.Enviroment, 'EventData', C.MODE_LOCKED);