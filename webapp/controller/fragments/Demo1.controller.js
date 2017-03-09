sap.ui.define(["be/wl/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("be.wl.controller.fragments.Demo1", {
		onBeforeShow: function(parent, fragment, callback, data) {
			this.parent = parent;
			this.fragment = fragment;
			this.callback = callback;

			var dialogmodel = new JSONModel({
				title: data.title
			});
			this.fragment.setModel(dialogmodel, "ui");
			//read label control from dialog in fragmetn
			var label = this.getFragmentControlById(this.parent,"label1");
		},
		onClose: function() {
			this.fragment.close();
			this.callback.call(this.parent);
		}
	});
});