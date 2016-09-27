// Document Ready Event
var events = {
	appStart : function() {
		console.log('App started.');
		for (var key in api.data) {
		  if (api.data.hasOwnProperty(key)) {
				var stored = store.get(key);
				if ((typeof stored) === "object" && stored !== null) {
					api.data[key] = stored;
				}
		  }
		}
		$(function() {
			if (login.isLoggedIn()) {
				login.toDashboard().then(function() {
					dashboard.display();
				});
			}
			else {
				login.display();
			}
		});
	},
	setLoginEventHandlers : function() {
		$("#login-form").submit(function(event) {
			event.preventDefault();
			login.getUsernameFromForm();
			login.toDashboard().then(function() {
				dashboard.display();
			});
		});
	},
	setDashboardEventHandlers : function() {
		$("#sign-out").click(function(event) {
			event.preventDefault();
			dashboard.signOut();
			login.display();
		});
	}
};
