/**
 * @namespace ProtoCore.Enviroment
 * 
 * @class Router
 * 
 * @uses ProtoCore.Enviroment.RouterAdapter;
 */
ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.RouterInterface = function () {
    
    this.setAdapter = function (routerAdapter) {};
    
    this.addStrategy = function (routeKey, routeCondition, routeResolveRule) {};
    
    this.test = function (route) {};
    
    this.resolve = function (route) {};
    
    this.redirect = function (route) {};
    
    this.build = function (routeKey, params) {};
    
};
ProtoCore.mode(ProtoCore.Enviroment, 'RouterInterface', ProtoCore.MODE_LOCKED);

/**
 * @extends {ProtoCore.Enviroment.RouterInterface}
 */
ProtoCore.Enviroment.Router = new ProtoCore.Enviroment.RouterInterface();
ProtoCore.implement(ProtoCore.Enviroment.Router, function () {
    
    /**
     * 
     * @type ProtoCore.Enviroment.RouterAdapterInterface
     */
    var routerAdapter = null;
    var routeList = {};
            
    /**
     * 
     * @param {ProtoCore.Enviroment.RouterAdapterInterface} setRouterAdapter
     * @returns {undefined}
     */
    this.setAdapter = function (setRouterAdapter) {
        
        routerAdapter = setRouterAdapter;
        
    };
    
    this.addStrategy = function (routeKey, routeCondition, routeResolveRule) {
        routeList[routeKey] = {
            'rule': routeResolveRule,
            'condition': routeCondition
        };
        
        routerAdapter.addStrategy(routeKey, routeCondition, routeResolveRule);
    };
    
    this.test = function (route) {
        return routerAdapter.test(route);
    };
    
    this.resolve = function (route) {
        for (var routeItem in routeList) {
            var matched = routerAdapter.resolve(routeItem, route);

            if (matched) {
                break;
            }
        }
        return routerAdapter.resolve(route);
    };
    
    this.redirect = function (route) {
        return routerAdapter.redirect(route);
    };
    
    this.build = function (routeKey, params) {
        
    };
    
});

ProtoCore.mode(ProtoCore.Enviroment, 'Router', ProtoCore.MODE_LOCKED);