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