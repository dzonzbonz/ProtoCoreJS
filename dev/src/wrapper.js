//::LICENSE:://
(function () {
var factory = function () {
//::PROTOCORE_JS:://
    return C;
};

if (typeof define === 'function' && define.amd) {
    define([], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory();
} else {
    /*jshint sub:true */
    window['C'] = factory();
}

}());