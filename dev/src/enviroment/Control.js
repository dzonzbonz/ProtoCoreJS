ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 */
ProtoCore.Enviroment.Control = function () {
    
    ProtoCore.extend(this, new ProtoCore.Enviroment.Object());
    
    var _invoked = {};
    var $target = null;
    
    this.dispatch = function (_target, _request) {
        $target = _target;
        
        this.onDispatch($target, _request);
    };
    ProtoCore.mode(this, 'dispatch', ProtoCore.MODE_LOCKED);
    
    this.getTarget = function () {
        return $target;
    };
    ProtoCore.mode(this, 'getTarget', ProtoCore.MODE_LOCKED);    
    
    this.onDispatch = function ($target, _request) {
        
    };
    
    this.invoke = function (_invokable) {
        _invoked = _invokable;
    };
    
    this.getInvokerData = function () {
        return ProtoCore.clone(_invoked);
    };
    
    this.view = function (_data, _template, _callback) {
        var _invokedData = this.getInvokerData();
        
        var _view = new ProtoCore.Enviroment.View();
            _view.setTarget(this.getTarget());
            _view.setTemplate(_invokedData['include']['directory'] + '/../View/' + _template);

        _view.onView.subscribe(function (e) {
            _callback(this);
        });

        _view.render(_data);
    };
    
};

ProtoCore.Enviroment.Control.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.Control.prototype.constructor = ProtoCore.Enviroment.Control;

ProtoCore.register('ProtoCore.Enviroment.Control', ProtoCore.Enviroment.Control);
ProtoCore.mode(ProtoCore.Enviroment, 'Control', ProtoCore.MODE_LOCKED);