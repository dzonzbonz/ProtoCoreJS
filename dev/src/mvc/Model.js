ProtoCore.Enviroment = ProtoCore.Enviroment || {};

/**
 * @constructor
 * @extends {protocor.enviroment.object}
 */
ProtoCore.Enviroment.Model = function () {
    
    ProtoCore.extend(this, new ProtoCore.Enviroment.Object());
    
    this.getEntry = function (_id, _criteria) {
        
    };
    
    this.getListEntry = function (_criteria, _order, _paging, _include) {
        
    };
    
};

ProtoCore.Enviroment.Model.prototype = new ProtoCore.Enviroment.Object();
ProtoCore.Enviroment.Model.prototype.constructor = ProtoCore.Enviroment.model;
ProtoCore.register('ProtoCore.Enviroment.Model', ProtoCore.Enviroment.Model);
ProtoCore.mode(ProtoCore.Enviroment, 'Model', ProtoCore.MODE_LOCKED);