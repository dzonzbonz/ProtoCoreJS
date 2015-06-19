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
        
        C.traverse(r.getHeaders(), function (sendHeaderName, sendHeaderValue) {
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