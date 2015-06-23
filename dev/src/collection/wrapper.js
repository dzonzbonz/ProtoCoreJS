//::LICENSE:://
(function () {
var factory = function (C) {
    C.Storage = {};
    C.namespace(C.Storage, 'C.Storage');
//::BASE_JS:://
//::ARRAY_JS:://
//::STORAGE_JS:://
    return C.Storage;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Collection'] = factory(C);
}

}());
