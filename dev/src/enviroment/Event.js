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