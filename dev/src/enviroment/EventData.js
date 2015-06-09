ProtoCore = ProtoCore || {};
ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @namespace ProtoCore.Enviroment;
 * 
 * @class Event;
 * 
 * @constructor
 * 
 * @uses ProtoCore.Enviroment.Object;
 * 
 * @param {type} _initialData
 * 
 * @returns {ProtoCore.Enviroment.EventData}
 */
ProtoCore.Enviroment.EventData = function (_initialData) {
    /* Variables */
    var _result = null,
        _break = false,
        _default = true;

    /* Inheritance */
    var parent = new ProtoCore.Enviroment.Object();
    ProtoCore.extend(this, parent);
    
    /* Implementation */
    /**
     * Stops event propagation
     * @returns {ProtoCore.Enviroment.EventData}
     */
    this.stopPropagation = function () {
        _break = true;
        return this;
    };
    ProtoCore.mode(this, 'stopPropagation', ProtoCore.MODE_LOCKED);

    /**
     * Continues event propagation
     * @returns {ProtoCore.Enviroment.EventData}
     */
    this.continuePropagation = function () {
        _break = false;
        return this;
    };
    ProtoCore.mode(this, 'continuePropagation', ProtoCore.MODE_LOCKED);

    /**
     * Prevents default action
     * @returns {ProtoCore.Enviroment.EventData}
     */
    this.preventDefault = function () {
        _default = false;
        return this;
    };
    ProtoCore.mode(this, 'preventDefault', ProtoCore.MODE_LOCKED);

    /**
     * Assumes the default action
     * @returns {ProtoCore.Enviroment.EventData}
     */
    this.assumeDefault = function () {
        _default = true;
        return this;
    };
    ProtoCore.mode(this, 'assumeDefault', ProtoCore.MODE_LOCKED);

    /**
     * Is event propagation stopped
     * @returns {Boolean}
     */
    this.stoped = function () {
        return _break;
    };
    ProtoCore.mode(this, 'stoped', ProtoCore.MODE_LOCKED);

    /**
     * Is event assuming the default action
     * @returns {Boolean}
     */
    this.assumed = function () {
        return _default;
    };
    ProtoCore.mode(this, 'assumed', ProtoCore.MODE_LOCKED);

    /* Constructor */
    this.data(_initialData);
};
ProtoCore.Enviroment.EventData.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.EventData.prototype.constructor = ProtoCore.Enviroment.EventData;
ProtoCore.register('ProtoCore.Enviroment.EventData', ProtoCore.Enviroment.EventData);
ProtoCore.mode(ProtoCore.Enviroment, 'EventData', ProtoCore.MODE_LOCKED);