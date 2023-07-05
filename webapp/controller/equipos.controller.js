sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("futbol.controller.equipos", {
            onInit: function () {

            },
            onListItemPress: function(oEvent){
                var oItem = oEvent.getSource();
                var oRouter = UIComponent.getRouterFor(this);
                var equipo = oItem.getBindingContext().getProperty("EQUIPOID");
                oRouter.navTo("Routedetalle",{
                    equipoID: equipo
                });
                
            },
            busquedaEquipo:function(oEvent){
                var filters=[];
                var query=oEvent.getParameter("query");
                var queryFormateado=query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
                if(query && query.length>0){
                    filters.push(new Filter({
                        path:"NOMBRE",
                        operator:FilterOperator.Contains,
                        value1:queryFormateado
                    }));
                };
                var list=this.getView().byId("listaEquipos");
                var binding=list.getBinding("items");
                binding.filter(filters);
            }
        });
    });
