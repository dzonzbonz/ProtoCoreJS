/**
 * @namespace ProtoCore.Enviroment
 * 
 * @class DispatcherAdapter
 * 
 */

ProtoCore.Enviroment = ProtoCore.Enviroment || {};

ProtoCore.Enviroment.DispatcherAdapterInterface = function () {
    
    this.dispatch = function ($targets, invokable, params, onDone) {};
    
    this.dispatchTarget = function ($targets, invokable, params, onDone) {};
    
};
ProtoCore.mode(ProtoCore.Enviroment, 'DispatcherAdapterInterface', ProtoCore.MODE_LOCKED);

/**
 * @extends {ProtoCore.Enviroment.DispatcherAdapterInterface}
 */
ProtoCore.Enviroment.DispatcherAdapter = new ProtoCore.Enviroment.DispatcherAdapterInterface();
ProtoCore.implement(ProtoCore.Enviroment.DispatcherAdapter, function () {
    
    this.dispatchTarget = function ($target, _invokableAlias, _params, onDone) {
        
        // get the invokable
        var _invokableAssigned = $target.attr('core-dispatch');
        var _invokableClass = _invokableAlias ? _invokableAlias : _invokableAssigned;
        
        if (_invokableClass) {
            ProtoCore.Enviroment.Loader.load(_invokableClass, function () {
            
                var coreData = $target.data('core');

            // resolve it
                var _invokable = ProtoCore.Enviroment.Loader.resolve(_invokableClass);

            // instantiate it
                var _invokableInstance = ProtoCore.instantiate(_invokable['class']);

            // assign invokable instance for later use
                coreData = {
                    'control': _invokableInstance
                };

            // save data
                $target.data('core', coreData);

            // invoke it
                if (coreData['control'].invoke) {
                    coreData['control'].invoke(_params);
                }

            // dispatch it
                coreData['control'].dispatch($target, _params);

                if (onDone) {
                    onDone();
                }
            });
        } else {
            if (onDone) {
                onDone();
            }
        }
        
    };
    
    this.dispatch = function ($dispatchTargets, _invokableAlias, _params, onDone) {        
        
        var _loadIterator = function (_position) {
            
            if (_position < $dispatchTargets.length) {
                
                var $dispatchTarget = $dispatchTargets.eq(_position);

                _this.dispatchTarget($dispatchTarget, _invokableAlias, _params, function () {
                    _loadIterator(_position + 1);
                });

            } else {
                if (onDone) {
                    onDone();
                }
            }
        };

        _loadIterator(0);
    };
    
    var _this = this;
    
    ProtoCore.mode(this, 'dispatch', ProtoCore.MODE_LOCKED);
});

ProtoCore.mode(ProtoCore.Enviroment, 'DispatcherAdapter', ProtoCore.MODE_LOCKED);