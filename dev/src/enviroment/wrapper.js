//::LICENSE:://
(function () {
var factory = function (C) {
    C.Enviroment = {};
//::THREAD_JS:://
//::OBJECT_JS:://
//::EVENT_DATA_JS:://
//::EVENT_JS:://
//::LOADER_JS:://
    return C.Enviroment;
};

if (typeof define === 'function' && define.amd) {
    define(['C'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['C.Enviroment'] = factory(C);
}

}());
