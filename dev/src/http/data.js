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