/**
 * protocor.collection.value class
 * @interface
 * @extends {protocor.collection.value}
 */
protocor.collection.parameter = function (_initialValue) {
/* Arguments */
	_initialValue = protocor.argument(_initialValue, {});
	
/* Inheritance */
	var parent = new protocor.enviroment.object();
		protocor.extend(this, parent);
	
	this.val = parent.data;
	
/* Constructor */
	this.val(_initialValue);
};
protocor.collection.value.prototype = new protocor.enviroment.object();
protocor.collection.value.prototype.constructor = protocor.enviroment.object;
protocor.register('protocor.collection.value', protocor.collection.value);
protocor.mode(protocor.collection, 'value', protocor.MODE_LOCKED);