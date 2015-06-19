/**
 * 
 * @constructor
 * @returns {C.Http.Request}
 */
C.Http.Request = function (settings) {
    
    this.getUrl = function () { };
    this.setUrl = function (val) { };
    
    this.encodeContent = function (contentType) {};
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

C.Http.Request.MODE_TEXT = 1;
C.Http.Request.MODE_BINARY = 2;
    
C.Http.Request.METHOD_GET = 'GET';
C.Http.Request.METHOD_POST = 'POST';
    
C.Http.Request.SEND_AS_BINARY = 'BINARY';
C.Http.Request.SEND_AS_RAW = 'RAW';
    
C.Http.Request.TYPE_SYNC = 'sync';
C.Http.Request.TYPE_ASYNC = 'async';
    
C.Http.Request.CONTENT_TYPE_JSON = 'json';
C.Http.Request.CONTENT_TYPE_QUERY = 'query';
C.Http.Request.CONTENT_TYPE_FORM = 'form';
    
C.Http.Request.CHARSET_UTF8 = 'UTF-8';

C.mode(C.Http.Request, [
    "MODE_TEXT", "MODE_BINARY", 
    "METHOD_GET", "METHOD_POST",
    "SEND_AS_BINARY", "SEND_AS_RAW",
    "TYPE_SYNC", "TYPE_SYNC",
    "CONTENT_TYPE_JSON", "CONTENT_TYPE_JSON", "CONTENT_TYPE_FORM",
    "CHARSET_UTF8"
], C.MODE_LOCKED);

C.factory(C.Http, 'Request', function () {
    var pack = {
        multipartFormData : function (data, key, level, boundary) {
            var boundary = C.isDefined(boundary) ? boundary : C.guid(4);
                level = C.isDefined(level) ? level : 1;
            var content = '';
            var self = this;
            
            C.traverse(data, function (dataKey, dataValue) {
                var finalKey = (C.isDefined(key) && key != null)
                            ? key + '[' + dataKey + ']'
                            : dataKey;
                            
                content += (C.isObject(dataValue) || C.isArray(dataValue))
                        ? self.multipartFormData(dataValue, finalKey, level + 1, boundary)
                        : "--"  + boundary
                                + "\r\nContent-Disposition: form-data; name=" + finalKey
                                + "\r\nContent-type: application/octet-stream"
                                + "\r\n\r\n" + dataValue + "\r\n";
                
            });
            
            if (level == 1) {
                content += "--"+boundary+"--\r\n";
            }
            
            return content;
        },
        xWwwFormUrlEncoded: function (data, key, level) {
            level = C.isDefined(level) ? level : 1;
            
            var query = '';
            var self = this;
            
            C.traverse(data, function (dataKey, dataValue) {
                var finalKey = (C.isDefined(key) && key != null)
                            ? key + '[' + dataKey + ']'
                            : dataKey;
                            
                query += (C.isObject(dataValue) || C.isArray(dataValue))
                      ? self.xWwwFormUrlEncoded(dataValue, finalKey, level + 1)
                      : (level === 1 && query.length === 0 ? '' : "&") + encodeURIComponent(finalKey) + '=' + encodeURIComponent(dataValue);
            });
            
            return query;
        },
        applicationJson: function (data) {
            return JSON.stringify(data);
        }
    };
    
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
        
        this.encodeContent = function (contentType) {
            switch (contentType) {
                case self.CONTENT_TYPE_FORM:
                    return pack.multipartFormData(this.data());
                    break;
                case self.CONTENT_TYPE_QUERY:
                    return pack.xWwwFormUrlEncoded(this.data());
                    break;
                case self.CONTENT_TYPE_JSON:
                    return pack.applicationJson(this.data());
                    break;
                default:
                    break;
            }
            
            return null;
        };
        
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
            
            C.traverse(val, function (sendHeaderName, sendHeaderValue) {
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
            C.traverse(settings, function (key, value) {
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
    };
    
    __constructor.prototype = new C.Http.Request();
    __constructor.prototype.constructor = C.Http.Request;
    
    return __constructor;
}, C.MODE_LOCKED);