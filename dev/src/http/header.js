/**
 * @constructor
 * @param {String} filename
 * 
 * @returns {C.Http.Header}
 */
C.Http.Header = function (uri) {
    
    this.getHeaders = function () { };
    this.setHeaders = function (val) { };

    this.getHeader = function (key) { };
    this.setHeader = function (key, val) { };
    this.issetHeader = function (key) { };
    this.unsetHeader = function (key) { };
    
};

C.factory(C.Http, 'Header', function () {
    /**
     * @extends C.Http.Header
     * @param {type} uriToParse
     * @returns {header_L19.__constructor}
     */
    var __constructor = function () {
        /* Variables */
        var headers = {};
        
        /* Implementation */
        this.getHeaders = function () {
            return headers;
        };
        this.setHeaders = function (val) {
            if (C.isString(val)) {
                var headers = val.split('\n');
                for (var k = 0; k < headers.length; k++) {
                    this.setHeader(headers[k]);
                }
            }
            else {
                var isArray = C.isArray(val);
            
                C.traverse(val, function (sendHeaderName, sendHeaderValue) {
                    if (isArray) {
                        self.setHeader(sendHeaderValue);
                    }
                    else {
                        self.setHeader(sendHeaderName, sendHeaderValue);
                    }
                });
            }
            
            return this;
        };

        this.getHeader = function (key) {
            if (this.issetHeader(key)) {
                return headers[key.toLowerCase()];
            }
            else {
                return null;
            }
        };
        this.setHeader = function (key, val) {
            if (!C.isDefined(val) && C.isDefined(key)) {
                if (C.isEmpty(key)) {
                    var breakPos = key.search(/:\s*/);
                    var sendHeaderName = key.substring(0, breakPos);
                    var sendHeaderValue = key.substring(breakPos + 1);

                    this.setHeader(sendHeaderName.trim(), sendHeaderValue.trim());
                }
            }
            else {
                headers[key.toLowerCase()] = val;
            }
            
            return this;
        };
        this.issetHeader = function (key) {
            return C.isDefined(headers[key.toLowerCase()]);
        };
        this.unsetHeader = function (key) {
            if (this.issetHeader(key)) {
                delete headers[key.toLowerCase()];
            }
        };
        
        var self = this;
    };

    __constructor.prototype = new C.Http.Header();
    __constructor.prototype.constructor = C.Http.Header;

    return __constructor;
});