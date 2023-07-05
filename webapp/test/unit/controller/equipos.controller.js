/*global QUnit*/

sap.ui.define([
	"futbol/controller/equipos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("equipos Controller");

	QUnit.test("I should test the equipos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
