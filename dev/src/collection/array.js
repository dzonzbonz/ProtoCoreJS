/**
 * @requires protocor.collection.base
 */
//protocor.require('protocor.collection.base');

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
protocor.collection.array.prototype = new protocor.collection.base();
protocor.collection.array.prototype.constructor = protocor.collection.array;
protocor.register('protocor.collection.array', protocor.collection.array);
protocor.mode(protocor.collection, 'array', protocor.MODE_LOCKED);