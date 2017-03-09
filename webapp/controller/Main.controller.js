sap.ui.define(["be/wl/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";
	return BaseController.extend("be.wl.controller.Main", {
		/**
		 *@memberOf be.wl.controller.Main
		 */
		onOpenFragment: function() {
			this.openFragment(
				"Demo1",
				null,
				true,
				this.onFragmentCallback, {
					title: "Fragment Demo"
				});
		},
		onFragmentCallback: function() {
			MessageToast.show("Back in controller");
		}
	});
});