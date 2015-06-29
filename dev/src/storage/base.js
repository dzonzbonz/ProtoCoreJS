protocor.require('protocor.enviroment.object');

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 * @param {Object} _params
 * 
 * available params are
 * uri - destination
 */
protocor.storage.base = function (_params) {
    /* Arguments */
    _params = protocor.argument(_params, {
    });

    /* Variables */

    /* Inheritance */
    var parent = new protocor.enviroment.object();
    protocor.extend(this, parent);

    /* Implementation */
    this.beforeLoad = new protocor.enviroment.event.object(this);
    this.afterLoad = new protocor.enviroment.event.object(this);

    this.beforeSave = new protocor.enviroment.event.object(this);
    this.afterSave = new protocor.enviroment.event.object(this);

    this.load = function () {
        var _data = new protocor.enviroment.event.data();
        _data.data(protocor.clone(_params));

        this.beforeLoad.notify(_data);

        if (!_data.stoped()) {
            var _newParams = _data.data();
            $.getJSON(_newParams['']);
        }

        return this;
    };

    this.save = function () {

    };

    /* Constructor */
};
protocor.storage.base.prototype = new protocor.enviroment.object();
protocor.storage.base.prototype.constructor = protocor.enviroment.event.object;
protocor.register('protocor.storage.base', protocor.storage.base);
protocor.mode(protocor.storage, 'base', protocor.MODE_LOCKED);
