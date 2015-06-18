/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {String} filename
 * @param {C.Enviroment.Request} readParams
 * 
 * @returns {C.Enviroment.File}
 */
C.Http.ClientInterface = function (filename, readParams) {

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
                    /*
                     PHP Constants:
                     STREAM_NOTIFY_RESOLVE   1       A remote address required for this stream has been resolved, or the resolution failed. See severity  for an indication of which happened.
                     STREAM_NOTIFY_CONNECT   2     A connection with an external resource has been established.
                     STREAM_NOTIFY_AUTH_REQUIRED 3     Additional authorization is required to access the specified resource. Typical issued with severity level of STREAM_NOTIFY_SEVERITY_ERR.
                     STREAM_NOTIFY_MIME_TYPE_IS  4     The mime-type of resource has been identified, refer to message for a description of the discovered type.
                     STREAM_NOTIFY_FILE_SIZE_IS  5     The size of the resource has been discovered.
                     STREAM_NOTIFY_REDIRECTED    6     The external resource has redirected the stream to an alternate location. Refer to message .
                     STREAM_NOTIFY_PROGRESS  7     Indicates current progress of the stream transfer in bytes_transferred and possibly bytes_max as well.
                     STREAM_NOTIFY_COMPLETED 8     There is no more data available on the stream.
                     STREAM_NOTIFY_FAILURE   9     A generic error occurred on the stream, consult message and message_code for details.
                     STREAM_NOTIFY_AUTH_RESULT   10     Authorization has been completed (with or without success).

                     STREAM_NOTIFY_SEVERITY_INFO 0     Normal, non-error related, notification.
                     STREAM_NOTIFY_SEVERITY_WARN 1     Non critical error condition. Processing may continue.
                     STREAM_NOTIFY_SEVERITY_ERR  2     A critical error occurred. Processing cannot continue.
                     */
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
                        case 0:
                            //     UNINITIALIZED     open() has not been called yet.
//                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                            break;
                        case 1:
                            //     LOADING     send() has not been called yet.
//                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                            break;
                        case 2:
                            //     LOADED     send() has been called, and headers and status are available.
//                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                            break;
                        case 3:
                            //     INTERACTIVE     Downloading; responseText holds partial data.
                            // One character is two bytes
                            response.data('bytes', req.responseText.length * 2);
                            break;
                        case 4:
                            //     COMPLETED     The operation is complete.
                            if (req.status >= 200 && req.status < 400) {
                                // One character is two bytes
                                response.data('bytes', req.responseText.length * 2);
//                                    bytes_transferred = req.responseText.length * 2; 
//                                    notification.call(objContext, 8, 0, '', req.status, bytes_transferred, 0);
                            } else if (req.status === 403) { // Fix: These two are finished except for message
//                                    notification.call(objContext, 10, 2, '', req.status, 0, 0);
                            } else { // Errors
//                                    notification.call(objContext, 9, 2, '', req.status, 0, 0);
                            }

//                            r.onResponse.notify(response);

                            break;
                        default:
//                                throw 'Unrecognized ready state for file_get_contents()';
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
//            console.log(e);
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

        if (r.getType() != r.TYPE_ASYNC) {
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
    };
    
    var self = this;
});