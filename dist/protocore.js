/** @license
 * protocore-js <https://github.com/dzonzbonz/ProtoCoreJS>
 * Author: Nikola Ivanovic - Dzonz Bonz | MIT License
 * v0.0.1 (2015/06/09 12:49)
 */

(function () {
var factory = function () {

/**
 * @constructor
 * @returns {ProtoCoreJS}
 */
function ProtoCoreJS() {
    /* 
     * PUBLIC PROPERTIES 
     */
    this.MODE_READONLY = 1;
    this.MODE_LOCKED = 2;
    this.MODE_HIDDEN = 4;
    this.MODE_PROPERTY = 8;
    
    /**
     * @returns String
     */
    this.version = function () {};

    /**
     * Implement methods using module pattern
     * 
     * @param {Object} instance
     * @param {String} method
     * @param {Function} definition
     */
    this.implement = function (instance, method, definition, mode) {};

    /**
     * Implement methods using module pattern
     * 
     * @param {Object} instance
     * @param {String} method
     * @param {Function} strategy
     */
    this.factory = function (instance, method, strategy, mode) {};

    /**
     * 
     * @param {String} _class
     * @param {Function} _constructor
     * @returns {undefined}
     */
    this.register = function (_class, _constructor) {};

    this.registry = function (_class) {};

    /**
     * 
     * @param {type} _class
     * @param {type} _childClass
     * @param {type} _parentPrototype
     * @returns {undefined}
     */
    this.make = function (_class, _childClass, _parentPrototype) {};

    /**
     * _mode = PROTOCOR_MODE_CLOSED, PROTOCOR_MODE_OPENED
     */
    this.mode = function (obj, _property, _mode) {};

    this.hasFlag = function (val, flag) {};

    this.isFunction = function (functionToCheck) {};

    this.isObject = function (variableToCheck) {};

    this.isArray = function (variableToCheck) {};
    
    this.isDefined = function (variableToCheck) {};
    
    this.isString = function (variableToCheck) {};

    this.descriptor = function (obj, property) {};

    /**
     * Generates unique ID
     * 
     * @returns string
     */
    this.guid = function (_length) {};
    /**
     * 
     */
    this.traverse = function (obj, callback) {};

    this.instantiate = function (cls) {};

    this.fork = function (callable, args) {};
    
    this.queue = function (callables) {};
    
    /**
     * 
     * @param {type} obj
     * @returns {ProtoCoreInterface.serialize._ret}
     */
    this.serialize = function (obj) {};

    /**
     * 
     * @param {type} serialized
     * @returns {ProtoCoreInterface.unserialize.obj}
     */
    this.unserialize = function (serialized) {};

    /**
     * 
     * @param {type} obj
     * @returns {ProtoCoreInterface.clone.obj|ProtoCoreInterface.unserialize.obj|type}
     */
    this.clone = function (obj) {};

    /**
     * 
     * @param {type} obj
     * @param {type} castTo
     * @returns {ProtoCoreInterface.cast.obj|ProtoCoreInterface.unserialize.obj|type}
     */
    this.cast = function (obj, castTo) {};

    /*
     * 
     */
    this.extend = function (instance, parent) {};
    
    /**
     * 
     * @param {type} includeScript
     * @param {type} requireStrategy
     * @param {type} callbackDone
     * @param {type} callbackError
     * @returns {undefined}
     */
    this.require = function (includeScript, requireStrategy, callbackDone, callbackError) {};
    
    this.helper = function () {};
}

ProtoCoreJS.prototype = {
    /**
     * Generates unique ID
     * @param {Integer} _length
     * @returns {String}
     */
    guid : function (_length) {
        var s4 = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        var _ret = s4();

        for (var i = 0; i < _length - 1; i++) {
            _ret += '-' + s4();
        }

        return _ret;
    },
    
    isFunction : function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },

    isObject : function (variableToCheck) {
        return variableToCheck && Object.prototype.toString.call(variableToCheck) === "[object Object]";
    },

    isArray : function (variableToCheck) {
        return variableToCheck && Object.prototype.toString.call(variableToCheck) === "[object Array]";
    },

    isString : function (variableToCheck) {
        return (typeof variableToCheck === 'string' || variableToCheck instanceof String);
    },

    isDefined : function (variableToCheck, undefinedValue) {
        return !(variableToCheck === undefinedValue);
    },
    
    descriptor : function (obj, property) {
        var _ret = null;
        if (obj.hasProperty && obj.hasProperty(property)) {
            _ret = obj.getPropertyDescriptor(property);
        }
        else if (obj.hasOwnProperty(property)) {
            _ret = Object.getOwnPropertyDescriptor(obj, property);
        }

        return _ret;
    },
    
    flaged : function (val, flag) {
        return ((val & flag) == flag);
    },
    
    /**
     * 
     * @param {Object} obj
     * @param {Integer} _mode
     * @param {String} _property
     * @returns {void}
     */
    mode : function (obj, _mode, _property) {
        if (_property === null) {
            for (var _m in obj) {
                this.mode(obj, _m, _mode);
            }
        } else {
            var _writeable = !this.flaged(_mode, this.MODE_LOCKED) && !this.flaged(_mode, this.MODE_READONLY);
            var _enumerable = !this.flaged(_mode, this.MODE_HIDDEN);
            var _configurable = !this.flaged(_mode, this.MODE_LOCKED);
            
            Object.defineProperty(obj, _property, {
                writable: _writeable,
                enumerable: _enumerable,
                configurable: _configurable
            });
        }
    },
    
    implement: function (instance, method, definition, mode) {
        var self = this;
        
        if (this.isObject(method)) {
            this.traverse(method, function (methodName, methodDefinition) {
                self.implement(instance, methodName, methodDefinition);                
            });
        }
        else if (this.isString(method) && definition) {
            
            Object.defineProperty(instance, method, {
                writable: true,
                enumerable: true,
                configurable: true,
                value: definition
            });

            if (mode) {
                this.mode(instance, method, mode);
            }
        }
    },
    
    /**
     * Implement methods using module pattern
     * 
     * @param {Object} where
     * @param {String} what
     * @param {Function} how
     */
    factory : function (instance, factory, method, mode) {
        var howToImplement = null;
        var self = this;
        
        if (this.isString(factory)) {
        // reverse logic
            this.factory(instance, method, factory, mode);
        }
        else {
            if (this.isObject(factory) || this.isArray(factory)) {
            // we have list of factories
                var factoryIsObject = this.isObject(factory);
                var factoryIsArray = this.isArray(factory);

                this.traverse(method, function (methodName, factoryDefinition) {
                    if (factoryIsObject) {
                    // we have a named method and a factory
                        self.factory(instance, factoryDefinition, methodName, mode);
                    } else if (factoryIsArray) {
                    // we have unnamed method but we do a factory
                        self.factory(instance, factoryDefinition, null, mode);
                    }
                });
            }
            else if (this.isFunction(factory)) {
            // single factory
                var factoryImplementation = factory.call(instance, method);

                if (this.isString(method) && this.isFunction(factory)) {
                // implement factory result as method
                    this.implement(instance, method, factoryImplementation, mode);
                }
            }
        }
    },
    
    /**
     * Instantiate object by class name
     * @param {String} className
     * @returns {unresolved}
     */
    instantiate : function (className) {
        var obj = null;
        eval('obj = new ' + className + '();');
        return obj;
    },
    
    /**
     * 
     * @param {type} obj
     * @param {type} callback
     * @returns {Boolean}
     */
    traverse : function (obj, callback) {
        if (!obj) {
            return false;
        }

        if (obj.hasOwnProperty('traverse') && this.isFunction(obj.traverse)) {
            return obj.traverse(callback);
        } else {
            var _ret = {};
            for (var _index in obj) {
                _ret[_index] = callback.apply(obj, [_index, obj[_index]]);
            }
            return _ret;
        }
    },

    fork : function (callable, timeout) {
        var asyncArgs = Array.prototype.slice.call( arguments, 1 );
        var asyncWait = 0;
        var asyncContext = window;
        var asyncCallable = callable;
        
        if (this.isArray(callable)) {
            asyncContext = callable[1];
            asyncCallable = callable[0];
        } 
        
        if (this.isDefined(timeout)) {
            asyncArgs = Array.prototype.slice.call( arguments, 2 );
            asyncWait = timeout;
        }
        
        var _executed = false;

        var tm = setTimeout(function () {
            if (_executed) {
                return;
            }
            
            _executed = true;
            
            asyncCallable.apply(asyncContext, asyncArgs);
            clearTimeout(tm);
        }, asyncWait);
    },

    join: function (callables, events) {
        var _self = this;
        var _position = -1;
        var _callables = {};
        
        function joinContinue(_jobIndex) {
            if (_position < callables.length && callables.length > 0) {
                _position++;
                
                if (events && events['jobDone']) {
                    events['jobDone'].call(_self.clone(_callables));
                }
                
            } else {
                if (events && events['done']) {
                    events['done']();
                }
            }
        }
        
        this.traverse(callables, function (callableIndex, callableProperty) {
            var joinJob = {};
            
            _callables[callableIndex] = false;
            
            /* JOB FACTORY */
            _self.factory(joinJob, 'join', function () {
                var done = false;
                var jobIndex = callableIndex;
                
                return function () {
                    if (!_callables[jobIndex]) {
                        joinContinue(jobIndex);
                    }

                    _callables[jobIndex] = true;
                };

            }, _self.MODE_LOCKED);

            if (_self.isFunction(callableProperty)) {
                _self.fork([callableProperty, joinJob]);
            } else {
                joinJob.join();
            }
        });
    },

    queue : function (callables, inputParams, onDone) {
        var _self = this;
        var _position = -1;
        
        var job = {
            output : {},
            input : inputParams
        };
        
        function queueContinue () {
            if (_position < callables.length && callables.length > 0) {
                _position++;
                queueIterator(_position);
            } else {
                if (onDone) {
                    onDone();
                }
            }
        }
        
        var queueIterator = function (_position) {
            if (_position < callables.length) {

                var _callable = callables[_position];
                var newJob = {
                    'output' : _self.clone(job.output),
                    'input' : _self.clone(job.input)
                };
                
                /* JOB FACTORY */
                _self.factory(newJob, 'next', function () {
                    var done = false;

                    return function () {
                        if (!done) {
                            queueContinue();
                        }

                        done = true;
                    };
                    
                }, _self.MODE_LOCKED);
                    
                if (_self.isFunction(_callable)) {
                    _callable(newJob);
                } else {
                    newJob.next();
                }
            }
        };

        queueContinue();
    }
};

protocore = new ProtoCoreJS();
protocore.VERSION = '0.0.1';
    return protocore;
};

if (typeof define === 'function' && define.amd) {
    define([], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['protocore'] = factory();
}

}());

