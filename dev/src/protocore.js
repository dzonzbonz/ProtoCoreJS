
/**
 * @constructor
 * @returns {CJS}
 */
function CJS() {
    /* 
     * PUBLIC PROPERTIES 
     */
    this.VERSION = '::VERSION_NUMBER::';

    this.MODE_READONLY = 1;
    this.MODE_LOCKED = 2;
    this.MODE_HIDDEN = 4;
    this.MODE_PROPERTY = 8;

}

CJS.prototype = {
    /**
     * Generates unique ID
     * @param {Integer} _length
     * @returns {String}
     */
    guid: function (_length) {
        var s4 = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        var _ret = s4();

        for (var i = 0; i < _length - 1; i++) {
            _ret += '-' + s4();
        }

        return _ret;
    },
    isFunction: function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },
    isCallable: function (callable) {

        if (!this.isFunction(callable)) {
            return false;
        } else if (this.isArray(callable)) {
            if (callable.length !== 2) {
                return false;
            } else if (!this.isObject(callable[0]) || !this.isFunction(callable[1])) {
                return false;
            }
        }

        return true;
    },
    isObject: function (variableToCheck) {
        return variableToCheck && Object.prototype.toString.call(variableToCheck) === "[object Object]";
    },
    isArray: function (variableToCheck) {
        return variableToCheck && Object.prototype.toString.call(variableToCheck) === "[object Array]";
    },
    isString: function (variableToCheck) {
        return (typeof variableToCheck === 'string' || variableToCheck instanceof String);
    },
    isDefined: function (variableToCheck, undefinedValue) {
        return !(variableToCheck === undefinedValue);
    },
    descriptor: function (obj, property) {
        var _ret = null;
        if (obj.hasProperty && obj.hasProperty(property)) {
            _ret = obj.getPropertyDescriptor(property);
        }
        else if (obj.hasOwnProperty(property)) {
            _ret = Object.getOwnPropertyDescriptor(obj, property);
        }

        return _ret;
    },
    flaged: function (val, flag) {
        return ((val & flag) == flag);
    },
    /**
     * 
     * @param {Object} obj
     * @param {Integer} _mode
     * @param {String} _property
     * @returns {void}
     */
    mode: function (obj, _mode, _property) {
        var self = this;

        if (this.isArray(_mode) || this.isObject(_mode)) {
            // reverse logic
            this.mode(obj, _property, _mode);
        } else if (_property === null) {
            for (var _m in obj) {
                this.mode(obj, _m, _mode);
            }
        } else {
            if (this.isArray(_property) || this.isObject(_property)) {
                var propertyIsObject = this.isObject(_property);
                var propertyIsArray = this.isArray(_property);

                this.traverse(_property, function (propertyIndexOrName, propertyModeOrName) {
                    if (propertyIsArray) {
                        C.mode(obj, _mode, propertyModeOrName);
                    }
                    else if (propertyIsObject) {
                        C.mode(obj, propertyModeOrName, propertyIndexOrName);
                    }
                });
            }
            else if (this.isString(_property)) {
                var _writeable = !this.flaged(_mode, this.MODE_LOCKED) && !this.flaged(_mode, this.MODE_READONLY);
                var _enumerable = !this.flaged(_mode, this.MODE_HIDDEN);
                var _configurable = !this.flaged(_mode, this.MODE_LOCKED);

                var propertyDescriptor = this.descriptor(obj, _property);
                var protoDescriptor = null;
                if (this.isDefined(obj['__proto__'])) {
                    protoDescriptor = this.descriptor(obj.__proto__, _property);
                }

                if (propertyDescriptor && this.isDefined(propertyDescriptor['value'])) {
                    Object.defineProperty(obj, _property, {
                        writable: _writeable,
                        enumerable: _enumerable,
                        configurable: _configurable
                    });
                } else if (protoDescriptor && this.isDefined(protoDescriptor['value'])) {
                    Object.defineProperty(obj['__proto__'], _property, {
                        writable: _writeable,
                        enumerable: _enumerable,
                        configurable: _configurable
                    });
                }
            }
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
                this.mode(instance, mode, method);
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
    factory: function (instance, factory, method, mode) {
        var howToImplement = factory;
        var self = this;

        if (this.isString(factory)) {
            // reverse logic
            this.factory(instance, method, factory, mode);
        }
        else if (this.isObject(factory) || this.isArray(factory)) {
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
            var factoryImplementation = factory.apply(instance);

            if (factoryImplementation && this.isString(method) && this.isFunction(factory)) {
            // implement factory result as method
                this.implement(instance, method, factoryImplementation, mode);
            }
        }
    },
    /**
     * Instantiate object by class name
     * @param {String} className
     * @returns {unresolved}
     */
    instantiate: function (className) {
        var obj = null;
        eval('obj = new ' + className + '();');
        return obj;
    },
    call: function (callable, callee) {
        var ret = null;
        if (this.isCallable(callable)) {
            if (this.isArray(callable)) {
                var callArgs = Array.prototype.slice.call(arguments, 1);
            }
            else if (this.isFunction(callable)) {
                var callArgs = Array.prototype.slice.call(arguments, 1);
            }
        }

        return ret;
    },
    /**
     * 
     * @param {type} obj
     * @param {type} callback
     * @returns {Boolean}
     */
    traverse: function (obj, callback) {
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
    sleep: function (sleepDuration) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + sleepDuration) { /* do nothing */
        }
    },
    fork: function (callable, timeout, limit) {
        var asyncWait = 0;
        var asyncContext = window;
        var asyncCallable = callable;

        if (this.isArray(callable)) {
            if (C.isArray(callable[0]) || C.isFunction(callable[0])) {
                C.traverse(callable, function (cIndex, cValue) {
                    C.fork(cValue, timeout);
                });
                return;
            }
            else {
                asyncContext = callable[1];
                asyncCallable = callable[0];
            }
        }

        if (this.isDefined(timeout)) {
            asyncWait = timeout;
        }

        var busy = false;

        var process = setInterval(function () {
            if (!busy) {
                busy = true;

                asyncCallable.call(asyncContext);
                
                clearInterval(process);
                
                busy = false;
            }
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
    queue: function (callables, inputParams, onDone) {
        var _self = this;
        var _position = -1;

        var job = {
            output: {},
            input: inputParams
        };

        function queueContinue() {
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
                    'output': _self.clone(job.output),
                    'input': _self.clone(job.input)
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
    },
    load: function (file, onDone, onError) {
        if (jQuery) {
            jQuery.ajax({
                'url': file,
                'method': 'GET',
                'success': function (data) {
                    onDone(data);
                },
                'error': function (data) {
                    onError(data);
                }
            });
        } else {

        }
    }
};

C = new CJS();

C.factory(C, 'extend', function (method) {
    // helper function
    var instance = this;

    var _wrap = function (objectInstance, parentInstance) {
        if (!objectInstance.hasProperty) {
            C.implement(objectInstance,
                'hasProperty',
                function (property) {
                    var _ret = false;
                    if (this.hasOwnProperty(property)) { // this level property
                        _ret = true;
                    }
                    else if (parentInstance && parentInstance.hasProperty) { // parent level property protocor wrapper
                        _ret = parentInstance.hasProperty(property);
                    }
                    else if (parentInstance) { // parent level property dom wrapper
                        _ret = parentInstance.hasOwnProperty(property);
                    }

                    return _ret;
                },
                C.MODE_LOCKED & C.MODE_HIDDEN
            );
        }

        if (!objectInstance.getPropertyDescriptor) {
            C.implement(objectInstance,
                'getPropertyDescriptor',
                function (property) {
                    var _ret = false;

                    if (this.hasOwnProperty(property)) {
                        _ret = Object.getOwnPropertyDescriptor(this, property);
                    }
                    else if (parentInstance && parentInstance.hasProperty && parentInstance.hasProperty(property)) {
                        _ret = parentInstance.getPropertyDescriptor(property);
                    }
                    else if (parentInstance && parentInstance.hasOwnProperty(property)) {
                        _ret = Object.getOwnPropertyDescriptor(parentInstance, property);
                    }

                    return _ret;
                },
                C.MODE_LOCKED & C.MODE_HIDDEN
            );
        }
    };

    return function (objectInstance, parentInstance) {

        if (parentInstance) {
            _wrap(parentInstance);
        }

        _wrap(objectInstance, parentInstance);

        C.traverse(parentInstance, function (parentMethod, methodDefinition) {
            if (parentMethod === 'constructor' || parentMethod === '__instanceof__') {
                return;
            }

            var methodMode = 0;
            var desc = C.descriptor(parentInstance, parentMethod);
            
            if (!desc.writable) {
                methodMode = methodMode | C.MODE_READONLY;
            }

            if (!desc.configurable) {
                methodMode = methodMode | C.MODE_LOCKED;
            }

            if (!desc.enumerable) {
                methodMode = methodMode | C.MODE_HIDDEN;
            }

            instance.implement(objectInstance, parentMethod, methodDefinition, methodMode);
        });

    };
});

C.mode(C, [
    "VERSION", "MODE_HIDDEN", "MODE_LOCKED", "MODE_PROPERTY", "MODE_READONLY",
    'implement', 'factory', 'mode', 'extend', 'include', 'serialize', 'unserialize',
    'clone', 'cast', 'traverse', 'instantiate', 'descriptor',
    'fork', 'join', 'queue',
    'guid',
    'isFlaged', 'isFunction', 'isObject', 'isArray', 'isDefined', 'isString',
    'load'
], C.MODE_LOCKED);