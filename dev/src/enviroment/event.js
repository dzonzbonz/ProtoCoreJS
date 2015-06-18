/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Function} actionAfter
 * @param {Function} actionBefore
 * @param {Object} callContext
 * 
 * @returns {C.Enviroment.Event}
 */
C.Enviroment.Event = function (actionAfter, actionBefore, callContext) {
    
    this.subscribe = function (callable) {};

    this.notify = function (eventData) {};

    this.empty = function () {};

    this.reset = function () {};

    this.suspend = function () {};

    this.resume = function () {};
    
};

C.Enviroment.Event.prototype = new C.Enviroment.Object();
C.Enviroment.Event.prototype.constructor = C.Enviroment.Event;

C.factory(C.Enviroment, 'Event', function () {
    /**
     * @constructor
     * @extends C.Enviroment.Object
     * @returns {C.Enviroment.Event}
     */
    var __constructor = function (actionAfter, actionBefore, callContext) {
    /* Variables */
        var eventsData = {
            'before': C.isDefined(actionBefore) ? actionBefore : function () {},
            'after': C.isDefined(actionAfter) ? actionAfter : function () {},
            'subscribers': []
        },
        eventsSuspended = 0,
        defaultCallContext = callContext;

    /* Inheritance */
        var parent = new C.Enviroment.Object();
        C.extend(this, parent);
    
    /* Implementation */
        this.subscribe = function (callable) {
            eventsData['subscribers'].push({
                delegate: C.isArray(callable) ? callable[1] : callable,
                context: C.isArray(callable) ? callable[0] : defaultCallContext
            });

            return this;
        };

        /**
         * Notifies registered subscribers
         * 
         * @param {C.Enviroment.EventData} eventData
         * @returns {C.Enviroment.Event}
         */
        this.notify = function (eventData, _backupCallContext) {
            var _instance = defaultCallContext;

            if (_backupCallContext) {
                _instance = _backupCallContext;
            }

            if (eventsSuspended > 0)
                return this;
            else
                this.reset();

            if (C.isFunction(eventsData.before)) {
                eventsData.before.call(_instance, eventData);
            }

            if (!eventData.stopped()) {
                var _delegates = eventsData['subscribers'];
                for (var _index in _delegates) {
                    var _delegate = _delegates[_index].delegate;
                        _delegate.call(_delegates[_index].context || _instance, eventData, _backupCallContext);
                    if (eventData.stopped())
                        break;
                }
            }

            if (eventData.assumed()) {
                if (C.isFunction(eventsData.after)) {
                    eventsData.after.call(_instance, eventData, _instance);
                }
            }

            return this;
        };

        this.empty = function () {
            if (!eventsData)
                eventsData['subscribers'] = new Array();
            eventsSuspended = 0;
            return this;
        };

        this.reset = function () {
            eventsSuspended = 0;
            return this;
        };

        this.suspend = function () {
            eventsSuspended++;
            return this;
        };

        this.resume = function () {
            eventsSuspended--;
            return this;
        };
        
        C.mode(this, [
            'assumed', 'stopped', 'assumeDefault', 'preventDefault',
            'continuePropagation', 'stopPropagation'
        ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.Event();
    __constructor.prototype.constructor = C.Enviroment.Event;
    
    return __constructor;
});

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
//    this.stopped = function () {
//        return _break;
//    };
//    C.mode(this, 'stopped', C.MODE_LOCKED);
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

C = C || {};
C.Enviroment = C.Enviroment || {};

/**
 * @namespace C.Enviroment;
 * 
 * @class Event;
 * 
 * @constructor
 * 
 * @uses C.Enviroment.EventData;
 * 
 * @param {type} _callContext
 * @param {type} _defaultBefore
 * @param {type} _defaultAfter
 * 
 * @returns {C.Enviroment.Event}
 */
C.Enviroment.Event = function (_callContext, _defaultBefore, _defaultAfter) {
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
            context: _overridedCallContext ? _overridedCallContext : _defaultCallContext
        });

        return this;
    };

    /**
     * Notifies registered subscribers
     * 
     * @param {C.Enviroment.EventData} _eventData
     * @returns {C.Enviroment.Event}
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

        if (!_eventData.stopped()) {
            var _delegates = _events['subscribers'];
            for (var _index in _delegates) {
                var _delegate = _delegates[_index].delegate;
                _delegate.call(_delegates[_index].context || _instance, _eventData, _backupCallContext);
                if (_eventData.stopped())
                    break;
            }
        }

        if (!_eventData.stopped() && _eventData.assumed()) {
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
    
    C.mode(this, 'subscribe', C.MODE_LOCKED);
    C.mode(this, 'notify', C.MODE_LOCKED);
    C.mode(this, 'empty', C.MODE_LOCKED);
    C.mode(this, 'reset', C.MODE_LOCKED);
    C.mode(this, 'suspend', C.MODE_LOCKED);
    C.mode(this, 'resume', C.MODE_LOCKED);
};
C.mode(C.Enviroment, 'Event', C.MODE_LOCKED);