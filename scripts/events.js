// Document Ready Event
var events = {
	onResize : [],
	appStart : function() {
		console.log('App started.');
		for (var key in api.data) {
		  if (api.data.hasOwnProperty(key)) {
				var stored = store.get(key);
				if ((typeof stored) === 'object' && stored !== null) {
					api.data[key] = stored;
				}
		  }
		}
		$(function() {
			if (login.isLoggedIn()) {
				api.notify(
	        'Authentication',
	        'Resuming from last session.',
	        'info'
	      );
				login.toDashboard().then(function() {
					dashboard.display();
				});
			}
			else {
				login.display();
			}
			$( window ).resize(function() {
			  events.onResize.forEach(function(actions) {
					actions();
				});
			});
		});
	},
	setLoginEventHandlers : function() {
		$('#login-form').submit(function(event) {
			event.preventDefault();
			login.getUsernameFromForm();
			login.toDashboard().then(function() {
				dashboard.display();
			});
		});
	},
	setDashboardEventHandlers : function() {
		$('#sign-out').click(function(event) {
			event.preventDefault();
			dashboard.signOut();
			login.display();
		});
		$('.dashboard .sidebar li.overview').click(function(event) {
			event.preventDefault();
			dashboard.overview.display();
		});
		$('.dashboard .app-bar .device-list li a').click(function(event) {
			event.preventDefault();
			var deviceId = parseInt($(this).data('device-id'));
			var selectedDevice = api.data.Devices.find(function(element) {
				return element.Id === deviceId;
			});
			if (typeof selectedDevice !== 'undefined') {
				if (typeof dashboard.currentDevice.Device === 'undefined' || selectedDevice.Id !== dashboard.currentDevice.Device.Id)
				{
					dashboard.currentDevice.Device = selectedDevice;
					dashboard.currentDevice.getData().then(function() {
						dashboard.viewport.refresh();
					});
				}
			}
		});
	}
};
