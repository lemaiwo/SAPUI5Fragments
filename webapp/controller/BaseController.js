var _fragments = [];
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	return Controller.extend("be.wl.controller.BaseController", {

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Overview", {}, true /*no history*/ );
			}
		},
		getModel: function(name) {
			return this.getView().getModel(name);
		},
		setModel: function(model, name) {
			return this.getView().setModel(model, name);
		},
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		openFragment: function(sName, model, updateModelAlways, callback, data) {
			if (sName.indexOf(".") > 0) {
				var aViewName = sName.split(".");
				sName = sName.substr(sName.lastIndexOf(".") + 1);
			} else { //current folder
				aViewName = this.getView().getViewName().split("."); // view.login.Login
			}
			aViewName.pop();
			var sViewPath = aViewName.join("."); // view.login
			if (sViewPath.toLowerCase().indexOf("fragments") > 0) {
				sViewPath += ".";
			} else {
				sViewPath += ".fragments.";
			}
			var id = this.getView().getId() + "-" + sName;
			if (!_fragments[id]) {
				//create controller
				var sControllerPath = sViewPath.replace("view", "controller");
				try {
					var controller = sap.ui.controller(sControllerPath + sName);
				} catch (ex) {
					controller = this;
				}
				_fragments[id] = {
					fragment: sap.ui.xmlfragment(
						id,
						sViewPath + sName,
						controller
					),
					controller: controller
				};
				if (model && !updateModelAlways) {
					_fragments[id].fragment.setModel(model);
				}
				// version >= 1.20.x
				this.getView().addDependent(_fragments[id].fragment);
			}
			var fragment = _fragments[id].fragment;
			if (model && updateModelAlways) {
				fragment.setModel(model);
			}
			if (_fragments[id].controller && _fragments[id].controller !== this) {
				_fragments[id].controller.onBeforeShow(this, fragment, callback, data);
			}

			setTimeout(function() {
				fragment.open();
			}, 100);
		},
		getFragmentControlById: function(parent, id) {
			var latest = this.getMetadata().getName().split(".")[this.getMetadata().getName().split(".").length - 1];
			return sap.ui.getCore().byId(parent.getView().getId() + "-" + latest + "--" + id);
		},
		closeFragments: function() {
			for (var f in _fragments) {
				if (_fragments[f]["fragment"] && _fragments[f].fragment["isOpen"] && _fragments[f].fragment.isOpen()) {
					_fragments[f].fragment.close();
				}
			}
		},
		getFragment: function(fragment) {
			return _fragments[this.getView().getId() + "-" + fragment];
		}
	});
});