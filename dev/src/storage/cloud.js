protocor.require('protocor.enviroment.object');

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 * @param {Object} _params
 * 
 * available params are
 * uri - destination
 */
protocor.storage.cloud = function (_uri, _params) {
    /* Arguments */
    _uri = protocor.argument(_uri, false);
    _params = protocor.argument(_params, {});

    /* Variables */

    /* Inheritance */
    var parent = new protocor.enviroment.object();
    protocor.extend(this, parent);

    /* Events */
    this.onLoad = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onLoad', protocor.MODE_LOCKED);
    this.onLoaded = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onLoaded', protocor.MODE_LOCKED);
    this.onLoadError = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onLoadError', protocor.MODE_LOCKED);

    this.onSave = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onSave', protocor.MODE_LOCKED);
    this.onSaved = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onSaved', protocor.MODE_LOCKED);
    this.onSaveError = new protocor.enviroment.event.object(this);
    protocor.mode(this, 'onSaveError', protocor.MODE_LOCKED);

    /* Implementation */
    this.load = function () {
        var instance = this;

        var _loadData = new protocor.enviroment.event.data();
        _loadData.data(protocor.clone(_params));

        this.onLoad.notify(_loadData);

        if (!_loadData.stoped()) {
            var _newParams = _loadData.data();
            var $_request = $.getJSON(_uri, _newParams)
                    .done(function (data) {
                        var _loadedData = new protocor.enviroment.event.data();
                        _loadedData.data(data);

                        instance.onLoaded.notify(_loadedData, instance);

                        instance.data(_loadedData.data());
                    })
                    .fail(function (data) {
                        var _errorData = new protocor.enviroment.event.data();
                        _errorData.data(data);
                        instance.onLoadError.notify(_errorData);
                    });
        }

        return this;
    };

    this.save = function () {
        return this;
    };

    /* Constructor */
};
protocor.storage.cloud.prototype = new protocor.enviroment.object();
protocor.storage.cloud.prototype.constructor = protocor.enviroment.event.object;
protocor.register('protocor.storage.cloud', protocor.storage.cloud);
protocor.mode(protocor.storage, 'cloud', protocor.MODE_LOCKED);
