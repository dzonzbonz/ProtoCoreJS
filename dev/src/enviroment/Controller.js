/**
 * 
 * @uses ProtoCore.Enviroment.Control;
 */
ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @constructor
 * @extends {ProtoCore.Enviroment.Control}
 */
ProtoCore.Enviroment.Controller = function () {
    
    ProtoCore.extend(this, new ProtoCore.Enviroment.Control());
    
    this.layoutStrategy = function (_request, _layout) {
        return _layout;
    };
    
    this.dispatchStrategy = function ($target, _request, _layout) {
        return _layout;
    };
    
};

ProtoCore.Enviroment.Controller.prototype = new ProtoCore.Enviroment.Control();
ProtoCore.mode(ProtoCore.Enviroment, 'Controller', ProtoCore.MODE_LOCKED);