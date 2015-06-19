/**
 * @requires protocor.collection.base
 */
//protocor.require('protocor.collection.base');

/**
 * @constructor
 * @extends {protocor.collection.base}
 */
protocor.collection.array = function () {
/* Inheritance */
	var parent = new protocor.collection.base();
		protocor.extend(this, parent);
		
	this.merge 		= function (collection, forceType) {
		var instance = this;
		forceType = protocor.argument(forceType, false);
		
		protocor.each(collection, function (_field, _value) {
			if (typeof _value != 'function') {
				if ( !forceType && (_value == null || !(_value instanceof protocor.collection.base)) ) {
					instance.set(_field, _value);
				} else {
					if ( typeof _value === 'object' || typeof _value === 'array' ) {
						var _subCollection = protocor.create(protocor.type(instance));
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
	
	this.eachInDepth		= function (callback, results) {
		results = protocor.argument(results, false);
		
		var _stack = [{key : '' , val : this}];
		var _ret = [];
		
		while ( _stack.length > 0 ) {
			var _visit = _stack.pop();
			
			if (_visit.val instanceof protocor.collection.base) {
				_visit.val.each(function (_key, _coll) {
					_stack.push({key : _visit.key + '/' + _key , val : _coll});
				});
			}
			
			var _result = callback.apply(this, [(_visit.key == '' ? '/' : _visit.key), _visit.val]);
			
			if (results) {
				_ret.push({
					'key' 		: (_visit.key == '' ? '/' : _visit.key),
					'result' 	: _result
				});
			}
		}
		if (results) {
			return _ret;
		}
		
		return this;
	};
	
	this.sortInDepth	= function (order) {
		this.eachInDepth(function (_key, _val) {
			if (_val instanceof protocor.collection.base) {
				_val.sort(order);
			}
		});
		
		return this;
	};
	
	this.reverseInDepth		= function () {
		this.eachInDepth(function (_key, _val) {
			if (_val instanceof protocor.collection.base) {
				_val.reverse(order);
			}
		});
		
		return this;
	};
	
	this.shuffleInDepth		= function () {
		this.eachInDepth(function (_key, _val) {
			if (_val instanceof protocor.collection.base) {
				_val.shuffle(order);
			}
		});
		
		return this;
	};
};
protocor.collection.array.prototype = new protocor.collection.base();
protocor.collection.array.prototype.constructor = protocor.collection.array;
protocor.register('protocor.collection.array', protocor.collection.array);
protocor.mode(protocor.collection, 'array', protocor.MODE_LOCKED);