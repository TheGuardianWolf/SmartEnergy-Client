var dashboard = {
	partial : undefined,
	display : function() {
	  console.log('Switching to dashboard.');
	  $('.viewport').children().velocity('fadeOut').promise().then(function() {
			$('.viewport').empty();
			$('.viewport').prepend(Mustache.render(dashboard.partial, api));
			events.setDashboardEventHandlers();
			$('#dashboard').velocity('fadeIn');
	  });
	},
	viewport : {
		refresh : function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			if (typeof dashboard.viewport.onDisplay === 'undefined')
			{
				dashboard.viewport.onDisplay = 'overview';
				$('.dashboard .sidebar .current-usage .counter').text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + ' W');
				dashboard.overview.display();
			}
			else {
				dashboard.currentDevice.getData().then(function() {
					$('.dashboard .sidebar .current-usage .counter').text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + ' W');
					dashboard[dashboard.viewport.onDisplay].refresh();
				});
			}
		},
		onDisplay : undefined
	},
	overview : {
		partial : undefined,
		display: function() {
			console.log('Switching to overview.');
			$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
				$('.dashboard-viewport').empty();
				$('.dashboard-viewport').prepend(dashboard.overview.partial);
				var deviceId = String(dashboard.currentDevice.Device.Id);
				dashboard.overview.deviceAlias = $('.overview .device-alias');
				dashboard.overview.quickPower = $('.overview .quick-stats .power .value').text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value);
				dashboard.overview.lastUpdate = $('.overview span.last-update');
				dashboard.overview.lastSubmit = $('.overview span.last-submit');
				dashboard.overview.lineChart = new google.charts.Line($('.overview .overview-line-chart')[0]);
				dashboard.overview.refresh();
				$('.dashboard-viewport .overview').velocity('fadeIn');
			});
		},
		drawChart : function() {
			var options = {
        chart: {
	        title: 'Last Hour',
	        subtitle: 'Stats from the last hour.'
        },
        width: 600,
        height: 450
      };
			dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data, google.charts.Line.convertOptions(options));
		},
		refresh: function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			dashboard.overview.deviceAlias.text(dashboard.currentDevice.Device.Alias);
			dashboard.overview.quickPower.text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value);
			dashboard.overview.lastUpdate.text(moment(dashboard.currentDevice.lastAppUpdateTime).format('Do MMMM YYYY, h:mm:ss a'));
			dashboard.overview.lastSubmit.text(moment(dashboard.currentDevice.lastDeviceUpdateTime).format('Do MMMM YYYY, h:mm:ss a'));
			dashboard.currentDevice.dataTable.update.promise().then(function() {
				dashboard.overview.drawChart();
			});
		},
		// jQuery Objects for data binding
		quickPower : undefined,
		lastUpdate : undefined,
		lastSubmit : undefined,
		lineChart : undefined,
		deviceAlias : undefined
	},
	currentDevice : {
		dataTable: {
			data : undefined,
			update : undefined,
		},
		Device : undefined,
		lastDeviceUpdateTime : undefined,
		lastAppUpdateTime : undefined,
		updateDaemon : undefined,
		processedData : undefined,
		getData : function() {

			if (typeof dashboard.currentDevice.Device.Id !== 'undefined')
			{
				api.notify(
					'Devices',
					'Getting data for ' + dashboard.currentDevice.Device.Alias + '.',
					'info'
				);

				var successCallback;
				var oData = '';

				var updateTime = function() {
					dashboard.currentDevice.lastAppUpdateTime = moment();
				};

				dashboard.currentDevice.dataTable.update = $.Deferred();
				var sortData = function(deviceId, data) {
					if (typeof api.data.Data[deviceId] === 'undefined')
					{
						api.data.Data[deviceId] = {};
					}

					data.map(function(currentValue) {
						if (typeof api.data.Data[deviceId][currentValue.Label] === 'undefined') {
							api.data.Data[deviceId][currentValue.Label] = [];
						}
						api.data.Data[deviceId][currentValue.Label].push(currentValue);
					});


					// DataTable construction attempt

					var columnNames = Object.keys(api.data.Data[deviceId]);

					if (typeof dashboard.currentDevice.dataTable.data === "undefined") {
						var dataTable = new google.visualization.DataTable();
						dashboard.currentDevice.dataTable.data = dataTable;

						dataTable.addColumn({
							type:'date',
							role:'domain'
						}, 'Time');

						columnNames.map(function(currentValue) {
							dataTable.addColumn({
								type:'number',
								role:'data'
							}, currentValue);
						});
					}

					data.map(function(dataValue) {
						var row = [];
						row[0] = new Date(dataValue.Time);

						columnNames.map(function(columnName, index) {
							if (dataValue.Label === columnName) {
								row.push(dataValue.Value);
							}
							else {
								row.push(null);
							}
						});

						dataTable.addRow(row);
					});
					dashboard.currentDevice.dataTable.update.resolve(dashboard.currentDevice.dataTable.data);
					// End DataTable construction attempt
				};

				var deviceId = String(dashboard.currentDevice.Device.Id);
				if (typeof api.data.Data[deviceId] === 'undefined') {
					// getData Initial Run
					successCallback = function(r) {
						api.notify(
	            'Devices',
	            'Successfully retrieved data for '+ dashboard.currentDevice.Device.Alias + '. Data will automatically update every 30 seconds.',
	            'success'
	          );
						sortData(deviceId, r);
						dashboard.currentDevice.lastDeviceUpdateTime = r[r.length - 1].Time;
						updateTime();
						return r;
					};
				}
				else {
					successCallback = function(r) {
						var deviceId = String(dashboard.currentDevice.Device.Id);
						sortData(deviceId, r);
						api.data.Data[deviceId].lastDeviceUpdateTime = r[r.length - 1].Time;
						updateTime();
						return r;
					};
				}

				return api.get.Data(dashboard.currentDevice.Device, oData)
				.then(successCallback, function(r) {
					console.log(r);
					api.notify(
            'Devices',
            'Error getting data for ' + dashboard.currentDevice.Device.Alias + '. Server response: '+ String(r.status) + '.',
            'warning'
          );
					return $.Deferred().reject('requestData').promise();
				});
			}
			else {
				api.notify(
          'Application',
          'An unknown error has occured, please contact the developer and restart the application.',
          'alert'
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
