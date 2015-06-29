protocor.require('protocor.enviroment.object');

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 * @param {Object} _params
 * 
 * available params are
 * uri - destination
 */
protocor.storage.local = function (_uri, _params) {
    /* Arguments */
    _uri = protocor.argument(_uri, false);
    _params = protocor.argument(_params, {
        'type': 'local' // or session
    });

    /* Variables */
    var _supported = false;
    try {
        _supported = 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        _supported = false;
    }

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

    this.collection = new protocor.collection.storage();
    protocor.mode(this, 'collection', protocor.MODE_LOCKED);

    /* Implementation */
    this.load = function () {
        var _loadData = new protocor.enviroment.event.data();
        _loadData.data(protocor.clone(_params));

        this.onLoad.notify(_loadData, this);

        if (!_loadData.stoped()) {
            if (_supported) {
                var _storage = localStorage.getItem(_uri);
                try {
                    _storage = JSON.parse(_storage);
                } catch (e) {
                    _storage = {};
                }

                this.collection.merge(_storage, true);

                var _loadedData = new protocor.enviroment.event.data();
                this.onLoaded.notify(_loadedData, this);
                //instance.data( _loadedData.data() );
            } else {
                var _errorData = new protocor.enviroment.event.data();
                this.onLoadError.notify(_errorData, this);
            }
        }

        return this;
    };

    this.save = function () {
        var _saveData = new protocor.enviroment.event.data();
        _saveData.data(this.collection.toJSON());

        this.onSave.notify(_saveData, this);

        if (!_saveData.stoped()) {
            if (_supported) {
//				localStorage[_uri] = _recursiveSave(_saveData.data());
                localStorage.setItem(_uri, JSON.stringify(_saveData.data()));
                this.onSaved.notify(_saveData, this);
            } else {
                var _errorData = new protocor.enviroment.event.data();
                this.onSaveError.notify(_errorData, this);
            }
        }

        return this;
    };
};
protocor.storage.local.prototype = new protocor.enviroment.object();
protocor.storage.local.prototype.constructor = protocor.enviroment.event.object;
protocor.register('protocor.storage.local', protocor.storage.local);
protocor.mode(protocor.storage, 'local', protocor.MODE_LOCKED);
