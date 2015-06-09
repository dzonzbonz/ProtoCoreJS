ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.LayoutInterface = function () {
    
    this.prependScriptFile = function (requiredFile) {};
    
    this.appendScriptFile = function (requiredFile) {};
    
    this.prependScript = function (requiredScript) {};
    
    this.appendScript = function (requiredScript) {};
    
    this.prependStyle = function (required) {};
    
    this.appendStyle = function (required) {};
    
    this.clearStyles = function () {};
    
    this.clearScripts = function () {};
    
};
ProtoCore.Enviroment.LayoutInterface.prototype = new ProtoCore.Enviroment.Object();

/**
 * @constructor
 * @extends {ProtoCore.Enviroment.LayoutInterface}
 */
ProtoCore.Enviroment.Layout = new ProtoCore.Enviroment.LayoutInterface();
ProtoCore.implement(ProtoCore.Enviroment.Layout, function () {
    
    var _parent = new ProtoCore.Enviroment.Object();
    ProtoCore.extend(this, _parent);
    
    var _scripts = [];
    var _styles = [];

    this.prependScriptFile = function (requiredFile) {
        _scripts.unshift({
            'type':'file',
            'script':requiredFile
        });
    };
    
    this.appendScriptFile = function (requiredFile) {
        _scripts.push({
            'type':'file',
            'script':requiredFile
        });
    };
    
    this.prependScript = function (requiredScript) {
        _scripts.unshift({
            'type':'content',
            'script':requiredScript
        });
    };
    
    this.appendScript = function (requiredScript) {
        _scripts.push({
            'type':'content',
            'script':requiredScript
        });
    };
    
    this.clearStyles = function () {
        _styles = [];
    };
    
    this.clearScripts = function () {
        _scripts = [];
    };
    
});


ProtoCore.mode(ProtoCore.Enviroment, 'Layout', ProtoCore.MODE_LOCKED);