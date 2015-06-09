ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 */
ProtoCore.Enviroment.Module = function () {
    
    ProtoCore.extend(this, new ProtoCore.Enviroment.Object());
    
    this.loadStrategy = function (_class) {
        
    };
    
    this.factoryStrategy = function (_class) {
        
    };
    
    this.layoutStrategy = function (_request, _layout) {
        return _layout;
    };
    
    this.invokableStrategy = function (_class) {
        return null;
    };
    
    this.routeStrategy = function (_router) {
        return null;
    };
};

ProtoCore.Enviroment.Module.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.Module.prototype.constructor = ProtoCore.Enviroment.Module;
ProtoCore.register('ProtoCore.Enviroment.Module', ProtoCore.Enviroment.Module);
ProtoCore.mode(ProtoCore.Enviroment, 'Module', ProtoCore.MODE_LOCKED);