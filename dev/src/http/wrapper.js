//::LICENSE:://
(function () {
var factory = function (C) {
    C.Http = {};
//::DATA_JS:://
//::URI_JS:://
//::RESPONSE_JS:://
//::REQUEST_JS:://
//::CLIENT_JS:://
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
