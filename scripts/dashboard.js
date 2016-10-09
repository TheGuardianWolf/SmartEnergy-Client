var dashboard = {
	partial : undefined,
	display : function() {
	  console.log("Switching to dashboard.");
	  $(".viewport").children().velocity("fadeOut").promise().then(function() {
			$(".viewport").empty();
			$(".viewport").prepend(Mustache.render(dashboard.partial, api));
			events.setDashboardEventHandlers();
			$("#dashboard").velocity("fadeIn");
	  });
	},
	viewport : {
		refresh : function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			if (typeof dashboard.viewport.onDisplay === "undefined")
			{
				dashboard.viewport.onDisplay = "overview";
				$(".dashboard .sidebar .current-usage .counter").text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + " W");
				dashboard.overview.display();
			}
			else {
				dashboard.currentDevice.getData().then(function() {
					$(".dashboard .sidebar .current-usage .counter").text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + " W");
					dashboard[dashboard.viewport.onDisplay].refresh();
				});
			}
		},
		onDisplay : undefined
	},
	overview : {
		partial : undefined,
		display: function() {
			console.log("Switching to overview.");
			$(".dashboard-viewport").children().velocity("fadeOut").promise().then(function() {
				$(".dashboard-viewport").empty();
				$(".dashboard-viewport").prepend(Mustache.render(dashboard.overview.partial, dashboard.currentDevice));
				var deviceId = String(dashboard.currentDevice.Device.Id);
				dashboard.overview.quickPower = $(".overview .quick-stats .power .value").text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value);
				dashboard.overview.lastUpdate = $(".overview span.last-update");
				// dashboard.overview.lastSixHoursData = $(".overview .quick-stats .power .value");
				$(".dashboard-viewport .overview").velocity("fadeIn");
			});
		},
		refresh: function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			dashboard.overview.quickPower.text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value);
			dashboard.overview.lastUpdate.text(moment().format("Do MMMM YYYY, h:mm:ss a"));
		},
		quickPower : undefined,
		lastUpdate : undefined,
		lastSixHoursData : undefined
	},
	currentDevice : {
		Device : undefined,
		lastUpdateTime : undefined,
		updateDaemon : undefined,
		processedData : undefined,
		getData : function() {

			if (typeof dashboard.currentDevice.Device.Id !== "undefined")
			{
				api.notify(
					"Devices",
					"Getting data for " + dashboard.currentDevice.Device.Alias + ".",
					"info"
				);

				var successCallback;
				var oData = "";

				var updateTime = function() {
					dashboard.currentDevice.lastUpdateTime = moment().format("Do MMMM YYYY, h:mm:ss a");
				};

				var sortData = function(deviceId, data) {
					if (typeof api.data.Data[deviceId] === "undefined")
					{
						api.data.Data[deviceId] = {};
					}

					data.map(function(currentValue) {
						if (typeof api.data.Data[deviceId][currentValue.Label] === "undefined") {
							api.data.Data[deviceId][currentValue.Label] = [];
						}
						api.data.Data[deviceId][currentValue.Label].push(currentValue);
					});
				};

				var deviceId = String(dashboard.currentDevice.Device.Id);
				if (typeof api.data.Data[deviceId] === "undefined") {
					// getData Initial Run
					successCallback = function(r) {
						api.notify(
	            "Devices",
	            "Successfully retrieved data for "+ dashboard.currentDevice.Device.Alias + ". Data will automatically update every 30 seconds.",
	            "success"
	          );
						sortData(deviceId, r);
						api.data.Data[deviceId].lastDeviceUpdate = r[r.length - 1].Time;
						updateTime();
						return r;
					};
				}
				else {
					successCallback = function(r) {
						var deviceId = String(dashboard.currentDevice.Device.Id);
						sortData(deviceId, r);
						api.data.Data[deviceId].lastDeviceUpdate = r[r.length - 1].Time;
						updateTime();
						return r;
					};
				}

				return api.get.Data(dashboard.currentDevice.Device, oData)
				.then(successCallback, function(r) {
					console.log(r);
					api.notify(
            "Devices",
            "Error getting data for " + dashboard.currentDevice.Device.Alias + ". Server response: "+ String(r.status) + ".",
            "warning"
          );
					return $.Deferred().reject("requestData").promise();
				});
			}
			else {
				api.notify(
          "Application",
          "An unknown error has occured, please contact the developer and restart the application.",
          "alert"
        );
			}
		}
	},
	signOut : function() {
		for (var key in api.data) {
			if (api.data.hasOwnProperty(key)) {
				store.remove(key);
			}
		}
	},
};
