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