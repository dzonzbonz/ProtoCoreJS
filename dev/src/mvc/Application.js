ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.ApplicationInterface = function () {

    this.onInit = new ProtoCore.Enviroment.Event();
    this.onDispatch = new ProtoCore.Enviroment.Event();
    
    this.setModuleList = function (moduleList) {
    };

    this.getModuleList = function () {
    };

    this.init = function () {
    };

    this.invokableStrategy = function (invokableClass) {
    };

    this.requireStrategy = function (requiredClass) {
//        for (var _i in _modules) {
//            var _namespace = _modules[_i];
//
//            var _resolvedPath = null;
//            eval('_resolvedPath = ' + _namespace + '.Module.requireStrategy("' + requiredClass + '");');
//
//            if (_resolvedPath) {
//                return _resolvedPath;
//            }
//        }

        return false;
    };

    this.routeStrategy = function () {
    };

    this.layoutStrategy = function () {
    };

    this.dispatch = function ($appTarget) {
    };

    this.getHostURL = function ( ) {
    };

    this.getRequestURL = function () {
    };

    this.redirect = function (url) {
    };

    this.getRequest = function () {
    };

};

ProtoCore.Enviroment.ApplicationInterface.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.mode(ProtoCore.Enviroment, 'ApplicationInterface', ProtoCore.MODE_LOCKED);

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 */
ProtoCore.Enviroment.Application = (function () {

    var _modules = [];
    var _request = {};
    var _layout = {};
    var _target = null;

    /**
     * @constructor
     * @extends {ProtoCore.Enviroment.ViewInterface}
     * @returns {ProtoCore.Enviroment.ViewInterface}
     */
    var _constructor = function () {

        ProtoCore.extend(this, new ProtoCore.Enviroment.Object());

        this.setModuleList = function (moduleList) {
            _modules = moduleList;
        };

        this.getModuleList = function () {
            return ProtoCore.clone(_modules);
        };

        this.init = function () {
            
        // load all modules
            var moduleStack = [];
            for (var ind in _modules) {
                moduleStack.push(_modules[ind] + '.Module');
            }
            
            ProtoCore.Enviroment.Loader.load(moduleStack, function () {
                
                var onInitData = new ProtoCore.Enviroment.EventData({});
                
                _this.onInit.notify(onInitData);
                
            });
        };

        this.routeStrategy = function (requestUrl) {
            
            _request = ProtoCore.Enviroment.Router.resolve(requestUrl);

            return _request;
        };

        this.layoutStrategy = function (resolvedRequest, resolvedLayout, onDone) {
            if (resolvedLayout) {
                _layout = resolvedLayout;
            }
            else {
                _layout = {
                    'template': '/module/Application/Layout/layout.phtml'
                };
            }
            
        // resolve it automaticaly by module
            if (!resolvedLayout && resolvedRequest && resolvedRequest.module) {
                eval('_layout = ' + resolvedRequest.module + '.Module.layoutStrategy(resolvedRequest, _layout);');
            }
            
        // load the resolved controller
            ProtoCore.Enviroment.Loader.load(resolvedRequest.controller, function () {   
            // resolve it
                var _controllerInvokable = ProtoCore.Enviroment.Loader.resolve(resolvedRequest.controller);

            // instantiate it
                var _controllerInstance = ProtoCore.instantiate(_controllerInvokable['class']);
//                    _controllerInstance.invoke();
                    
            // get the layout from controller
                if (!resolvedLayout) {
                    _layout = _controllerInstance.layoutStrategy(resolvedRequest, _layout);
                }

                onDone.call(this, 
                    _controllerInstance, 
                    ProtoCore.clone(_controllerInvokable), 
                    ProtoCore.clone(resolvedRequest), 
                    ProtoCore.clone(_layout)
                );
            });
            
            return _layout;
        };

//        this.dispatchStrategy = function () {
//            var _request = this.getRequest();
//
//            if (_request && _request.module) {
//                eval(_request.module + '.Module.dispatchStrategy();');
//            }
//        };

        this.dispatch = function ($appTarget, requestUrl, resolvedLayout) {
            var _self = this;
            _target = $appTarget;
        
        // resolve the request to Module-Controller-Params
            var resolvedRequest = this.routeStrategy(requestUrl ? requestUrl : this.getRequestURL());
            
        // resolve the layout
            _layout = this.layoutStrategy(resolvedRequest, resolvedLayout, 
            /**
             * 
             * @param {Object} _resolvedRequest
             * @param {Object} _resolvedLayout
             * @returns {undefined}
             */
            function (resolvedControllerInstance, resolvedControllerClass, _resolvedRequest, _resolvedLayout) {
            // now parse the layout
                var _view = new ProtoCore.Enviroment.View();
                    _view.setTarget($appTarget);
                    _view.setTemplate(_resolvedLayout.template);

                    _view.onView.subscribe(function (e) {
                    // prepare the layout before dispatching inner content
                        resolvedControllerInstance.dispatchStrategy($appTarget, _resolvedRequest, _resolvedLayout);
                    
                    // dispatch all elements within this target
                        var _syncControlDispatch = function (_sync) {
                            ProtoCore.Enviroment.Dispatcher.dispatch($appTarget.find('*[core-dispatch]'), null, _resolvedRequest, _sync);
                        };
                        
                    // we should check for a route specific controller
                    // dispatch the controller
                        var _syncControlerDispatch = function (_sync) {
                            ProtoCore.Enviroment.Dispatcher.dispatch($appTarget, _resolvedRequest.controller, _resolvedRequest, _sync);
                        };
                    
                    // dispatch the main layout with selected controller
                        var _syncOnDispatch = function (_sync) {
                            _this.onDispatch.notify(new ProtoCore.Enviroment.EventData({
                                'application': _this,
                                'target': $appTarget
                            }));
                            
                            _sync();
                        };

                        ProtoCore.sync([
                            _syncControlDispatch,
                            _syncControlerDispatch,
                            _syncOnDispatch
                        ], function () {
                            
                        });
                        
                    });
                    
                    _view.render();
            });
            
        // load it safely
//            _this.getRequest();
////            console.log('resolve: ' + request.controller);
////            var _response = function () {
////                
////            };
//            ProtoCore.Enviroment.Loader.load(resolvedRequest.controller, function () {   
//            // resolve it
//                var _controllerInvokable = ProtoCore.Enviroment.Loader.resolve(resolvedRequest.controller);
////                console.log('resolved: ' + request.controller);
////                console.log(_controllerInvokable);
//                
//            // instantiate it
//                var _controllerInstance = ProtoCore.instantiate(_controllerInvokable['class']);
////                    _controllerInstance.invoke();
//                    
//            // get the layout from controller
//                _layout = _controllerInstance.layoutStrategy(_layout);
//                
//            // now parse the layout
//                var _view = new ProtoCore.Enviroment.View();
//                    _view.setTarget($appTarget);
//                    _view.setTemplate(_layout.template);
//
//                    _view.onView.subscribe(function (e) {
//                    // prepare the layout before dispatching inner content
//                        _controllerInstance.dispatchStrategy($appTarget, resolvedRequest);
//                        
//                    // we should check for a route specific controller
//                    // and dispatch the controller
//                    // dispatch all elements within this app
//                        ProtoCore.Enviroment.Dispatcher.dispatch($appTarget.find('*[core-dispatch]'));
//
//                    // dispatch the main layout with selected controller
////                        _controllerInstance.dispatch($appTarget);
//                        ProtoCore.Enviroment.Dispatcher.dispatch($appTarget, resolvedRequest.controller);
//
//                        _this.onDispatch.notify(new ProtoCore.Enviroment.EventData({
//                            'application': this,
//                            'target': $appTarget
//                        }));
//                    });
//                    
//                    _view.render();
//            });
        
        // display layout first
//            var _view = new ProtoCore.Enviroment.View();
//                _view.setTarget($appTarget);
//                _view.setTemplate(_layout.template);
//            
//            _view.onView.subscribe(function (e) {
//            // we should check for a route specific controller
//            // and dispatch the controller
//                var request = _this.getRequest();
//                console.log('view');
//                ProtoCore.Enviroment.Loader.load(request.controller, function () {   
//                // dispatch all elements within this app
//                    ProtoCore.Enviroment.Dispatcher.dispatch($appTarget.find('*[core-dispatch]'));
//                    
//                // dispatch the main layout with selected controller
//                    ProtoCore.Enviroment.Dispatcher.dispatch($appTarget, request.controller);
//                    
//                    _this.onDispatch.notify(new ProtoCore.Enviroment.EventData({
//                        'application': this,
//                        'target': $appTarget
//                    }));
//                    
//                });
//            });
//            
//            _view.render();
        };

        this.getHostURL = function ( ) {
            return window.location.href;
        };

        this.getRequestURL = function () {
            var hash = '';

            if (window.location.hash) {
                hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
            }

            return hash;
        };

        this.getRequest = function () {
            return ProtoCore.clone(_request);
        };
        
        this.redirect = function (url) {
            window.location = url;
        };
        
/* EVENTS */
    // onInit
        this.onInit = new ProtoCore.Enviroment.Event(this, null, function () {
            
        });
        ProtoCore.mode(this, 'onInit', ProtoCore.MODE_LOCKED);
        
    // onDispatch    
        this.onDispatch = new ProtoCore.Enviroment.Event(this, null, function () {

        });
        ProtoCore.mode(this, 'onDispatch', ProtoCore.MODE_LOCKED);
        
        var _this = this;
    };

    _constructor.prototype = new ProtoCore.Enviroment.ApplicationInterface();

    return _constructor;
})();

ProtoCore.Enviroment.Application.prototype = new ProtoCore.Enviroment.ApplicationInterface();
ProtoCore.Enviroment.Application.prototype.constructor = ProtoCore.Enviroment.Application;
ProtoCore.register('ProtoCore.Enviroment.Application', ProtoCore.Enviroment.Application);
ProtoCore.mode(ProtoCore.Enviroment, 'Application', ProtoCore.MODE_LOCKED);