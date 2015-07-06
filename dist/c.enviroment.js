/** @license
 * protocore-js <https://github.com/dzonzbonz/ProtoCoreJS>
 * Author: Nikola Ivanovic - Dzonz Bonz | MIT License
 * v0.0.1 (2015/07/06 14:50)
 */

(function () {
var factory = function (C) {
    C.Enviroment = {};
    C.namespace(C.Enviroment, 'C.Enviroment');
    
/**
 * 
 * @constructor
 * @returns {C.Enviroment.Object}
 */
C.Enviroment.Object = function () {
    
    this.guid = function () {};
    
    this.data = function () {};
    
    this.serialize = function () {};
    
    this.unserialize = function (serialized) {};
    
    this.toJSON = function () {};
};

C.factory(C.Enviroment, 'Object', function () {
    
    function C__Enviroment__Object() {
        var objectGUID = C.guid(4);
        var objectData = {};
        
        C.extend(this);
        
        this.guid = function () {
            return objectGUID;
        };
        C.mode(this, 'guid', C.MODE_LOCKED);
        
        this.data = function (key, value) {
            if (C.isDefined(value)) {
                if (!C.isDefined(key)) {
                // GETTER
                    return objectData;
                } 
                else if (C.isArray(key)
                        || C.isObject(key)) {
                // SETTER
                    objectData = key;
                } 
                else {
                // SETTER
                    objectData[key] = value;
                }
            } 
            else {
                if (!C.isDefined(key)) {
                // GETTER
                    return objectData;
                } else {
                // SETTER
                    if (C.isArray(key)
                        || C.isObject(key)) {
                    // SETTER
                        objectData = key;
                    }
                    else if (!C.isDefined(objectData[key])) {
                        return null;
                    }
                    return objectData[key];
                }
            }
            return this;
        };
        
        this.serialize = function () {
            return this.toJSON();
        };

        this.unserialize = function (serialized) {
            if (serialized['guid']) {
                objectGUID = serialized['guid'];
                objectData = C.unserialize(serialized['data']);
            }
            return this;
        };

        this.toString = function () {
            return {};
        };
        
        this.toJSON = function () {
            return {
                'guid': objectGUID,
                'data': C.serialize(objectData)
            };
        };
        
//        this.toJSAN = function () {
//            return [
//                ["guid", objectGUID],
//                ["data", C.serialize(objectData)]
//            ];
//        };
        
    };
    
    C__Enviroment__Object.prototype = new C.Enviroment.Object();
    C__Enviroment__Object.prototype.constructor = C.Enviroment.Object;
    
//    C.constructable(C__Enviroment__Object);
    
    return C__Enviroment__Object;
}, C.MODE_LOCKED);
/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Object} initialData
 * @returns {C.Enviroment.EventData}
 */
C.Enviroment.EventData = function (initialData) {
    
    this.stopPropagation = function () {};
    
    this.continuePropagation = function () {};
    
    this.preventDefault = function () {};
    
    this.assumeDefault = function () {};
    
    this.stopped = function () {};
    
    this.assumed = function () {};
};

C.Enviroment.EventData.prototype = new C.Enviroment.Object();
C.Enviroment.EventData.prototype.constructor = C.Enviroment.EventData;

C.factory(C.Enviroment, 'EventData', function () {
    /**
     * 
     * @extends C.Enviroment.EventData
     * @returns {C.Enviroment.EventData}
     */
    var __constructor = function (initialData) {
    /* Variables */
        var eventResult = null,
            breakEvent = false,
            defaultAction = true;

    /* Inheritance */
        var parent = new C.Enviroment.Object();
        C.extend(this, parent);
    
    /* Implementation */
        /**
         * Stops event propagation
         * @returns {C.Enviroment.EventData}
         */
        this.stopPropagation = function () {
            breakEvent = true;
            return this;
        };

        /**
         * Continues event propagation
         * @returns {C.Enviroment.EventData}
         */
        this.continuePropagation = function () {
            breakEvent = false;
            return this;
        };

        /**
         * Prevents default action
         * @returns {C.Enviroment.EventData}
         */
        this.preventDefault = function () {
            defaultAction = false;
            return this;
        };

        /**
         * Assumes the default action
         * @returns {C.Enviroment.EventData}
         */
        this.assumeDefault = function () {
            defaultAction = true;
            return this;
        };

        /**
         * Is event propagation stopped
         * @returns {Boolean}
         */
        this.stopped = function () {
            return breakEvent;
        };

        /**
         * Is event assuming the default action
         * @returns {Boolean}
         */
        this.assumed = function () {
            return defaultAction;
        };

        /* Constructor */
        this.data(initialData);
        
        C.mode(this, [
            'assumed', 'stoped', 'assumeDefault', 'preventDefault',
            'continuePropagation', 'stopPropagation'
        ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.EventData();
    __constructor.prototype.constructor = C.Enviroment.EventData;
    
    return __constructor;
}, C.MODE_LOCKED);
/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Function} actionAfter
 * @param {Function} actionBefore
 * @param {Object} callContext
 * 
 * @returns {C.Enviroment.Event}
 */
C.Enviroment.Event = function (actionAfter, actionBefore, callContext) {
    
    this.subscribe = function (callable) {};

    this.notify = function (eventData) {};

    this.empty = function () {};

    this.reset = function () {};

    this.suspend = function () {};

    this.resume = function () {};
    
};

C.Enviroment.Event.prototype = new C.Enviroment.Object();
C.Enviroment.Event.prototype.constructor = C.Enviroment.Event;

C.factory(C.Enviroment, 'Event', function () {
    /**
     * @constructor
     * @extends C.Enviroment.Object
     * @returns {C.Enviroment.Event}
     */
    var __constructor = function (actionAfter, actionBefore, callContext) {
    /* Variables */
        var eventsData = {
            'before': C.isDefined(actionBefore) ? actionBefore : function () {},
            'after': C.isDefined(actionAfter) ? actionAfter : function () {},
            'subscribers': []
        },
        eventsSuspended = 0,
        defaultCallContext = callContext;

    /* Inheritance */
        var parent = new C.Enviroment.Object();
        C.extend(this, parent);
    
    /* Implementation */
        this.subscribe = function (callable) {
            eventsData['subscribers'].push({
                delegate: C.isArray(callable) ? callable[1] : callable,
                context: C.isArray(callable) ? callable[0] : defaultCallContext
            });

            return this;
        };

        /**
         * Notifies registered subscribers
         * 
         * @param {C.Enviroment.EventData} eventData
         * @returns {C.Enviroment.Event}
         */
        this.notify = function (eventData, _backupCallContext) {
            var _instance = defaultCallContext;

            if (_backupCallContext) {
                _instance = _backupCallContext;
            }

            if (eventsSuspended > 0)
                return this;
            else
                this.reset();

            if (C.isFunction(eventsData.before)) {
                eventsData.before.call(_instance, eventData);
            }

            if (!eventData.stopped()) {
                var _delegates = eventsData['subscribers'];
                for (var _index in _delegates) {
                    var _delegate = _delegates[_index].delegate;
                        _delegate.call(_delegates[_index].context || _instance, eventData, _backupCallContext);
                    if (eventData.stopped())
                        break;
                }
            }

            if (eventData.assumed()) {
                if (C.isFunction(eventsData.after)) {
                    eventsData.after.call(_instance, eventData, _instance);
                }
            }

            return this;
        };

        this.empty = function () {
            if (!eventsData)
                eventsData['subscribers'] = new Array();
            eventsSuspended = 0;
            return this;
        };

        this.reset = function () {
            eventsSuspended = 0;
            return this;
        };

        this.suspend = function () {
            eventsSuspended++;
            return this;
        };

        this.resume = function () {
            eventsSuspended--;
            return this;
        };
        
        C.mode(this, [
            'assumed', 'stopped', 'assumeDefault', 'preventDefault',
            'continuePropagation', 'stopPropagation'
        ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.Event();
    __constructor.prototype.constructor = C.Enviroment.Event;
    
    return __constructor;
}, C.MODE_LOCKED);

/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Function} actionAfter
 * @param {Function} actionBefore
 * @param {Object} callContext
 * 
 * @returns {C.Enviroment.Task}
 */
C.Enviroment.Task = function (callable) {
    
    this.onMessage = new C.Enviroment.Event();
    this.onStop = new C.Enviroment.Event();
    this.onRun = new C.Enviroment.Event();
        
    this.run = function () {
    };

    this.pipe = function () {
    };

    this.stop = function () {
    };

};

C.factory(C.Enviroment, 'Task', function () {

    var thread = window.Worker;
    var URL = window.URL || window.webkitURL;

    function encodeArguments (args) {
        try {
            var data = JSON.stringify(args);
        } catch (e) {
            throw new Error('Arguments provided to parallel function must be JSON serializable');
        }
        var len = typeof (data) === 'undefined' ? 0 : data.length;
        var buffer = new ArrayBuffer(len);
        var view = new DataView(buffer);
        for (var i = 0; i < len; i++) {
            view.setUint8(i, data.charCodeAt(i) & 255);
        }
        return buffer;
    };

    function decodeArguments (data) {
        var view = new DataView(data);
        var len = data.byteLength;
        var str = Array(len);
        for (var i = 0; i < len; i++) {
            str[i] = String.fromCharCode(view.getUint8(i));
        }
        if (!str.length) {
            return;
        } else {
            return JSON.parse(str.join(''));
        }
    };

    var resourceTemplate = function () {
        
        var decodeArguments = (/**/decodeFunc/**/);
        
        var encodeArguments = (/**/encodeFunc/**/);
        
        var /**/name/**/ = (/**/func/**/);
        
    // send message to the initiator
        /**/name/**/.pipe = function (messageID, messageData) {
            self.postMessage({
                'message': messageID,
                'data': messageData
            });
        };
        
        /**/name/**/.sleep = function (sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
        };
        
        self.addEventListener('message', function (e) {
            var inputArgs = e.data;
            
            var value = (/**/name/**/).apply(/**/name/**/, inputArgs);
            
            self.postMessage({
                'message': false,
                'data': value
            });
            self.close();
        });
    };

    var prepareResource = function (callback) {

        callback = callback;
        
        var name = callback.name;
        var fnStr = callback.toString();
        if (!name) {
            name = '$' + ((Math.random() * 10) | 0);
            while (fnStr.indexOf(name) !== -1) {
                name += ((Math.random() * 10) | 0);
            }
        }

        var script = resourceTemplate
                .toString()
                .replace(/^.*?[\n\r]+/gi, '')
                .replace(/\}[\s]*$/, '')
                .replace(/\/\*\*\/name\/\*\*\//gi, name)
                .replace(/\/\*\*\/func\/\*\*\//gi, fnStr)
                .replace(/\/\*\*\/decodeFunc\/\*\*\//gi, decodeArguments.toString() )
                .replace(/\/\*\*\/encodeFunc\/\*\*\//gi, encodeArguments.toString() );

        var resource = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));

        return resource;

    };

    var startProcess = function (resource, callback, pipe, params) {
        
        var worker = new Worker(resource);
        
        var self = this;
        
        var listener = function (e) {
            var piped = e.data;
            
            if (piped.message) {
                pipe.call(self, piped);
            }
            else {
                callback.call(self, piped);
            }
        };
        
    // listen to the messages comming from worker
        worker.addEventListener('message', listener);
        worker.postMessage(params);
        
        return worker;
    };

    /**
     * @constructor
     * @extends C.Enviroment.Object
     * @returns {C.Enviroment.Task}
     */
    var __constructor = function (callable, callback, pipe) {
        var running = false;
        var debug = {
            start: 0,
            end: 0,
            time: 0
        };
        var worker = null;
        
        this.onMessage = new C.Enviroment.Event();
        this.onStop = new C.Enviroment.Event();
        this.onRun = new C.Enviroment.Event();
        
        this.run = function () {
            if (!running) {
                running = true;
//                var self = this;
                var processResource = prepareResource(callable);
                
                var eventData = new C.Enviroment.EventData();
                
                worker = startProcess(
                    processResource, 
                    function (e) {
                        eventData.data(e);
                        eventData.assumeDefault();
                        eventData.continuePropagation();
                        self.onStop.notify(eventData);
                    }, 
                    function (e) {
                        eventData.data(e);
                        eventData.assumeDefault();
                        eventData.continuePropagation();
                        self.onMessage.notify(eventData);
                    }, 
                    [].slice.call(arguments)
                );
        
                this.onRun.notify(new C.Enviroment.EventData());
            }
        };

        this.pipe = function () {
            if (running) {
                worker.postMessage([].slice.call(arguments));
            }
        };

        this.stop = function () {
            if (running) {                
                worker.terminate();
                running = false;
            }
        };
        
        var self = this;
        
        C.mode(this, [ 'run', 'pipe', 'onMessage', 'onStop', 'onRun' ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.Task();
    __constructor.prototype.constructor = C.Enviroment.Task;
    
    return __constructor;
});
C.Enviroment.Loader = function () {

    this.addStrategy = function (strategyKey, strategyCondition, strategyResolve) {
    };

    this.nativeInvokableLoaderStrategy = function (invokableClass) {
    };

    this.load = function (required, type, callbackDone, callbackError) {
    };

    this.resolve = function (required) {
    };

};

C.factory(C.Enviroment, 'Loader', function () {
    /* Static variables */
    var _strategies = {};
    var _included = {};
    var _required = {};
    var _dependencies = {};
    var _loaded = {};

    var _scripts = [];
    var _styles = [];

    /**
     * @constructor
     * @returns {C.Enviroment.Loader}
     */
    var __constructor = function (actionAfter, actionBefore, callContext) {
        /*
         * 
         * PROTECTED METHODS
         * 
         */

        var _requireDependencies = function (jsDoc, dependancyStack, dependancyTree) {
            var jsDocRegExp = new RegExp("@(requires|uses)[\s]*([^;]*);", "ig");
            var isArray = C.isArray(jsDoc);
            var isObject = C.isObject(jsDoc);

            if (isArray || isObject) {
                for (var _pi in jsDoc) {

                    if (isArray) {
                        // dependancy is only named and we must load it some time
//                    if (!_dependencies[jsDoc[_pi]]) {
                        _dependencies[jsDoc[_pi]] = true;
                        dependancyStack.push(jsDoc[_pi]);
//                    }
                    } else {
                        // dependancy is named and given a path no need to load
                        if (!_included[_pi]) {
//                        _dependencies[_pi] = true;
                            dependancyTree.push({
                                'require': _pi,
                                'path': jsDoc[_pi]
                            });
                            _included[_pi] = true;
                        }
                    }
                }

                return jsDoc;
            }
            else {
                var _deps = [];
                var jsDocRegExp = new RegExp("@(requires|uses)[\s]*([^;]*);", "ig");

                while (
                        match = jsDocRegExp.exec(jsDoc)
                        ) {
//                if (!_dependencies[match[2].trim()]) {
//                    _dependencies[match[2].trim()] = true;

                    _deps.push(match[2].trim());
                    dependancyStack.push(match[2].trim());
//                }
                }

                return _deps;
            }
        };

        var _activeAjax = 0;
        var _activeRequire = '';

        var _requireStrategy = function (required) {
            for (var _i in _strategies) {
                var _strategy = _strategies[_i];

                var requiredMatch = new RegExp(_strategy.condition, "i");

                if (requiredMatch.test(required)) {
                    var _resolved = _strategy.resolve(required, requiredMatch.exec(required), _strategy);

                    if (_resolved) {
                        return _resolved;
                    }
                }
            }

            return false;
        };

        var _requireScript = function (loadStack, dependancyTree, onRequired) {

            var _self = this;

            if (loadStack.length > 0) {

                // get the next item to load
                // loadStack contains file aliases only
//            console.log(loadStack);

                var loadItem = loadStack.pop();
                var requiredItemName = loadItem;
                var requiredItem = requiredItemName;

                var _resolved = _requireStrategy(requiredItemName);

                if (_resolved['class']) {
                    // override with the real name
                    requiredItem = _resolved['class'];
                }

                // skip required or included classes
                if (_required[requiredItem] || _included[requiredItem]) {
                    console.log('existing:' + requiredItem + ' => ' + _activeAjax + ' file: ' + _activeRequire);
//                C.async(function () {
                    _requireScript(loadStack, dependancyTree, onRequired);
//                });
                    return;
                }

                // this item is now required and we do not need to consider it any more
                _required[requiredItem] = true;

                // if it is not a class then reqire the
                if (!_resolved['class']) {
                    if (C.isArray(_resolved)) {
                        // these are all dependancies if not a file
                        _requireDependencies(_resolved, loadStack, dependancyTree);
                    } else {
//                    console.log(_resolved);
                        var _require = {};
                        _require[requiredItem] = _resolved['path'];
                        _requireDependencies(_require, loadStack, dependancyTree);
                    }
                    _requireScript(loadStack, dependancyTree, onRequired);

                    return;
                }

                // Now load the class file and parse dependancies
                _requirePath(_resolved['path'],
                        function (scriptContent) {
                            // this is now included and we will not consider it any further
                            _included[requiredItem] = true;

                            // get only the @requires /class/ not the script
                            var dependsOn = _requireDependencies(scriptContent, loadStack);

                            // we put here all included items
                            dependancyTree.push({
                                'require': requiredItem,
                                'path': _resolved['path'],
                                'invokable': _resolved
                            });

                            _requireScript(loadStack, dependancyTree, onRequired);
                        },
                        function () {
//                    if (loadStack.length <= 0) {
//                        onRequired();
//                        return;
//                    } else {

//                        return;
//                    }
                        }
                );

                return;
            }

            if (_activeAjax <= 0) {
//            console.log(loadStack);
//            console.log('loaded:');
                onRequired();
                return;
            }
        };

        var _requirePath = function (requiredPath, onRequired, onDone) {
            _activeAjax++;
            _activeRequire = requiredPath;

            var parsed = false;

            var _requiredContent = function (data) {
                if (!parsed) {
                    parsed = true;
                    _activeAjax--;
                    _activeRequire = '';

//                console.log('required:' + requiredPath + ' => ' + _activeAjax);

                    onRequired(data);
                    onDone();
                }
            };

            requiredPath = requiredPath;

//        console.log('require:' + requiredPath + ' => ' + _activeAjax);

            jQuery.ajax({
                'url': requiredPath,
                'method': 'GET',
                'dataType': 'html',
                'success': function (data) {
                    _requiredContent(data);
                },
                'error': function (data) {
                    parsed = true;
                    _activeAjax--;
                    _activeRequire = '';
//                console.log(data);
                }
            });

//        jQuery.get( requiredPath, function(data) {
//            console.log('get:' + requiredPath);
//            _requiredContent(data);
//        })
//        .fail(function(data) {
//            console.log(data);
//    
//            console.log('fail:' + requiredPath);
//            if (data.status && data.status == 200) {
//                _requiredContent(data.responseText);
//            }
//        })
//        .done(function(data) {
//            console.log('done:' + requiredPath);
//            _requiredContent(data);
//        })
//        ;
        };

        var _postOrderScriptRenderer = function (dependancyTree) {
            while (dependancyTree.length > 0) {
                var _dependancy = dependancyTree.pop();

                if (!_scripts[_dependancy['require']]) {
                    _scripts[_dependancy['require']] = _dependancy['path'];
//                console.log("Load: " + _dependancy['path']);
                    $('head').append('<script type="text/javascript" id="' + _dependancy['require'] + '" src="' + _dependancy['path'] + '"></script>');
                } else {
//                console.log("Skipped Script: " + _dependancy['require']);
                }
            }

        };

        /* -------------------------------------------------------------------------- */

        this.addStrategy = function (strategyKey, strategyCondition, strategyResolve, strategyRoot) {
            _strategies[strategyKey] = {
                'enabled': true,
                'condition': strategyCondition,
                'resolve': strategyResolve,
                'root': strategyRoot
            };
        };

        this.nativeInvokableLoaderStrategy = function (invokableClass) {
            // check if it is in the invokables list
            var _resolved = {
                'class': invokableClass,
                'invokable': invokableClass
            };

            // generate now the path
            var pathConfiguration = _resolved['class'].split('.');
            var _filename = '';
            var _directory = '';

            for (var _i = 0; _i < pathConfiguration.length - 1; _i++) {
                _directory += '/' + pathConfiguration[_i];
                if (_i == 0) {
                    _resolved['namespace'] = pathConfiguration[_i];
                }
            }

            _filename = pathConfiguration[pathConfiguration.length - 1];

            _resolved['load'] = {
                'directory': _directory,
                'file': _filename + '.js',
            };
            _resolved['load']['path'] = _resolved['load']['directory'] + '/' + _resolved['load']['file'];
            _resolved['path'] = _resolved['load']['path'];

            return _resolved;
        };

        this.resolve = function (required) {
            return _requireStrategy(required);
        };

        this.load = function (required, callbackDone, callbackError) {
            _activeAjax = 0;

//        console.log('load--');
//        console.log([
//            required,
//            callbackDone
//        ]);

            var loadStack = [];

            if (C.isArray(required)) {
                loadStack = C.clone(required);
            } else {
                loadStack.push(required);
            }

            var dependancyTree = [];

            C.fork(_requireScript, loadStack, dependancyTree, (function (req, dt, cbd) {

                return function () {
                    var requiredItem = dt[0];

                    _postOrderScriptRenderer(dt);

//                console.log('done');
//                console.log([
//                    req,
//                    cbd
//                ]);

                    cbd(requiredItem);
                };

            })(required, dependancyTree, callbackDone));

        };

        this.parse = function (required, callbackDone, callbackError) {
            var loadStack = [required];
            var _this = this;

            _requirePath(required,
                    function (scriptContent) {

                        _requireDependencies(scriptContent, loadStack);

                        C.fork(_this.load, loadStack, callbackDone, callbackError);

                    },
                    function () {

                    }
            );
        };
    };

    __constructor.prototype = new C.Enviroment.Loader();
    __constructor.prototype.constructor = C.Enviroment.Loader;

    return __constructor;

});

C.mode(C.Enviroment, 'Loader', C.MODE_LOCKED);
    return C.Enviroment;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Enviroment'] = factory(C);
}

}());
