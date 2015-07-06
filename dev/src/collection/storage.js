/**
 * @constructor
 * @extends {C.Collection.Array}
 */
C.Collection.Storage = function () {
    var _data = null,
            _uri = '',
            _parent = null;

    /* Inheritance */
    var parent = new C.Collection.Array();
        C.extend(this, parent);

    /**
     * @param {string} uri
     * @returns {array}
     */
    var decodeURI = function (uri) {
        if (uri instanceof Array) {
            return uri;
        }

        if (!C.isDefined(uri)) {
            uri = '/';
        }

        if (!C.isString(uri)) {
            throw 'Invalid uri value';
        }

        if (uri.charAt(0) != "/") {
            uri = '/' + uri;
        }

        var _path = uri.split("/");
        _path.splice(0, 1);

        if (_path[0] == '') {
            _path.splice(0, 1);
        }

        return _path;
    };

    var encodeURI = function (uri) {
        return '/' + uri.join('/');
    };

    this.set = function (uri, data) {
        var _uri = decodeURI(uri);

        if (_uri.length == 0) {
            this.merge(data);
        } else {
            var _key = (_uri.splice(0, 1))[0];

            if (_uri.length == 0) {
                parent.set.call(this, _key, data);
            } else {
                var _set = parent.isset.call(this, _key);
                var _storage = null;

                if (!_set || !(parent.get.call(this, _key) instanceof C.Collection.Storage)) {
                    _storage = protocor.create(protocor.type(this));
                    parent.set.call(this, _key, _storage);
                }
                _storage = parent.get.call(this, _key);
                _storage.set(_uri, data);
            }
        }

        return this;
    };

    this.get = function (uri) {
        var _uri = decodeURI(uri);
        var _ret = this;

        if (_uri.length == 0) {
            _ret = this;
        } else {
            var _key = (_uri.splice(0, 1))[0];
            if (_uri.length == 0) {
                _ret = parent.get.call(this, _key);
            } else {
                var _set = parent.isset.call(this, _key);

                if (!_set || !(parent.get.call(this, _key) instanceof C.Collection.Storage)) {
                    throw 'Storage path does not exist';
                }

                _ret = parent.get.call(this, _key).get(_uri);
            }
        }

        return _ret;
    };

    this.isset = function (uri) {
        var _uri = decodeURI(uri);
        var _isset = true;

        if (_uri.length == 0) {
            _isset = false;
        } else {
            var _key = (_uri.splice(0, 1))[0];
            _isset = parent.isset.call(this, _key);

            if (_uri.length > 0) {
                if (_isset && (parent.get.call(this, _key) instanceof C.Collection.Storage)) {
                    _isset = parent.get.call(this, _key).isset(_uri);
                }
            }
        }

        return _isset;
    };

    this.unset = function (uri) {
        var _uri = decodeURI(uri),
                _dest = parent,
                _isset = true,
                _position = 0,
                _key = null;

        for (var _index in _uri) {
            _position++;

            _key = _uri[_index];

            if (_position == _uri.length) {
                break;
            }

            if (!_dest.isset(_key)) {
                _isset = false;
                break;
            }

            _dest = _dest.get(_key);
        }

        if (_isset) {
            if (_key == null) {
                this.clear();
            } else {
                _dest.unset(_key);
            }
        }

        return this;
    };

};

C.Collection.Storage.prototype = new C.Collection.Array();
C.Collection.Storage.prototype.constructor = C.Collection.Storage;
C.mode(C.Collection, 'Storage', C.MODE_LOCKED);
C.constructable(C.Collection.Storage, 'C.Collection.Storage');