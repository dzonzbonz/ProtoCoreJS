/** @license
 * protocore-js <https://github.com/dzonzbonz/ProtoCoreJS>
 * Author: Nikola Ivanovic - Dzonz Bonz | MIT License
 * v0.0.1 (2015/07/06 14:50)
 */

(function () {
var factory = function (C) {
    C.Http = {};
    C.namespace(C.Http, 'C.Http');
/**
 * @constructor
 * @param {String} filename
 * @param {C.Enviroment.Request} request
 * 
 * @returns {C.Http.FileInterface}
 */
C.Http.Data = function () {

    this.toString = function () { };
    this.fromString = function (jsonToParse) {};

    this.toQuery = function () { };
    this.fromQuery = function (stringToParse) {};

    this.toStream = function () { };
    this.fromStream = function (stringToParse) { };
    
};

C.Http.Data.prototype = new C.Enviroment.Object();
C.Http.Data.prototype.constructor = C.Http.Data;

C.factory(C.Http, 'Data', function () {
    var decode = {
        'xWwwFormUrlEncoded': function (str) {
            var strArr = String(str)
                    .replace(/^&/, '')
                    .replace(/&$/, '')
                    .split('&'),
                    sal = strArr.length,
                    i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
                    postLeftBracketPos, keys, keysLen,
                    fixStr = function (str) {
                        return decodeURIComponent(str.replace(/\+/g, '%20'));
                    },
                    decoded = {};

            for (i = 0; i < sal; i++) {
                tmp = strArr[i].split('=');
                key = fixStr(tmp[0]);
                value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

                while (key.charAt(0) === ' ') {
                    key = key.slice(1);
                }
                if (key.indexOf('\x00') > -1) {
                    key = key.slice(0, key.indexOf('\x00'));
                }
                if (key && key.charAt(0) !== '[') {
                    keys = [];
                    postLeftBracketPos = 0;
                    for (j = 0; j < key.length; j++) {
                        if (key.charAt(j) === '[' && !postLeftBracketPos) {
                            postLeftBracketPos = j + 1;
                        } else if (key.charAt(j) === ']') {
                            if (postLeftBracketPos) {
                                if (!keys.length) {
                                    keys.push(key.slice(0, postLeftBracketPos - 1));
                                }
                                keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                                postLeftBracketPos = 0;
                                if (key.charAt(j + 1) !== '[') {
                                    break;
                                }
                            }
                        }
                    }
                    if (!keys.length) {
                        keys = [key];
                    }
                    for (j = 0; j < keys[0].length; j++) {
                        chr = keys[0].charAt(j);
                        if (chr === ' ' || chr === '.' || chr === '[') {
                            keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                        }
                        if (chr === '[') {
                            break;
                        }
                    }

                    obj = decoded;
                    for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                        key = keys[j].replace(/^['"]/, '')
                                .replace(/['"]$/, '');
                        lastIter = j !== keys.length - 1;
                        lastObj = obj;
                        if ((key !== '' && key !== ' ') || j === 0) {
                            if (obj[key] === undef) {
                                obj[key] = {};
                            }
                            obj = obj[key];
                        } else { // To insert new dimension
                            ct = -1;
                            for (p in obj) {
                                if (obj.hasOwnProperty(p)) {
                                    if (+p > ct && p.match(/^\d+$/g)) {
                                        ct = +p;
                                    }
                                }
                            }
                            key = ct + 1;
                        }
                    }
                    lastObj[key] = value;
                }
            }
            
            return decoded;
        },
        'applicationJson': function (data) {
            return JSON.parse(data);
        }
    };
    var encode = {
        'multipartFormData' : function (data, key, level, boundary) {
            var boundary = C.isDefined(boundary) ? boundary : C.guid(4);
                level = C.isDefined(level) ? level : 1;
            var content = '';
            var self = this;
            
            C.each(data, function (dataKey, dataValue) {
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
        'xWwwFormUrlEncoded': function (data, key, level) {
            level = C.isDefined(level) ? level : 1;
            
            var query = '';
            var self = this;
            
            C.each(data, function (dataKey, dataValue) {
                var finalKey = (C.isDefined(key) && key != null)
                            ? key + '[' + dataKey + ']'
                            : dataKey;
                        
                query += (C.isObject(dataValue) || C.isArray(dataValue))
                      ? self.xWwwFormUrlEncoded(dataValue, finalKey, level + 1)
                      : (level === 1 && query.length === 0 ? '' : "&") + encodeURIComponent(finalKey) + '=' + encodeURIComponent(dataValue);
            });
            
            return query;
        },
        'applicationJson': function (data) {
            return JSON.stringify(data);
        }
    };
    
    var __constructor = function () {
        /* Inheritance */
        var parent = new C.Enviroment.Object();
            C.extend(this, parent);
        
        /* Implementation */
        this.toString = function () {
            return encode.applicationJson(this.data());
        };
        this.fromString = function (jsonToParse) {
            this.data(decode.applicationJson(jsonToParse));
        };

        this.toQuery = function () {
            return encode.xWwwFormUrlEncoded(this.data());
        };
        this.fromQuery = function (stringToParse) {
            this.data(decode.xWwwFormUrlEncoded(stringToParse));
        };

        this.toStream = function () {
            return encode.multipartFormData(this.data());
        };
        this.fromStream = function (stringToParse) {
            
        };
    };

    __constructor.prototype = new C.Http.Data();
    __constructor.prototype.constructor = C.Http.Data;

    return __constructor;
});
/**
 * @constructor
 * @param {String} filename
 * @param {C.Enviroment.Request} request
 * 
 * @returns {C.Http.FileInterface}
 */
C.Http.Uri = function (uri) {

    this.parse = function (uriToParse) { };

    this.toJSON = function () { };

    this.build = function () { };
};

C.factory(C.Http, 'Uri', function () {
    
    var decode = {
        'anchor': function (uriToParse) {
            var parser = document.createElement('a');
            parser.href = uriToParse;
            return parser;
        },
        'url':
        /**
         * 
         * @param {String} str
         * @param {String} component
         * @returns {Object} {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
         */
        function (str, mode, component) {
            var
                    query,
                    key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                        'relative', 'path', 'directory', 'file', 'query', 'hash'
                    ],
                    mode = C.isDefined(mode) ? mode : 'php',
                    parser = {
                        php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
                    };

            var m = parser[mode].exec(str),
                    uri = {},
                    i = 14;

            while (i--) {
                if (m[i]) {
                    uri[key[i]] = m[i];
                }
            }

            if (component) {
                return uri[component.toLowerCase()];
            }

            var name = 'queryData';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name] = {};
            query = uri[key[12]] || '';
            query.replace(parser, function ($0, $1, $2) {
                if ($1) {
                    uri[name][$1] = $2;
                }
            });

            delete uri.source;
            return uri;
        },
        'query': function () {

        }
    };
    
    function /**C.Http.Uri**/ C_Http_Uri(uriToParse) {
        /* Variables */
        var uriProtocol = '';
        var uriHostName = '';
        var uriPort = '';
        var uriPathName = '';
        var uriQuery = '';
        var uriQueryData = new C.Http.Data();
        var uriHash = '';
        
        /* Implementation */
        this.parse = function (uriToParse) {
            var parser = decode.url(uriToParse);

            uriProtocol = C.isDefined(parser.protocol) ? parser.protocol : '';
            uriHostName = C.isDefined(parser.host) ? parser.host : '';
            uriPort = C.isDefined(parser.port) ? parser.port : '';
            uriPathName = C.isDefined(parser.path) ? parser.path : '';
            uriQuery = C.isDefined(parser.query) ? parser.query : '';
            uriQueryData.fromQuery(uriQuery);
            uriHash = C.isDefined(parser.hash) ? parser.hash : '';

            return this;
        };

        this.toJSON = function () {
            return {
                protocol: uriProtocol,
                host: uriHostName,
                port: uriPort,
                path: uriPathName,
                query: uriQuery,
                data: uriQueryData.data(),
                hash: uriHash
            };
        };

        this.build = function () {
            var q = uriQueryData.toQuery();
            return uriProtocol + '//'
                    + uriHostName
                    + (uriPort.length > 0 ? ':' + uriPort : '')
                    + (uriPathName.length > 0 ? '/' + uriPathName : '')
                    + (q.length > 0 ? '?' + q : '')
                    + (uriHash.length > 0 ? '#' + uriHash : '');
        };

        if (C.isDefined(uriToParse)) {
            this.parse(uriToParse);
        }
    };

    C_Http_Uri.prototype = new C.Http.Uri();
    C_Http_Uri.prototype.constructor = C.Http.Uri;

    return C_Http_Uri;
});
/**
 * 
 * @constructor
 * @returns {C.Http.Response}
 */
C.Http.Response = function () {
    
    this.getHandle = function () { };
    this.setHandle = function (val) { };
    
    this.getState = function () {};
    this.setState = function (val) {};
    
    this.isError = function (val) {};
    this.isSuccess = function (val) {};
    this.isDone = function (val) {};
    
    this.getHeaders = function () { };
    this.getResponse = function () { };
};

C.Http.Response.prototype = new C.Enviroment.EventData();
C.Http.Response.prototype.constructor = C.Http.Response;

C.factory(C.Http, 'Response', function () {
    var func = function(value) {
        return value.substring(1) !== '';
    };
    function trim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }

    var __constructor = function () {
    /* Variables */
        var state = 0;
        var handle = null;
        
    /* Inheritance */
        var parent = new C.Enviroment.EventData();
        C.extend(this, parent);
        
    /* Implementation */
        this.getState = function () { return this.data('state'); };
        this.setState = function (val) { this.data('state', val); return this; };
        
        this.getHandle = function () { return handle; };
        this.setHandle = function (val) { 
            handle = val; return this; 
        };
        
        this.getHeaders = function () {
            var responseHeadersRaw = handle.getAllResponseHeaders();
            var responseHeaders = {};
            if (responseHeadersRaw) {
                responseHeadersRaw = responseHeadersRaw.split('\n');
                for (var k = 0; k < responseHeadersRaw.length; k++) {
                    if (func(responseHeadersRaw[k])) {
                        
                        var breakPos = responseHeadersRaw[k].search(/:\s*/);
                        var sendHeaderName = responseHeadersRaw[k].substring(0, breakPos);
                        var sendHeaderValue = responseHeadersRaw[k].substring(breakPos + 1);
                        
//                        responseHeaders[sendHeaderName.trim()] = sendHeaderValue.trim();
                        responseHeaders[trim(sendHeaderName)] = trim(sendHeaderValue);
                    }
                }
            }
            
            return responseHeaders;
        };
        
        this.getResponse = function () {
            return this.data('response');
        };
        
        this.isDone = function () {
            var state = this.getState();
            return state === 4;
        };
        
        this.isError = function () {
            return !this.isSuccess();
        };
        
        this.isSuccess = function () {
            var status = this.data('status');
            var state = this.getState();
            return state === 4 && status >= 200 && status < 400;
        };
        
        var self = this;
    };
    
    __constructor.prototype = new C.Http.Response();
    __constructor.prototype.constructor = C.Http.Response;
    
    return __constructor;
}, C.MODE_LOCKED);
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
/**
 * @constructor
 * @param {String} filename
 * @param {C.Enviroment.Request} request
 * 
 * @returns {C.Http.ClientInterface}
 */
C.Http.ClientInterface = function (request) {

    this.base = function () {
    };

    this.dir = function () {
    };

    this.request = function (file) {
        
    };

    this.info = function () {
    };
    
    this.write = function () {
        
    };
};

C.Http.Client = new C.Http.ClientInterface();

C.factory(C.Http.Client, function () {
    
    var func = function(value) {
        return value.substring(1) !== '';
    };

    this.base = function (path, suffix) {

        var somePath = path;
        var lastChar = somePath.charAt(somePath.length - 1);

        if (lastChar === '/' || lastChar === '\\') {
            somePath = somePath.slice(0, -1);
        }

        somePath = somePath.replace(/^.*[\/\\]/g, '');

        if (typeof suffix === 'string' && somePath.substr(somePath.length - suffix.length) == suffix) {
            somePath = somePath.substr(0, somePath.length - suffix.length);
        }

        return somePath;
    };
    
    this.dir = function (path) {
        return path.replace(/\\/g, '/')
                .replace(/\/[^\/]*\/?$/, '');
    };

    /**
     * 
     * @param {C.Http.Request} r
     * @returns {String}
     */
    this.request = function (r) {
        var url = r.getUrl();
        
        var req = window.ActiveXObject 
                ? new ActiveXObject('Microsoft.XMLHTTP') 
                : new XMLHttpRequest();
                
        if (!req) {
            throw new Error('XMLHttpRequest not supported');
        }
        
        if (r.getBypassCache()) {
            url += (url.match(/\?/) == null ? '?' : '&') 
                + (new Date()).getTime(); 
            // Give optional means of forcing bypass of cache
        }
                
        var response = new C.Http.Response();
            response.setHandle(req);
            
        var handle = req.open(r.getMethod(), url, r.getType() == r.TYPE_ASYNC);

        if (r.getType() == r.TYPE_ASYNC) {
            // Fix: make work with req.addEventListener if available: https://developer.mozilla.org/En/Using_XMLHttpRequest
            if (0 && req.addEventListener) { // Unimplemented so don't allow to get here
                /*
                 req.addEventListener('progress', updateProgress, false);
                 req.addEventListener('load', transferComplete, false);
                 req.addEventListener('error', transferFailed, false);
                 req.addEventListener('abort', transferCanceled, false);
                 */
            } else {
                req.onreadystatechange = function (aEvt) { // aEvt has stopPropagation(), preventDefault(); see https://developer.mozilla.org/en/NsIDOMEvent
                    // Other XMLHttpRequest properties: multipart, responseXML, status, statusText, upload, withCredentials
                    response.data({
                        state: req.readyState,
                        response: req.responseText,
                        responseXML: req.responseXML,
                        status: req.status,
                        statusText: req.statusText,
                        bytes: 0,
                        event: aEvt
                    });
                    // notification args: notification_code, severity, message, message_code, bytes_transferred, bytes_max (all int's except string 'message')
                    // Need to add message, etc.
//                        var bytes_transferred;
                    switch (req.readyState) {
                        case 0: // UNINITIALIZED 
                            break;
                        case 1: // LOADING 
                            break;
                        case 2: // LOADED 
                            break;
                        case 3: // INTERACTIVE 
                            // One character is two bytes
                            response.data('bytes', req.responseText.length * 2);
                            break;
                        case 4: // COMPLETED
                            if (req.status >= 200 && req.status < 400) {
                                response.data('bytes', req.responseText.length * 2);
                            }
                            else if (req.status === 403) { // Fix: These two are finished except for message
                            }
                            else { // Errors
                            }
                            break;
                        default:
                    }

                    r.onResponse.notify(response);
                };
            }
        }
        
        C.each(r.getHeaders(), function (sendHeaderName, sendHeaderValue) {
            req.setRequestHeader(sendHeaderName, sendHeaderValue);
        });
        
        var content_type = r.getHeader('content-type');
        var charset = r.getCharset();
        var content = r.getContent();
        
        if (C.flaged(r.MODE_TEXT)) { // Overrides how encoding is treated (regardless of what is returned from the server)
            if (!content_type) {
                content_type = 'text/html';
            }
            
            if (!charset) {
                charset = r.CHARSET_UTF8;
            }
            
            if (!(/;\s*charset=/).test(content_type)) { 
            // If no encoding
                content_type += '; charset=' + charset;
            }
            
            req.overrideMimeType(content_type);
        }
        // Default is FILE_BINARY, but for binary, we apparently deviate from PHP in requiring the flag, since many if not
        //     most people will also want a way to have it be auto-converted into native JavaScript text instead
        else if (C.flaged(r.MODE_BINARY)) { // Trick at https://developer.mozilla.org/En/Using_XMLHttpRequest to get binary
            req.overrideMimeType('text/plain; charset=x-user-defined');
            // Getting an individual byte then requires:
            // responseText.charCodeAt(x) & 0xFF; // throw away high-order byte (f7) where x is 0 to responseText.length-1 (see notes in our substr())
        }
        
        try {
            if (r.getSendAs() == r.SEND_AS_BINARY) { // For content sent in a POST or PUT request (use with file_put_contents()?)
                req.sendAsBinary(content); // In Firefox, only available FF3+
            } else {
                req.send(content);
            }
        } catch (e) {
            // catches exception reported in issue #66
            response.data({
                state: req.readyState,
                response: req.responseText,
                responseXML: req.responseXML,
                status: req.status,
                statusText: req.statusText,
                bytes: 0,
                error: e
            });
            r.onResponse.notify(response);
            return false;
        }
        
        var responseHeadersRaw = req.getAllResponseHeaders();
        var responseHeaders = [];
        if (responseHeadersRaw) {
            responseHeadersRaw = responseHeadersRaw.split('\n');
            for (var k = 0; k < responseHeadersRaw.length; k++) {
                if (func(responseHeadersRaw[k])) {
                    responseHeaders.push(responseHeadersRaw[k]);
                }
            }
        }

        if (r.getType() !== r.TYPE_ASYNC) {
            response.data({
                state: req.readyState,
                response: req.responseText,
                responseXML: req.responseXML,
                status: req.status,
                statusText: req.statusText,
                bytes: req.responseText.length * 2
            });
            r.onResponse.notify(response);
        }
        
        return true;
    };
    
    var self = this;
});
    return C.Http;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Http'] = factory(C);
}

}());
