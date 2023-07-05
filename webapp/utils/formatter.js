sap.ui.define([], function () {
    "use strict";
    return {

        edadState: function (sEdad) {
            if (sEdad > 30) {
            return "Error";
            } else {
            return "Success";
            }
        }
    };
});