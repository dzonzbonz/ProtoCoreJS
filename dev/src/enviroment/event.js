ProtoCore.Enviroment.Event = function (initialData) {
    
    this.stopPropagation = function () {};
    
    this.continuePropagation = function () {};
    
    this.preventDefault = function () {};
    
    this.assumeDefault = function () {};
    
    this.stopped = function () {};
    
    this.assumed = function () {};
};

ProtoCore.Enviroment.EventData.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.EventData.prototype.constructor = ProtoCore.Enviroment.EventData;

ProtoCore.factory(ProtoCore.Enviroment, 'EventData', function () {
    /**
     * @extends ProtoCore.Enviroment.Object
     * @returns {undefined}
     */
    var __constructor = function (initialData) {
    /* Variables */
        var eventResult = null,
            breakEvent = false,
            defaultAction = true;

    /* Inheritance */
        var parent = new ProtoCore.Enviroment.Object();
        ProtoCore.extend(this, parent);
    
    /* Implementation */
        /**
         * Stops event propagation
         * @returns {ProtoCore.Enviroment.EventData}
         */
        this.stopPropagation = function () {
            breakEvent = true;
            return this;
        };

        /**
         * Continues event propagation
         * @returns {ProtoCore.Enviroment.EventData}
         */
        this.continuePropagation = function () {
            breakEvent = false;
            return this;
        };

        /**
         * Prevents default action
         * @returns {ProtoCore.Enviroment.EventData}
         */
        this.preventDefault = function () {
            defaultAction = false;
            return this;
        };

        /**
         * Assumes the default action
         * @returns {ProtoCore.Enviroment.EventData}
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
        
        ProtoCore.mode(this, [
            'assumed', 'stoped', 'assumeDefault', 'preventDefault',
            'continuePropagation', 'stopPropagation'
        ], ProtoCore.MODE_LOCKED);
    };
    
    __constructor.prototype = new ProtoCore.Enviroment.EventData();
    
    return __constructor;
});

///**
// * @namespace ProtoCore.Enviroment;
// * 
// * @class Event;
// * 
// * @constructor
// * 
// * @uses ProtoCore.Enviroment.Object;
// * 
// * @param {type} _initialData
// * 
// * @returns {ProtoCore.Enviroment.EventData}
// */
//ProtoCore.Enviroment.EventData = function (_initialData) {
//    /* Variables */
//    var _result = null,
//        _break = false,
//        _default = true;
//
//    /* Inheritance */
//    var parent = new ProtoCore.Enviroment.Object();
//    ProtoCore.extend(this, parent);
//    
//    /* Implementation */
//    /**
//     * Stops event propagation
//     * @returns {ProtoCore.Enviroment.EventData}
//     */
//    this.stopPropagation = function () {
//        _break = true;
//        return this;
//    };
//    ProtoCore.mode(this, 'stopPropagation', ProtoCore.MODE_LOCKED);
//
//    /**
//     * Continues event propagation
//     * @returns {ProtoCore.Enviroment.EventData}
//     */
//    this.continuePropagation = function () {
//        _break = false;
//        return this;
//    };
//    ProtoCore.mode(this, 'continuePropagation', ProtoCore.MODE_LOCKED);
//
//    /**
//     * Prevents default action
//     * @returns {ProtoCore.Enviroment.EventData}
//     */
//    this.preventDefault = function () {
//        _default = false;
//        return this;
//    };
//    ProtoCore.mode(this, 'preventDefault', ProtoCore.MODE_LOCKED);
//
//    /**
//     * Assumes the default action
//     * @returns {ProtoCore.Enviroment.EventData}
//     */
//    this.assumeDefault = function () {
//        _default = true;
//        return this;
//    };
//    ProtoCore.mode(this, 'assumeDefault', ProtoCore.MODE_LOCKED);
//
//    /**
//     * Is event propagation stopped
//     * @returns {Boolean}
//     */
//    this.stoped = function () {
//        return _break;
//    };
//    ProtoCore.mode(this, 'stoped', ProtoCore.MODE_LOCKED);
//
//    /**
//     * Is event assuming the default action
//     * @returns {Boolean}
//     */
//    this.assumed = function () {
//        return _default;
//    };
//    ProtoCore.mode(this, 'assumed', ProtoCore.MODE_LOCKED);
//
//    /* Constructor */
//    this.data(_initialData);
//};
//ProtoCore.Enviroment.EventData.prototype = new ProtoCore.Enviroment.Object();
//ProtoCore.Enviroment.EventData.prototype.constructor = ProtoCore.Enviroment.EventData;
//ProtoCore.register('ProtoCore.Enviroment.EventData', ProtoCore.Enviroment.EventData);
//ProtoCore.mode(ProtoCore.Enviroment, 'EventData', ProtoCore.MODE_LOCKED);

ProtoCore = ProtoCore || {};
ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @namespace ProtoCore.Enviroment;
 * 
 * @class Event;
 * 
 * @constructor
 * 
 * @uses ProtoCore.Enviroment.EventData;
 * 
 * @param {type} _callContext
 * @param {type} _defaultBefore
 * @param {type} _defaultAfter
 * 
 * @returns {ProtoCore.Enviroment.Event}
 */
ProtoCore.Enviroment.Event = function (_callContext, _defaultBefore, _defaultAfter) {
    /* Variables */
    var _events = {
            'before': _defaultBefore || function () {},
            'after': _defaultAfter || function () {},
            'subscribers': new Array()
        },
        _suspended = 0,
        _defaultCallContext = _callContext;

    /**
     * 
     */
    this.subscribe = function (_function, _overridedCallContext) {
        _events['subscribers'].push({
            delegate: _function,
            owner: _overridedCallContext ? _overridedCallContext : _defaultCallContext
        });

        return this;
    };

    /**
     * Notifies registered subscribers
     * 
     * @param {ProtoCore.Enviroment.EventData} _eventData
     * @returns {ProtoCore.Enviroment.Event}
     */
    this.notify = function (_eventData, _backupCallContext) {
        var _instance = _defaultCallContext;

        if (_backupCallContext) {
            _instance = _backupCallContext;
        }

        if (_suspended > 0)
            return this;
        else
            this.reset();

        if (_events.before) {
            _events.before.call(_instance, _eventData, _instance);
        }

        if (!_eventData.stoped()) {
            var _delegates = _events['subscribers'];
            for (var _index in _delegates) {
                var _delegate = _delegates[_index].delegate;
                _delegate.call(_delegates[_index].owner || _instance, _eventData, _backupCallContext);
                if (_eventData.stoped())
                    break;
            }
        }

        if (!_eventData.stoped() && _eventData.assumed()) {
            if (_events.after) {
                _events.after.call(_instance, _eventData, _instance);
            }
        }

        return this;
    };

    this.empty = function () {
        if (!_events)
            _events['subscribers'] = new Array();
        _suspended = 0;
        return this;
    };

    this.reset = function () {
        _suspended = 0;
        return this;
    };

    this.suspend = function () {
        _suspended++;
        return this;
    };

    this.resume = function () {
        _suspended--;
        return this;
    };
    
    ProtoCore.mode(this, 'subscribe', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'notify', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'empty', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'reset', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'suspend', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'resume', ProtoCore.MODE_LOCKED);
};
ProtoCore.mode(ProtoCore.Enviroment, 'Event', ProtoCore.MODE_LOCKED);