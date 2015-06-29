/**
 * @constructor
 * @extends {C.Enviroment.Object}
 * @param {type} initialValue
 * @returns {C.Enviroment.Value}
 */
C.Enviroment.Value = function (initialValue) {
    /* Variables */
    var _value = null,
        _locked = false,
        _required = false,
        _isset = false;

    /* Inheritance */
    var parent = new C.Enviroment.Object();
    C.extend(this, parent);

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
    this.equals = function (value) {
        return _value == value;
    };

    this.isSet = function () {
        return _isset;
    };

    this.setLocked = function () {
        _locked = true;
        return this;
    };

    this.isLocked = function () {
        return _locked;
    };

    this.setRequired = function () {
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
    this.set(initialValue);
};

C.Enviroment.Value.prototype = new C.Enviroment.Object();
C.Enviroment.Value.prototype.constructor = C.Enviroment.Object;
C.mode(C.Enviroment, 'Value', C.MODE_LOCKED);
C.constructable(C.Enviroment.Value, 'C.Enviroment.Value');