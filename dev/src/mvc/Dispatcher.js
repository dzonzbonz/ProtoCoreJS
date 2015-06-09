/**
 * @namespace ProtoCore.Enviroment
 * 
 * @class Router
 * 
 * @uses ProtoCore.Enviroment.DispatcherAdapter;
 */
ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.DispatcherInterface = function () {
    
    this.setAdapter = function (adapterInstance) {};
    
    this.dispatch = function ($targets, invokable, params, onDone) {};
    
    this.dispatchTarget = function ($target, invokable, params, onDone) {};
    
};
ProtoCore.Enviroment.DispatcherInterface.prototype = new ProtoCore.Enviroment.DispatcherAdapterInterface();
ProtoCore.mode(ProtoCore.Enviroment, 'DispatcherInterface', ProtoCore.MODE_LOCKED);

/**
 * @extends {ProtoCore.Enviroment.RouterInterface}
 */
ProtoCore.Enviroment.Dispatcher = new ProtoCore.Enviroment.DispatcherInterface();
ProtoCore.implement(ProtoCore.Enviroment.Dispatcher, function () {
    
    /**
     * 
     * @type ProtoCore.Enviroment.DispatcherAdapterInterface
     */
    var dispatcherAdapter = ProtoCore.Enviroment.DispatcherAdapter;
            
    /**
     * 
     * @param {ProtoCore.Enviroment.DispatcherAdapterInterface} setRouterAdapter
     * @returns {undefined}
     */
    this.setAdapter = function (adapterInstance) {
        
        dispatcherAdapter = adapterInstance;
        
    };
    
    this.dispatch = function ($target, invokable, params, onDone) {
        
        dispatcherAdapter.dispatch($target, invokable, params, onDone);
        
    };
    
    this.dispatchTarget = function ($target, invokable, params, onDone) {
        
        dispatcherAdapter.dispatchTarget($target, invokable, params, onDone);
        
    };
        
        
    ProtoCore.mode(this, 'setAdapter', ProtoCore.MODE_LOCKED);
    ProtoCore.mode(this, 'dispatch', ProtoCore.MODE_LOCKED);
});

ProtoCore.mode(ProtoCore.Enviroment, 'Dispatcher', ProtoCore.MODE_LOCKED);