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
}, C.MODE_LOCKED);
