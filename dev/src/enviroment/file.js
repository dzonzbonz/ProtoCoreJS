/**
 * @constructor
 * @param {String} filename
 * 
 * @returns {C.Enviroment.FileInterface}
 */
C.Enviroment.FileInterface = function () {

    this.base = function () {
    };

    this.dir = function () {
    };

    this.read = function (request) {
        
    };

    this.info = function () {
    };
    
    this.write = function (request) {
        
    };
};

C.Enviroment.File = new C.Enviroment.FileInterface();

C.factory(C.Enviroment.File, function () {
    
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

});