ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 */
ProtoCore.Enviroment.Request = function () {
    
    ProtoCore.extend(this, new ProtoCore.Enviroment.Object());
    
    var _criteria = {};
    var _order = {};
    var _paging = {};
    
    this.getCriteria = function (_id, _criteria) {
        
    };
    
    this.setCriteria = function (_criteria, _order, _paging, _include) {
        
    };
    
};

ProtoCore.Enviroment.Request.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.Request.prototype.constructor = ProtoCore.Enviroment.Request;
ProtoCore.register('ProtoCore.Enviroment.Request', ProtoCore.Enviroment.Request);
ProtoCore.mode(ProtoCore.Enviroment, 'Request', ProtoCore.MODE_LOCKED);