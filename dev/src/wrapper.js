//::LICENSE:://
(function () {
var factory = function () {
//::PROTOCORE_JS:://
    return protocore;
};

if (typeof define === 'function' && define.amd) {
    define([], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['protocore'] = factory();
}

}());
