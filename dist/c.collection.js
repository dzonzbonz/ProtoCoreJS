/** @license
 * protocore-js <https://github.com/dzonzbonz/ProtoCoreJS>
 * Author: Nikola Ivanovic - Dzonz Bonz | MIT License
 * v0.0.1 (2015/06/23 14:26)
 */

(function () {
var factory = function (C) {
    C.Storage = {
        namespace: 'C.Storage'
    };
    C.mode(C.Storage, 'namespace', C.MODE_LOCKED);
/**
 * @extends C.Enviroment.Object
 * @returns {C.Collection.Base}
 */
C.Collection.Base = function () {
    /* Variables */
    var _keys = [],
        _vals = [],
        _unique = false;

    /* Inheritance */
    var parent = new C.Enviroment.Object();
    C.extend(this, parent);

    /* Implementation */
    /**
     * Add an element to the end of the collection
     */
    this.queue = function (key, value, update) {
        update = C.ifDefined(update, true);

        var index = this.indexOf(key);

        if (update && index !== false) {
            _keys.splice(index, 1, key);
            _vals.splice(index, 1, value);
        } else if (!update && index !== false) {
            throw 'Unable to queue, Key ' + key + ' already found at index ' + index;
        } else if (index === false) {
            _keys.push(key);
            _vals.push(value);
        }

        return this;
    };
    /**
     * Return and remove an element from the end of the collection
     */
    this.dequeue = function () {
        if (this.count() == 0) {
            throw 'Collection is empty';
        }

        var _ret = {
            key: _keys.pop(),
            val: _vals.pop()
        };

        return _ret;
    };
    /**
     * Add an element to the beginning of the collection
     */
    this.push = function (key, value, update) {
        update = C.ifDefined(update, true);

        var index = this.indexOf(key);

        if (update && index !== false) {
            _keys.splice(index, 1, key);
            _vals.splice(index, 1, value);
        } else if (!update && index !== false) {
            throw 'Unable to queue, Key ' + key + ' already found at index ' + index;
        } else if (index === false) {
            _keys.unshift(key);
            _vals.unshift(value);
        }

        return this;
    };
    /**
     * Add an element to the beginning of the collection
     */
    this.pop = function () {
        if (this.count() == 0) {
            throw 'Collection is empty';
        }

        var _ret = {
            key: _keys.shift(),
            val: _vals.shift()
        };

        return _ret;
    };
    /**
     * Add an element to the end of the collection
     */
    this.append = function (key, value, update) {
        this.queue(key, value, update);
        return this;
    };
    /**
     * Add an element to the beginning of the collection
     */
    this.prepend = function (key, value, update) {
        this.push(key, value, update);
        return this;
    };
    /**
     * Add key and value pair on the beginning of the array
     */
    this.set = function (key, value) {
        this.queue(key, value, true);
        return this;
    };
    /**
     * Check if collection contains key value
     */
    this.isset = function (key) {
        return this.indexOf(key) !== false;
    };
    /**
     * Find position of a key
     */
    this.indexOf = function (key) {
        var index = _keys.indexOf(key);
        if (index == -1)
            return false;
        return index;
    };
    /**
     * Remove item from collection by key 
     */
    this.unset = function (key) {
        var index = this.indexOf(key);
        if (index !== false)
            this.removeAt(index);

        return this;
    };
    /**
     * Get item from collection by key 
     */
    this.get = function (key, _default) {
        var _ret = null;
        var index = this.indexOf(key);

        if (index === false && !C.isDefined(_default)) {
            throw 'Key not found ' + key;
        } else if (index === false && C.isDefined(_default))
            return _default;

        _ret = _vals[index];

        return _ret;
    };
    /**
     * Empty Collection 
     */
    this.clear = function () {
        _keys = [];
        _vals = [];

        return this;
    };
    /**
     * Merge any array or object type data 
     */
    this.merge = function (collection) {
        C.traverse(collection, function (_field, _value) {
            this.set(_field, _value);
        });
    };
    /**
     * Return number of collection items
     */
    this.count = function () {
        return _keys.length;
    };
    /**
     * Return if collection has items
     */
    this.has = function () {
        return _keys.length;
    };
    /**
     * Return all keys in collection
     */
    this.keys = function () {
        var _ret = new Array();

        for (var _index in _keys) {
            _ret.push(_keys[_index]);
        }
        return _ret;
    };
    /**
     * Insert at position
     */
    this.insertAt = function (index, key, val) {
        var indexOld = this.indexOf(key);

        if (indexOld === false && this.count() > index && 0 <= index) {
            _keys.splice(index, 0, key);
            _vals.splice(index, 0, val);
        } else {
            throw 'Unable to insert, Key ' + key + ' already found at index ' + indexOld 
                    + ', or index out of bounds';
        }

        return this;
    };
    /**
     * Get specific item on position
     */
    this.itemAt = function (index) {
        var _ret = {};

        if (index !== false && this.count() > index && 0 <= index) {
            _ret = {
                key: _keys[index],
                val: _vals[index]
            };
        } else {
            throw 'Unable to find item at index ' + index + ', index out of bounds';
        }


        return _ret;
    };
    /**
     * Remove at position
     */
    this.removeAt = function (index) {
        var _ret = {};

        if (index !== false && this.count() > index && 0 <= index) {
            _ret = {
                key: _keys[index],
                val: _vals[index]
            };
            _keys.splice(index, 1);
            _vals.splice(index, 1);
        } else {
            throw 'Unable to remove item at index ' + index + ', index out of bounds';
        }

        return _ret;
    };
    /**
     * 
     */
    this.remove = function (key) {
        var count = this.count();
        var index = this.indexOf(key);

        if (index !== false && this.count() > index && 0 <= index) {
            throw 'Key ' + key + ' not found.';
        } else {
            return this.removeAt(index);
        }
    };
    /**
     * Cycle array by some steps
     */
    this.cycle = function (step) {
    };
    /**
     * Move on a new position
     */
    this.moveAt = function (indexOld, indexNew) {
        if (indexNew != indexOld) {
            if (indexOld !== false && indexNew !== false
                && this.count() > indexNew && 0 <= indexNew
                && this.count() > indexOld && 0 <= indexOld)
            {
                var tmpKey = _keys[indexOld];
                var tmpVal = _vals[indexOld];
                var tmpCount = _keys.length - 1;

                _keys.splice(indexOld, 1);
                _vals.splice(indexOld, 1);

                if (indexNew >= tmpCount) {
                    _keys.push(tmpKey);
                    _vals.push(tmpVal);
                } else if (indexNew <= 0) {
                    _keys.unshift(tmpKey);
                    _vals.unshift(tmpVal);
                } else {
                    _keys.splice(indexNew, 0, tmpKey);
                    _vals.splice(indexNew, 0, tmpVal);
                }
            } else {
                throw 'Unable to move, index out of bounds: (i1=' + indexOld + ', i2=' + indexNew + ', n=' + this.count() + ')';
            }
        }

        return this;
    };
    /**
     * Move element by step
     */
    this.move = function (key, step) {
        var count = this.count();
        var index = this.indexOf(key);

        if (index === false) {
            throw 'Key ' + key + ' not found.';
        } else {
            var position = index + step;
            position = position % count;

            if (index != position) {
                this.moveAt(index, position);
            }
        }

        return this;
    };
    /**
     * Swap at specific positions
     */
    this.swapAt = function (index1, index2) {
        if (index1 != index2) {
            if (index1 !== false && index2 !== false
                && this.count() > index1 && 0 <= index1
                && this.count() > index2 && 0 <= index2)
            {

                var tmpKey = _vals[index1];
                _keys[index1] = _keys[index2];
                _keys[index2] = tmpKey;

                var tmpIndex = _vals[index1];
                _vals[index1] = _vals[index2];
                _vals[index2] = tmpIndex;

            } else {
                throw 'Unable to swap, index out of bounds';
            }
        }

        return this;
    };
    /**
     * Change element positions
     */
    this.swap = function (key1, key2) {
        var index1 = this.indexOf(key1);
        var index2 = this.indexOf(key2);

        if (index1 != index2) {
            if (index1 === false || index2 === false) {
                throw 'Unable to swap, keys not found or equal positions';
            } else {
                this.swapAt(index1, index2);
            }
        }

        return this;
    };
    /**
     * Sort items
     */
    this.sort = function (order) {
        order = C.ifDefined(order, 'asc');

//		var _iterations = 0;
        var _order = order == 'asc' ? 1 : -1;
        if (this.count() > 1) {
            var _lowerValue = _keys[_keys.length - 1],
                _lowerPointer = _keys.length - 1,
                _upperValue = _keys[_keys.length - 1],
                _upperPointer = _keys.length - 1,
                _lastPointer = _upperPointer,
                _lastValue = _upperValue,
                _newPointer = _upperPointer,
                _count = _keys.length;

            for (var _index = 0; _index < _count - 1; _index++) {

                var _value = _keys[0];

//              _iterations++;

                if (_value >= _upperValue && _order > 0
                        ||
                        _value <= _upperValue && _order < 0)
                {
                    // MOVE TO THE SORTED END
                    _upperValue = _value;
                    _newPointer = _upperPointer;
                } else if (
                    _value <= _lowerValue && _order > 0
                    ||
                    _value >= _lowerValue && _order < 0)
                {
                    // MOVE TO THE SORTED BEGINING
                    _lowerValue = _value;
                    _newPointer = _lowerPointer - 1;
                } else {
//				} else if (_value > _lowerValue && _value < _upperValue) {
                    // MOVE TO THE SORTED PART VIA NEAR BINARY SEARCH
                    // WE ASSUME THAT BETWEEN LOWER AND UPPER BOUND EVERYTHING IS SORTED
                    var _upperBound = _upperPointer,
                        _lowerBound = _lowerPointer,
                        _pivotPointer = null,
                        _pivotValue = null,
                        _pivotDiff = 0,
                        _pivotOrder = 0;

                    if (_lastValue < _value && _order > 0 ||
                            _lastValue > _value && _order < 0) {
                        // SET NEW LOWER BOUND
                        _lowerBound = _lastPointer;
                    } else {
                        // SET NEW UPPER BOUND
                        _upperBound = _lastPointer;
                    }

//					while (_lowerBound <= _upperBound) {
                    while (true) {
//						if (_iterations > 50) break;

                        _pivotPointer = ((_lowerBound + _upperBound) >> 1);
                        _pivotValue = _keys[_pivotPointer];
                        _pivotDiff = _value === _pivotValue ? 0 : (_value > _pivotValue ? 1 : -1);
                        _pivotOrder = _order * _pivotDiff;

                        if (_lowerBound === _pivotPointer || _upperBound === _pivotPointer || _pivotDiff == 0) {
                            break;
                        }

                        if (_pivotOrder > 0) {
                            // GO TO UPPER POINTER
                            _lowerBound = _pivotPointer;
                        } else if (_pivotOrder < 0) {
                            // GO TO LOWER POINTER
                            _upperBound = _pivotPointer;
                        }

//						_iterations++;

                    }

                    _newPointer = _pivotPointer;

                    if (_pivotOrder <= 0) {
                        _newPointer--;
                    }

                }

                this.moveAt(0, _newPointer);

                _lastValue = _value;
                _lastPointer = _newPointer;

                _lowerPointer--;
            }
        }

        //var iterationComplexity = _iterations / this.count();
        //alert(_iterations + ' iterations on ' + this.count() + ' elements. Complexity: ' + iterationComplexity + ' Predicted was: ' + Math.log(this.count()));

        return this;
    };
    /**
     * Reverse items
     */
    this.reverse = function () {
        var left = null;
        var right = null;
        var temporary = null;
        for (left = 0, right = _keys.length - 1; left < right; left += 1, right -= 1)
        {
            temporary = _keys[left];
            _keys[left] = _keys[right];
            _keys[right] = temporary;
            temporary = _vals[left];
            _vals[left] = _vals[right];
            _vals[right] = temporary;
        }

        return this;
    };
    /**
     * Shuffle items
     */
    this.shuffle = function () {
        var i = _keys.length,
                j, t;

        while (--i > 0) {
            j = ~~(Math.random() * (i + 1));
            t = _keys[j];
            _keys[j] = _keys[i];
            _keys[i] = t;
            t = _vals[j];
            _vals[j] = _vals[i];
            _vals[i] = t;
        }

        return this;
    };
    /**
     * Traverse through all items in current level
     */
    this.traverse = function (callback, results) {
        /**
         * @var {Boolear} results
         */
        results = C.ifDefined(results, false);

        var _ret = [];
        var self = this;
        C.traverse(_keys, function (_index, _key) {
            var _result = callback.apply(self, [_key, _vals[_index]]);

            if (results) {
                _ret.push({
                    'key': _key,
                    'result': _result
                });
            }
        });

        if (results) {
            return _ret;
        }

        return this;
    };

    /* Common */
    this.toJSON = function () {
        var _ret = parent.toJSON.call(this);

        for (var _index in _keys) {
            var k = _keys[_index];
            var v = _vals[_index];
            if (v instanceof C.Enviroment.Object) {
                _ret[k] = v.toJSON();
            } else {
                _ret[k] = v;
            }
        }
        return _ret;
    };

    this.toJSAN = function () {
        var _ret = parent.toJSON.call(this);

        for (var _index in _keys) {
            var v = _vals[_index];
            if (v instanceof C.Enviroment.Object) {
                _ret.push({
                    key: _keys[_index],
                    val: v.toJSON()
                });
            } else {
                _ret.push({
                    key: _keys[_index],
                    val: v
                });
            }
        }
        return _ret;
    };

    this.serialize = function () {
        var serialized = parent.serialize.call(this);
        serialized['unique'] = _unique;
        serialized['collection'] = {};

        for (var _index in _keys) {
            serialized['collection'][_keys[_index]] = C.serialize(_vals[_index]);
        }

        return serialized;
    };

    this.unserialize = function (serialized) {
        this.clear();

        parent.unserialize.call(this, serialized);

        _unique = false;
        if (serialized['unique']) {
            _unique = serialized['unique'];
        }

        if (serialized['collection']) {
            for (var key in serialized['collection']) {
                var value = serialized['collection'][key];
                this.queue(key, C.unserialize(value));
            }
        }

        return this;
    };
};

C.Collection.Base.prototype = new C.Enviroment.Object();
C.Collection.Base.prototype.constructor = C.Collection.Base;
C.mode(C.Collection, 'Base', C.MODE_LOCKED);
/**
 * @requires protocor.Collection.Base
 */
//protocor.require('protocor.Collection.Base');

/**
 * @constructor
 * @extends {C.Collection.Base}
 */
C.Collection.Array = function () {
    /* Inheritance */
    var parent = new C.Collection.Base();
    C.extend(this, parent);

    this.merge = function (collection, forceType) {
        var instance = this;
        forceType = C.ifDefined(forceType, false);

        C.traverse(collection, function (_field, _value) {
            if (!C.isFunction(_value)) {
                if (!forceType && (_value == null || !(_value instanceof C.Collection.Base))) {
                    instance.set(_field, _value);
                } else {
                    if (typeof _value === 'object' || typeof _value === 'array') {
                        var _subCollection = C.instantiate(C.type(instance));
                        instance.set(_field, _subCollection);
                        _subCollection.merge(_value, forceType);
                    } else {
                        instance.set(_field, _value);
                    }
                }
            }
        });

        return this;
    };

    this.traverseInDepth = function (callback, results) {
        results = C.ifDefined(results, false);

        var _stack = [{key: '', val: this}];
        var _ret = [];

        while (_stack.length > 0) {
            var _visit = _stack.pop();

            if (_visit.val instanceof C.Collection.Base) {
                _visit.val.traverse(function (_key, _coll) {
                    _stack.push({key: _visit.key + '/' + _key, val: _coll});
                });
            }

            var _result = callback.apply(this, [(_visit.key == '' ? '/' : _visit.key), _visit.val]);

            if (results) {
                _ret.push({
                    'key': (_visit.key == '' ? '/' : _visit.key),
                    'result': _result
                });
            }
        }
        if (results) {
            return _ret;
        }

        return this;
    };

    this.sortInDepth = function (order) {
        this.traverseInDepth(function (_key, _val) {
            if (_val instanceof C.Collection.Base) {
                _val.sort(order);
            }
        });

        return this;
    };

    this.reverseInDepth = function () {
        this.eachInDepth(function (_key, _val) {
            if (_val instanceof C.Collection.Base) {
                _val.reverse();
            }
        });

        return this;
    };

    this.shuffleInDepth = function () {
        this.eachInDepth(function (_key, _val) {
            if (_val instanceof C.Collection.Base) {
                _val.shuffle();
            }
        });

        return this;
    };
};
C.Collection.Array.prototype = new C.Collection.Base();
C.Collection.Array.prototype.constructor = C.Collection.Array;
C.mode(C.Collection, 'array', C.MODE_LOCKED);
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
    C.extend(this, parent, 'C.Collection.Storage', 'C.Collection.Array');

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
    return C.Storage;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Collection'] = factory(C);
}

}());
