/**
 * protocor.collection.value class
 * @interface
 * @extends {protocor.enviroment.object}
 */
protocor.collection.value = function (_initialValue) {
/* Arguments */
	_initialValue = protocor.argument(_initialValue, null);
	
/* Variables */
	var _value = null,
		_locked = false,
		_required = false,
		_isset = false;
	
/* Inheritance */
	var parent = new protocor.enviroment.object();
		protocor.extend(this, parent);
	
	this.set = function (value) {
		if (!this.isLocked() || !this.isSet()) {
			_value = value;
			_isset = true;
		}
		
		return this;
	};
	this.get = function () {
		if (this.isRequired() && !this.isSet()) {
			throw 'Value is required, Set it before getting it.';
		}
		
		return _value;
	};
	this.is = function (value) {
		return _isset;
	};
	
	this.isSet = function () {
		return _isset;
	};
	
	this.locked = function () {
		_locked = true; 
		return this;
	};
	
	this.isLocked = function () {
		return _locked;
	};
	
	this.required = function () {
		_required = true; 
		return this;
	};
	this.isRequired = function () {
		return _required;
	};
	
	this.isValid = function () {
		if (this.isRequired() && !this.isSet()) {
			return false;
		}
		
		return true;
	};
	
	this.toString = function () {
		return _value;
	};
	
/* Constructor */
	this.set(_initialValue);
};
protocor.collection.value.prototype = new protocor.enviroment.object();
protocor.collection.value.prototype.constructor = protocor.enviroment.object;
protocor.register('protocor.collection.value', protocor.collection.value);
protocor.mode(protocor.collection, 'value', protocor.MODE_LOCKED);