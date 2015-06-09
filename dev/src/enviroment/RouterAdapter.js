/**
 * @namespace ProtoCore.Enviroment
 * 
 * @class RouterAdapter
 * 
 */

ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.RouterAdapterInterface = function () {
    
    this.addStrategy = function (routeKey, routeCondition, routeResolve) {};
    
    this.test = function (route) {};
    
    this.resolve = function (route) {};
    
    this.redirect = function (route) {};
    
    this.build = function (routeKey, params) {};
    
};
ProtoCore.mode(ProtoCore.Enviroment, 'RouterAdapterInterface', ProtoCore.MODE_LOCKED);

/**
 * @extends {ProtoCore.Enviroment.RouterInterface}
 */
ProtoCore.Enviroment.RouterAdapter = new ProtoCore.Enviroment.RouterAdapterInterface();
ProtoCore.implement(ProtoCore.Enviroment.RouterAdapter, function () {
    
    this.addStrategy = function (routeKey, routeCondition, routeResolve) {
        
    };
    
    this.test = function (route) {
        return false;
    };
    
    this.redirect = function (route) {
        
    };
    
    this.resolve = function (route) {
        return false;
    };
    
    this.build = function (routeKey, params) {
        return false;
    };
    
});

ProtoCore.mode(ProtoCore.Enviroment, 'RouterAdapter', ProtoCore.MODE_LOCKED);