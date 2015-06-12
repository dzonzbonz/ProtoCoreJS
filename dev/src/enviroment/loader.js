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