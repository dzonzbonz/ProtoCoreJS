/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Object} initialData
 * @returns {C.Enviroment.EventData}
 */
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
     * 
     * @extends C.Enviroment.EventData
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
    
    __constructor.prototype = new C.Enviroment.EventData();
    __constructor.prototype.constructor = C.Enviroment.EventData;
    
    return __constructor;
}, C.MODE_LOCKED);