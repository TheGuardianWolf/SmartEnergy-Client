// Event handlers defined here.
var events = {
	// To be run on app start.
	appStart : function() {
		console.log('App started.');
		// Load saved API data.
		for (var key in api.data) {
		  if (api.data.hasOwnProperty(key)) {
				var stored = store.get(key);
				if ((typeof stored) === 'object' && stored !== null) {
					api.data[key] = stored;
				}
		  }
		}
		// On DOM ready, resume from saved data if exists.
		$(function() {
			if (login.isLoggedIn()) {
				api.notify(
	        'Authentication',
	        'Resuming from last session.',
	        'info'
	      );
				login.toDashboard().then(function() {
					$('.preloader').hide();
					dashboard.display();
				});
			}
			else {
				$('.preloader').hide();
				login.display();
			}

			// Redraw charts when window is resized.
			$(window).resize(function() {
			  dashboard.viewport.redrawCharts.forEach(function(actions) {
					actions();
				});
			});
		});
	},
	// Need to set event handlers when the login page is shown.
	setLoginEventHandlers : function() {
		// Action to be performed when form is submitted. Facilitates the auth with
		// API.
		$('#login-form').submit(function(event) {
			event.preventDefault();
			login.getUsernameFromForm();
			login.toDashboard().then(function() {
				dashboard.display();
			});
		});
	},
	// When logging in, we must attach the dashboard event handlers on to the DOM.
	setDashboardEventHandlers : function() {
		// Event for when logging out.
		$('#sign-out').click(function(event) {
			event.preventDefault();
			dashboard.signOut();
			login.display();
		});

		// Event for when the sidebar buttons are clicked.
		$('.dashboard .sidebar li').click(function(event) {
			event.preventDefault();
			// Display the clicked dashboard view.
			dashboard[$(this).data('view')].display();
		});

		// Event for when a device is chosen.
		$('.dashboard .app-bar .device-list li a').click(function(event) {
			event.preventDefault();
			var deviceId = parseInt($(this).data('device-id'));
			var selectedDevice = api.data.Devices.find(function(element) {
				return element.Id === deviceId;
			});

			// Switch devices.
			if (typeof selectedDevice !== 'undefined') {
				if (typeof dashboard.currentDevice.Device === 'undefined' || selectedDevice.Id !== dashboard.currentDevice.Device.Id)
				{
					dashboard.currentDevice.reset();
					dashboard.currentDevice.Device = selectedDevice;
					dashboard.currentDevice.getData().then(function() {
						dashboard.viewport.refresh();
					});
				}
			}
		});
	}
};
