ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.ViewInterface = function () {

    this.onRender = new ProtoCore.Enviroment.Event();
    this.onView = new ProtoCore.Enviroment.Event();

    this.setTarget = function (_target) {
    };

    this.getTarget = function () {
    };

    this.setTemplate = function (_tmpl) {
    };

    this.getTemplate = function (_target) {
    };

    this.render = function (_data, _callback) {
    };

};
ProtoCore.mode(ProtoCore.Enviroment, 'ViewInterface', ProtoCore.MODE_LOCKED);

/**
 * @constructor
 * @extends {ProtoCore.Enviroment.ViewInterface}
 */
ProtoCore.Enviroment.View = (function (_undefined_) {
    var _cache = {};
    var _urls = {};
    var _loaded = {};
    
    var _view = {
        render: function (interpreter, data, callback) {
            var parsed = data ? interpreter(data) : interpreter();

            if (callback && callback != _undefined_) {
                callback(parsed, data);
            }
        },
        parse: function (data, template, callback) {
            var _tpl = null;
            var _type = null;
            var _selfMethods = this;
            var _interpreter = null;
            
            if ( ProtoCore.isObject(template) ) {
                _type = 'content';
                
                if (template.html) {
                // as jquery object
                    _tpl = template.html();
                } else {
                // as DOM object
                    _tpl = template.innerHtml;
                }
                
                _interpreter = this.interpret(_tpl);
                
            } else if ( ProtoCore.isFunction(template) ) {
                _type = 'function';
                _tpl = template;
                _interpreter = _tpl;
            } else {
                _type = 'url';
                _tpl = template;
                
                if (_urls[_tpl]) {
                    _interpreter = _urls[_tpl];
                } else {
                    var _requestParams = {};
                    
                    $.get(_tpl, _requestParams, function (content) {
                        _urls[_tpl] = _selfMethods.interpret(content);
                        _selfMethods.render(_urls[_tpl], data, callback);
                    }, 'html');
                    
                    return;
                }
            }
            
            this.render(_interpreter, data, callback);
        },
        /**
         * 
         * @param {String} str
         * @returns {Function}
         */
        interpret: function (str) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                    _cache[str] = _cache[str] ||
                    _tmpl(document.getElementById(str).innerHTML) :
                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached).
                    new Function("obj",
                            "var p=[],print=function(){p.push.apply(p,arguments);};" +
                            // Introduce the data as local variables using with(){}
                            "with(obj){p.push('" +
                            // Convert the template into pure JavaScript
                            str
                            .replace(/[\r\t\n]/g, " ")
//              .split("<%").join("\t")
                            .split("{{").join("\t")
//              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                            .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
                            .replace(/\t=(.*?)\}\}/g, "',$1,'")
                            .split("\t").join("');")
//              .split("%>").join("p.push('")
                            .split("}}").join("p.push('")
                            .split("\r").join("\\'")
                            + "');}return p.join('');");

            // Provide some basic currying to the user
            return fn;
        }
    };

    /**
     * @constructor
     * @extends {ProtoCore.Enviroment.ViewInterface}
     * @returns {ProtoCore.Enviroment.ViewInterface}
     */
    var _constructor = function () {
        var _template = {};
        var $target = null;

        this.setTarget = function (_target) {
            $target = _target;
        };

        this.getTarget = function () {
            return $target;
        };

        this.setTemplate = function (_tmpl) {
            _template = _tmpl;
        };

        this.getTemplate = function () {
            return _template;
        };

        this.render = function (_data) {
            var renderData = new ProtoCore.Enviroment.EventData(_data);
        // notify render
            this.onRender.notify(renderData);            
        };

        this.onRender = new ProtoCore.Enviroment.Event(this, null, 
            /**
             * The default after event procedure
             * 
             * @param {ProtoCore.Enviroment.EventData} e
             * @returns {undefined}
             */
            function (e) {
                _view.parse(e.data(), _instance.getTemplate(), function (parsed) {
                // notify brefore view               
                    _instance.getTarget().html(parsed);
                    
                    e.data('target', _instance.getTarget());
                    
                    _instance.onView.notify(e);
                });
            }
        );
        ProtoCore.mode(this, 'onRender', ProtoCore.MODE_LOCKED);
        
        this.onView = new ProtoCore.Enviroment.Event(this);
        ProtoCore.mode(this, 'onView', ProtoCore.MODE_LOCKED);

        var _instance = this;

    };

    _constructor.prototype = new ProtoCore.Enviroment.ViewInterface();

    return _constructor;
})();

ProtoCore.Enviroment.View.prototype = new ProtoCore.Enviroment.ViewInterface();
ProtoCore.mode(ProtoCore.Enviroment, 'View', ProtoCore.MODE_LOCKED);

/**
 * jQuery protoTemplate
 * @author dzonz
 */
(function (helper, $, _undefined_) {

    var _urlsLoaded = {
    };

    var _templateControllerClass = function ($target, _settings) {

        this.parse = function (data, callback) {
            if (_loaded) {
                var parsed = data ? _template(data) : _template;
                if (_settings.template || _settings.url) {
                    $target.html(parsed);
                }

                if (callback && callback != _undefined_) {
                    callback(parsed);
                }
            } else {
                if (_settings.url) {
                    if (_urls[_settings.url]) {
                        _template = _urls[_settings.url];
                        _loaded = true;
                        _this.parse(data, callback);
                    } else {
                        $.get(_settings.url, function (content) {
                            _template = _tmpl(content);
                            _loaded = true;
                            _urls[_settings.url] = _template;
                            _this.parse(data, callback);
                        }, 'html');
                    }
                }
            }
        };

        var _this = this;
        var _loaded = false;
        var _tpl = null;
        var _template = null;

        this.settings = function (_newSettings) {
            if (_newSettings.url) {
                // load it later
            } else {
                if (typeof (_newSettings.template) == 'object') {
                    if (_newSettings.template.html) {
                        _tpl = _newSettings.template.html();
                    } else {
                        _tpl = _newSettings.template.innerHtml;
                    }
                } else if (_newSettings.template) {
                    // raw html template
                    _tpl = _newSettings.template;
                } else {
                    // this element is the template
                    if (typeof ($target) == 'object') {
                        if ($target.html) {
                            _tpl = $target.html();
                        } else {
                            _tpl = $target.innerHtml;
                        }
                    } else {
                        _tpl = $target;
                    }
                }

                _template = _tmpl(_tpl);
                _loaded = true;
            }
        };

        this.settings(_settings);
    };

    var methods = {
        init: function (options) {
            // this is the instance of the object
            // we are dooing all on that
//            var _settings = $.extend({
//                template:   false,  // HTML Object or Content
//                url:        false  // URL to the Template
//            }, options);
//            
//            return this.each(function() {
//                var $this = $(this);
//                var _data = $this.data('protoTemplate');
//
//            // If the plugin hasn't been initialized yet
//                if ( ! _data ) {
//                // search for elements
//                    var _controller = new _templateControllerClass($this, _settings);
//                	
//                    _data = {
//                        target  : $this,
//                        settings : _settings,
//                        controller : _controller
//                    };
//                } else {
//                    _data = $(this).data('protoTemplate');
//                    _data['settings'] = _settings;
//                    _data['controller'].settings(_settings);
//                }
//                
//                $(this).data('protoTemplate', _data);
//            });
        },
        invoke: function (data, callback) {
//            return this.each(function() {
//                var $this = $(this);
//                var _data = $this.data('protoTemplate');
//
//            // If the plugin hasn't been initialized yet
//                if ( _data ) {
//                // search for elements
//                    var _controller = _data['controller'];
//                        _controller.parse(data, callback);
//                }
//            });
        },
        'instance': function (index) {
//            if (!index) {
//                index = 0;
//            }
//            
//            var $this = $(this.eq(index));
//            var _data = $this.data('protoTemplate');
//
//        // If the plugin hasn't been initialized yet
//            if ( _data ) {
//            // search for elements
//                var _controller = _data['controller'];
//                return _controller;
//            }
//            
//            return null;
        }
    };

    var _cache = {};
    var _urls = {};

    /**
     * 
     * @param {String} str
     * @returns {Function}
     */
    var _tmpl = function (str) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
                _cache[str] = _cache[str] ||
                _tmpl(document.getElementById(str).innerHTML) :
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +
                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +
                        // Convert the template into pure JavaScript
                        str
                        .replace(/[\r\t\n]/g, " ")
//              .split("<%").join("\t")
                        .split("{{").join("\t")
//              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)\}\}/g, "',$1,'")
                        .split("\t").join("');")
//              .split("%>").join("p.push('")
                        .split("}}").join("p.push('")
                        .split("\r").join("\\'")
                        + "');}return p.join('');");

        // Provide some basic currying to the user
        return fn;
    };

    helper.ViewRenderer = function ( ) {
//        if ( methods[method] ) {
//            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
//        } else if ( typeof method === 'object' || ! method ) {
//            return methods.invoke.apply( this, arguments );
//        } else {
        $.error('Method ' + method + ' does not exist on ProtoCore.ViewRenderer');
//        }
    };

})(ProtoCore.helper, jQuery); // pass the jQuery object to this function