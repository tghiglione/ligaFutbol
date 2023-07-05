sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../utils/formatter",
    "../utils/constants",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,formatter,constants,UIComponent,MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("futbol.controller.detalle", {

            formatter : formatter,

            onInit: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.getRoute("Routedetalle").attachMatched(this._onMatched,this);
            },
            onOpenDialog: function(){
                var oView= this.getView();
                if(!this.openDialog){
                    this.openDialog=sap.ui.xmlfragment(constants.model.ids.FRAGMENTS.FormDialog,constants.model.routes.FRAGMENTS.FormDialog, this);
                    oView.addDependent(this.openDialog); 
                }
                this.openDialog.open();
            },
            onCloseDialog: function(){
                this.openDialog.close();
            },
            _onMatched: function(oEvent){
                var oArgs= oEvent.getParameter("arguments");
                var oView = this.getView();
                oView.bindElement({
                    path: `/EquiposSet('${oArgs.equipoID}')`,
                    events: {
                        dataRequested: function () {
                            oView.setBusy(true);
                        },
                        dataReceived: function () {
                            oView.setBusy(false);
                        }
                    }
                });
            },
            deletePlayer: function(oEvent){
                var bundle=this.getView().getModel("i18n").getResourceBundle();
                var oData= this.getView().getModel();
                var oItem=oEvent.getSource();
                var oPlayer=oItem.getBindingContext().getProperty("JUGADORID");
                var sPath=`/JugadoresSet('${oPlayer}')`;
                MessageBox.confirm(
                    bundle.getText("MensajePopUpEliminar"),
                    function(oAction){
                        if(MessageBox.Action.OK===oAction){
                            oData.remove(sPath,{
                                success: function (oData) {
                                    console.log(oData)
                                },
                                error: function (oError) {
                                    console.log(oError)
                                }       
                            });
                            MessageToast.show(bundle.getText("MensajeEliminadoCorrectamente"))
                        }
                    },
                    bundle.getText("eliminar")
                )  
            },
            createPlayer: function(oEvent){
                var bundle=this.getView().getModel("i18n").getResourceBundle();
                var oData=this.getView().getModel();
                var equipoId= oEvent.getSource().getBindingContext().getProperty("EQUIPOID");

                var inputNombreId = sap.ui.core.Fragment.createId(constants.model.ids.FRAGMENTS.FormDialog, "inputNombre");
                var inputApellidoId = sap.ui.core.Fragment.createId(constants.model.ids.FRAGMENTS.FormDialog, "inputApellido");
                var inputEdadId = sap.ui.core.Fragment.createId(constants.model.ids.FRAGMENTS.FormDialog, "inputEdad");
                var inputPosicionId = sap.ui.core.Fragment.createId(constants.model.ids.FRAGMENTS.FormDialog, "selectPosicion");

                var nombre = sap.ui.getCore().byId(inputNombreId).getValue();
                var apellido = sap.ui.getCore().byId(inputApellidoId).getValue();
                var edad = parseInt(sap.ui.getCore().byId(inputEdadId).getValue());
                var posicion = sap.ui.getCore().byId(inputPosicionId).getSelectedItem().getText();

                var nombreFormateado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
                var apellidoFormateado = apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase();

                var sPath="/JugadoresSet";

                var newPlayer={
                    "EQUIPOID": `${equipoId}`,
                    "NOMBRE": `${nombreFormateado}`,
                    "APELLIDO": `${apellidoFormateado}`,
                    "EDAD": edad,
                    "POSICION": `${posicion}`
                }
                
                if(edad!=="" && nombre!=="" && apellido!==""  && posicion!==""){
                    MessageBox.confirm(
                        bundle.getText("MensajePopUpAgregar"),
                        function(oAction){
                            if(MessageBox.Action.OK===oAction){
                                oData.create(sPath, newPlayer, {
                                    success: function (response) {
                                        console.log(response)
                                    },
                                    error: function (error) {
                                        console.log(error)
                                    }
                                });
                                MessageToast.show(bundle.getText("jugadorAgregado"))
                            }
                        },
                        bundle.getText("agregarJugadorTitulo")   
                    )
                }else{
                    MessageToast.show(bundle.getText("noCompletoLosCampos"))
                }
                sap.ui.getCore().byId(inputNombreId).setValue("");
                sap.ui.getCore().byId(inputApellidoId).setValue("");
                sap.ui.getCore().byId(inputEdadId).setValue("");
                this.openDialog.close()
            }
        });
    });