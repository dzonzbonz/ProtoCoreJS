//::LICENSE:://
(function () {
var factory = function (namespace) {
    namespace.Enviroment = {};
//::PROTOCORE_OBJECT_JS:://
//::PROTOCORE_OBJECT_JS:://
//::PROTOCORE_EVENT_DATA_JS:://
//::PROTOCORE_EVENT_JS:://
    return namespace.Enviroment;
};

if (typeof define === 'function' && define.amd) {
    define(['ProtoCore'], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['ProtoCore.Enviroment'] = factory(ProtoCore);
}

}());
