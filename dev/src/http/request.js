/**
 * 
 * @constructor
 * @returns {C.Http.Request}
 */
C.Http.Request = function (settings) {
//    this.MODE_TEXT = 1;
//    this.MODE_BINARY = 2;
//    
//    this.METHOD_GET = 'GET';
//    this.METHOD_POST = 'POST';
//    
//    this.SEND_AS_BINARY = 'BINARY';
//    this.SEND_AS_RAW = 'RAW';
//    
//    this.TYPE_SYNC = 'sync';
//    this.TYPE_ASYNC = 'async';
//    
//    this.CONTENT_TYPE_JSON = 'json';
//    this.CONTENT_TYPE_QUERY = 'query';
//    this.CONTENT_TYPE_FORM = 'form';
//    
//    this.CHARSET_UTF8 = 'UTF-8';
    
    this.getUrl = function () { };
    this.setUrl = function (val) { };
    
    this.getContent = function () { };
    this.setContent = function (val) { };
    
    this.getCharset = function () { };
    this.setCharset = function (val) { };
    
    this.getHeaders = function () { };
    this.setHeaders = function (val) { };
    
    this.getHeader = function (key) { };
    this.setHeader = function (key, val) { };
    
    this.getMethod = function () { };
    this.setMethod = function (val) { };
    
    this.getMode = function () { };
    this.setMode = function (val) { };
    
    this.getSendAs = function () { };
    this.setSendAs = function (val) { };
    
    this.getType = function () { };
    this.setType = function (val) { };
    
    this.getBypassCache = function () { };
    this.setBypassCache = function (val) { };
    
    this.onResponse = new C.Http.Response();
};

C.Http.Request.prototype = new C.Enviroment.Object();
C.Http.Request.prototype.constructor = C.Http.Request;

C.Http.Request.prototype.MODE_TEXT = 1;
C.Http.Request.prototype.MODE_BINARY = 2;
    
C.Http.Request.prototype.METHOD_GET = 'GET';
C.Http.Request.prototype.METHOD_POST = 'POST';
    
C.Http.Request.prototype.SEND_AS_BINARY = 'BINARY';
C.Http.Request.prototype.SEND_AS_RAW = 'RAW';
    
C.Http.Request.prototype.TYPE_SYNC = 'sync';
C.Http.Request.prototype.TYPE_ASYNC = 'async';
    
C.Http.Request.prototype.CHARSET_UTF8 = 'UTF-8';

C.mode(C.Http.Request.prototype, [
    "MODE_TEXT", "MODE_BINARY", 
    "METHOD_GET", "METHOD_POST",
    "SEND_AS_BINARY", "SEND_AS_RAW",
    "TYPE_SYNC", "TYPE_SYNC",
    "CHARSET_UTF8"
], C.MODE_LOCKED);

C.factory(C.Http, 'Request', function () {
    
    var __constructor = function (settings) {
    /* Variables */
        var url = '';
        var charset = this.CHARSET_UTF8;
        var content = null;
        var sendAs = this.SEND_AS_RAW;
        
        var headers = {};
        var method = this.METHOD_GET;
        var mode = this.MODE_TEXT;
        var type = this.TYPE_ASYNC;
        
        var bypassCache = false;
        
    /* Inheritance */
        var parent = new C.Enviroment.Object();
        C.extend(this, parent);
        
    /* Implementation */
        this.getUrl = function () { return url; };
        this.setUrl = function (val) { url = val; return this; };
        
        this.getContent = function () {
            return content;
        };
        this.setContent = function (val) { 
            content = val;
            return this;
        };
    
        this.getCharset = function () {
            return charset;
        };
        this.setCharset = function (val) { 
            charset = val;
            return this;
        };
        
        
        this.getSendAs = function () {
            return sendAs;
        };
        this.setSendAs = function (val) {
            sendAs = val;
            return this;
        };
    
        this.getHeaders = function () {
            return headers;
        };
        this.setHeaders = function (val) {
            var isArray = C.isArray(val);
            
            C.each(val, function (sendHeaderName, sendHeaderValue) {
                if (isArray) {
                    self.setHeader(sendHeaderValue);
                }
                else {
                    self.setHeader(sendHeaderName, sendHeaderValue);
                }
            });
            
            return this;
        };

        this.getHeader = function (key) {
            return headers[key.toLowerCase()];
        };
        this.setHeader = function (key, val) {
            if (!C.isDefined(val)) {
                var breakPos = key.search(/:\s*/);
                var sendHeaderName = key.substring(0, breakPos);
                var sendHeaderValue = key.substring(breakPos + 1);
                
                this.setHeader(sendHeaderName.trim(), sendHeaderValue.trim());
            }
            else {
                headers[key.toLowerCase()] = val;
            }
            
            return this;
        };
        
        this.getMethod = function () { return method; };
        this.setMethod = function (val) { method = val; return this; };

        this.getMode = function () { return mode; };
        this.setMode = function (val) { mode = val; return this; };

        this.getType = function () { return type; };
        this.setType = function (val) { type = val; return this; };

        this.getBypassCache = function () { return bypassCache; };
        this.setBypassCache = function (val) { bypassCache = val; return this; };

        this.onResponse = new C.Enviroment.Event();

        var self = this;

        if (C.isDefined(settings)) {
            C.each(settings, function (key, value) {
                switch (key) {
                    case 'method':
                        self.setMethod(value);
                        break;
                    case 'mode':
                        self.setMode(value);
                        break;
                    case 'type':
                        self.setType(value);
                        break;
                    case 'bypassCache':
                        self.setBypassCache(value);
                        break;
                }
            });
        }
        
        C.mode(this, [ "onResponse" ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Http.Request();
    __constructor.prototype.constructor = C.Http.Request;
    
    return __constructor;
}, C.MODE_LOCKED);