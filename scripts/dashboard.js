// The dashboard object representing the main dashboard in the application.
//
// This should have been built using abstract classes, but for prototyping
// purposes, it was not. The final version will use Typescript as its scripting
// language to group the views into a single class.

var dashboard = {
	partial : undefined,
	// Display function for the dashboard on transition from any other view.
	display : function() {
	  console.log('Switching to dashboard.');
	  $('.viewport').children().velocity('fadeOut').promise().then(function() {
			$('.viewport').empty();
			$('.viewport').prepend(Mustache.render(dashboard.partial, api)); // Use Moustache to render template.
			events.setDashboardEventHandlers(); // Attach the event handlers to the view.
			$('#dashboard').velocity('fadeIn'); // Reveal the view.
	  });
	},
	// An object controlling the viewport of the application.
	viewport : {
		// Format number to 4 s.f. unless negative which has 3 s.f.
		formatNumber : function(number) {
			if (number < 1) {
				return number.toPrecision(3);
			}
			return number.toPrecision(4);
		},
		formatMoney : function(number) {
			return number.toFixed(2);
		},
		// Wrapper around the individual dashboard view refresh functions.
		refresh : function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);

			// Set the sidebar info first.
			$('.dashboard .sidebar .recent .counter').text(
				dashboard.viewport.formatNumber(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value) + ' W'
			);

			// By default, call the overview refresh.
			if (typeof dashboard.viewport.currentView === 'undefined')
			{
				dashboard.overview.display();
			}
			else {
				dashboard[dashboard.viewport.currentView].refresh();
			}
		},
		currentView : undefined,
		schedule : undefined,
		redrawCharts : [], // Array of functions to redraw charts. To be hooked on to an event.
	},
	// Object representing the dashboard history view.
	history : {
		partial : undefined,
		// Displays the history view.
		display : function() {
			// Current view must not be history already.
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'history') {
				// Set current view to history, and style the sidebar button appropriately.
				dashboard.viewport.currentView = 'history';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.history').addClass('active');
				console.log('Switching to history.');

				// Clear the chart redrawing functions.
				dashboard.viewport.redrawCharts.length = 0;

				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty(); // Remove all dashboard viewport children.
					$('.dashboard-viewport').prepend(dashboard.history.partial); // Add new partial view.
					var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.
					dashboard.history.lineChart = new google.visualization.LineChart($('.history .history-line-chart')[0]); // Create new linechart object.
					dashboard.history.refresh(); // Run the refresh on the current view to update data-bound DOM objects.
					$('.dashboard-viewport .history').velocity('fadeIn').promise().then(function() {
						// Only draw charts AFTER view has been rendered.
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.history.chartOptions());
							// Smooth the chart draw with a fadeIn.
							$('.history .history-line-chart').hide().velocity('fadeIn').promise().then(function() {
								// Then push the draw function into the redraw charts array.
								dashboard.viewport.redrawCharts.push(function() {
									dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.history.chartOptions());
								});
							});
						});
					});
				});
			}
		},
		// Refresh function for the history view.
		refresh : function() {
			// No bound objects.
		},
		// Object holding the chart options for this view. Returns the options
		// object to be used in chart drawing.
		chartOptions : function() {
			return {
        title: 'All Recorded Data',
        legend: { position: 'bottom' },
 				interpolateNulls : true,
 				vAxes: {
          0: {title: 'Value'},
        },
 				hAxes: {
          0: {
 						title: 'Time',
 						viewWindow: {
							// From when the device first updated to now. Otherwise from 1
							// year ago to now.
 	            min: (typeof dashboard.currentDevice.firstDeviceUpdateTime !== "undefined") ? moment.utc(dashboard.currentDevice.firstDeviceUpdateTime).local().toDate() : moment().subtract(1, 'year').toDate(),
 	            max: (typeof dashboard.currentDevice.firstDeviceUpdateTime !== "undefined") ? moment.utc(dashboard.currentDevice.lastDeviceUpdateTime).local().toDate() : moment().toDate()
 	          },
						gridlines: {
							count: -1,
							units: {
								hours: {format: ['HH:mm']}
							}
						},
 					}
        }
 		 };
	 },
	 // The chart object.
	 lineChart : undefined
	},
	// Object representing the dashboard recent view.
	recent : {
		partial : undefined,
		// Displays the recent view.
		display : function() {
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'recent') {
				// Set current view to recent, and style the sidebar button appropriately.
				dashboard.viewport.currentView = 'recent';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.recent').addClass('active');
				console.log('Switching to recent.');

				// Clear the chart redrawing functions.
				dashboard.viewport.redrawCharts.length = 0;

				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty(); // Remove all dashboard viewport children.
					$('.dashboard-viewport').prepend(dashboard.recent.partial); // Add new partial view.
					var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.
					dashboard.recent.lineChart.voltage = new google.visualization.LineChart($('.recent .voltage-line-chart')[0]); // Create new voltage linechart object.
					dashboard.recent.lineChart.current = new google.visualization.LineChart($('.recent .current-line-chart')[0]); // Create new current linechart object.
					dashboard.recent.lineChart.power = new google.visualization.LineChart($('.recent .power-line-chart')[0]); // Create new power linechart object.
					dashboard.recent.refresh(); // Run the refresh on the current view to update data-bound DOM objects.
					$('.dashboard-viewport .recent').velocity('fadeIn').promise().then(function() {
						// Only draw charts AFTER view has been rendered.
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							var drawCharts = function() {
								dashboard.recent.lineChart.voltage.draw(dashboard.currentDevice.dataTable.views.voltage, dashboard.recent.chartOptions('RMS Voltage in Last 5 Minutes', 'RMS Voltage (V)'));
								dashboard.recent.lineChart.current.draw(dashboard.currentDevice.dataTable.views.current, dashboard.recent.chartOptions('Max Current in Last 5 Minutes', 'Max Current (A)'));
								dashboard.recent.lineChart.power.draw(dashboard.currentDevice.dataTable.views.power, dashboard.recent.chartOptions('Average Power in Last 5 Minutes', 'Average Power (W)'));
							};
							drawCharts();
							// Smooth the chart draw with a fadeIn.
							$('.recent .line-chart').hide().velocity('fadeIn').promise().then(function() {
								// Then push the draw function into the redraw charts array.
								dashboard.viewport.redrawCharts.push(drawCharts);
							});
						});
					});
				});
			}
		},
		// Refresh function for the recent view.
		refresh : function() {
			// No bound objects.
		},
		// Object holding the chart options for this view. Returns the options
		// object to be used in chart drawing. Accepts varying titles and yAxis
		// titles.
		chartOptions : function(title, yTitle) {
			return {
				"title" : title,
				legend: { position: 'bottom' },
				interpolateNulls : true,
				vAxes: {
					0: {title: yTitle},
				},
				hAxes: {
					0: {
						title: 'Time',
						// From 5 minutes ago to now.
						viewWindow: {
							min: moment().subtract(5, 'minutes').toDate(),
							max: moment().toDate()
						},
						gridlines: {
							count: -1,
							units: {
								hours: {format: ['HH:mm']}
							}
						},
					}
				}
		 };
	 },
	 // The chart objects.
	 lineChart : {
		 voltage : undefined,
		 current : undefined,
		 power : undefined
	 }
	},
	// Object representing the dashboard overview view.
	overview : {
		partial : undefined,
		// Displays the overview view.
		display: function() {
			// Current view must not be overview already.
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'overview') {
				// Set current view to overview, and style the sidebar button appropriately.
				dashboard.viewport.currentView = 'overview';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.overview').addClass('active');
				console.log('Switching to overview.');

				// Clear the chart redrawing functions.
				dashboard.viewport.redrawCharts.length = 0;

				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty(); // Remove all dashboard viewport children.
					$('.dashboard-viewport').prepend(dashboard.overview.partial); // Add new partial view.
					var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.

					// Data bind the DOM objects.
					dashboard.overview.deviceAlias = $('.overview .device-alias');
					dashboard.overview.quickPower = $('.overview .quick-stats .power .value');
					dashboard.overview.quickVoltage = $('.overview .quick-stats .voltage .value');
					dashboard.overview.quickCurrent = $('.overview .quick-stats .current .value');
					dashboard.overview.quickCost = $('.overview .quick-stats .cost .value');
					dashboard.overview.lastUpdate = $('.overview span.last-update');
					dashboard.overview.lastSubmit = $('.overview span.last-submit');

					dashboard.overview.lineChart = new google.visualization.LineChart($('.overview .overview-line-chart')[0]); // Create new linechart object.
					dashboard.overview.refresh(); // Run the refresh on the current view to update data-bound DOM objects.
					$('.dashboard-viewport .overview').velocity('fadeIn').promise().then(function() {
						// Only draw charts AFTER view has been rendered.
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.overview.chartOptions());
							// Smooth the chart draw with a fadeIn.
							$('.overview .overview-line-chart').hide().velocity('fadeIn').promise().then(function() {
								// Then push the draw function into the redraw charts array.
								dashboard.viewport.redrawCharts.push(function() {
									dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.overview.chartOptions());
								});
							});
						});
					});
				});
			}
		},
		// Object holding the chart options for this view.
		chartOptions : function() {
		 return {
       title: 'Last Minute',
       legend: { position: 'bottom' },
				interpolateNulls : true,
				vAxes: {
         0: {title: 'Value'},
       },
				hAxes: {
         0: {
						title: 'Time',
						viewWindow: {
	            min: moment().subtract(1, 'minute').toDate(),
	            max: moment().toDate()
	          },
						gridlines: {
	            count: -1,
	            units: {
	              minutes: {format: ['mm:ss']}
	            }
	          },
					}
       }
		 };
	 },
	 // Refresh function for the overview view.
		refresh: function() {
			var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.

			// Change the text held in the DOM objects.
			dashboard.overview.deviceAlias.text(dashboard.currentDevice.Device.Alias);
			dashboard.overview.quickPower.text(dashboard.viewport.formatNumber(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value) + ' W');
			dashboard.overview.quickCurrent.text(dashboard.viewport.formatNumber(api.data.Data[deviceId].current[api.data.Data[deviceId].current.length - 1].Value) + ' A');
			dashboard.overview.quickVoltage.text(dashboard.viewport.formatNumber(api.data.Data[deviceId].voltage[api.data.Data[deviceId].voltage.length - 1].Value) + ' V');
			dashboard.overview.quickCost.text('$' + dashboard.viewport.formatMoney(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value * 0.26 * 24 * 30 / 1000));
			dashboard.overview.lastUpdate.text(moment.utc(dashboard.currentDevice.lastAppUpdateTime).local().format('Do MMMM YYYY, h:mm:ss a'));
			if (typeof dashboard.currentDevice.lastDeviceUpdateTime !== "undefined") {
				dashboard.overview.lastSubmit.text(moment.utc(dashboard.currentDevice.lastDeviceUpdateTime).local().format('Do MMMM YYYY, h:mm:ss a'));
			}
			else {
				dashboard.overview.lastSubmit.text("No data.");
			}
		},
		// jQuery Objects for data binding
		quickPower : undefined,
		quickVoltage : undefined,
		quickCurrent : undefined,
		quickCost : undefined,
		lastUpdate : undefined,
		lastSubmit : undefined,
		lineChart : undefined,
		deviceAlias : undefined
	},
	// Various device information about the currently selected device.
	currentDevice : {
		dataTable: {
			data : undefined,
			update : undefined,
			views : {
				voltage : undefined,
				current : undefined,
				power : undefined
			}
		},
		Device : undefined,
		firstDeviceUpdateTime : undefined,
		lastDeviceUpdateTime : undefined,
		lastAppUpdateTime : undefined,
		// Function to clear current device data.
		reset : function() {
			dashboard.currentDevice.Device = undefined;
			dashboard.currentDevice.firstDeviceUpdateTime = undefined;
			dashboard.currentDevice.lastDeviceUpdateTime = undefined;
			dashboard.currentDevice.dataTable = {
				data : undefined,
				update : undefined,
				views : {
					voltage : undefined,
					current : undefined,
					power : undefined
				}
			};
		},
		// Driving function for this application, gets the data from API dynamically.
		getData : function() {
			// Check if current device exists.
			if (typeof dashboard.currentDevice.Device.Id !== 'undefined')
			{
				var successCallback;
				var oData = '';

				// Function to set update time.
				var updateTime = function() {
					dashboard.currentDevice.lastAppUpdateTime = moment();
				};

				// Create new deferred object to hook other functions on to if needed
				// so that they only run when dataTable has updated.
				dashboard.currentDevice.dataTable.update = $.Deferred();
				var sortData = function(deviceId, data) {
					var sortedData = data.sort(function(a,b){
					  // Turn your strings into dates, and then subtract them
					  // to get a value that is either negative, positive, or zero.
					  return new Date(a.Time) - new Date(b.Time);
					});
					if (typeof api.data.Data[deviceId] === 'undefined')
					{
						api.data.Data[deviceId] = {};
					}

					// Function to convert data labels into pretty labels.
					var keyAliasConvert = function (key) {
						switch (key) {
							case "voltage":
							return "RMS Voltage (V)";
							case "current":
							return "Max Current (A)";
							case "power":
							return "Average Power (W)";
							default:
							return key;
						}
					};

					// Sort the data into individual arrays by label.
					sortedData.map(function(currentValue) {
						if (typeof api.data.Data[deviceId][currentValue.Label] === 'undefined') {
							api.data.Data[deviceId][currentValue.Label] = [];
						}

						api.data.Data[deviceId][currentValue.Label].push(currentValue);
					});

					// DataTable construction attempt.
					// Get array of object keys.
					var columnNames = Object.keys(api.data.Data[deviceId]);

					// If there is no existing data tables for the current device, create one.
					if (typeof dashboard.currentDevice.dataTable.data === "undefined") {
						var dataTable = new google.visualization.DataTable();

						dashboard.currentDevice.dataTable.data = dataTable;

						// Add the time column first.
						dataTable.addColumn({
							type:'date',
							role:'domain',
							label: 'Time'
						});

						// Use 4 s.f. format.
						var numberFormat = new google.visualization.NumberFormat({pattern:'@####'});

						// Add each key value from the data set from API.
						columnNames.map(function(currentValue, index) {
							dataTable.addColumn({
								type:'number',
								role:'data',
								label : keyAliasConvert(currentValue)
							});

							numberFormat.format(dataTable, index + 1);
						});
					}

					// Build the rows to add to the DataTable.
					sortedData.map(function(dataValue) {
						var row = [];
						// Convert the UTC JSON time to local JS DateTime.
						row[0] = moment.utc(dataValue.Time).local().toDate();

						// Match the column name with the data label and push it under the
						// enumerated index to the row array.
						columnNames.map(function(columnName, index) {
							if (dataValue.Label === columnName) {
								row.push(dataValue.Value);
							}
							else {
								row.push(null);
							}
						});

						// Add the row to the table.
						dashboard.currentDevice.dataTable.data.addRow(row);
					});

					// Sort all values by time.
					dashboard.currentDevice.dataTable.data.sort([{column: 0}]);

					// Build the DataViews.
					Object.keys(dashboard.currentDevice.dataTable.views).map(function(currentValue) {
						// If the view doesn't exist, create one from the DataTable.
						if (typeof dashboard.currentDevice.dataTable.views[currentValue] === 'undefined') {
							dashboard.currentDevice.dataTable.views[currentValue] = new google.visualization.DataView(dashboard.currentDevice.dataTable.data);
						}
						var viewColumnCount =  dashboard.currentDevice.dataTable.views[currentValue].getNumberOfColumns();
						var columnIndexes = [];

						// For each column, check if it's the label we want, otherwise add
						// it to the column indexes for removal. Each DataView should only
						// have time and another label column.
						for (var i = 1; i < viewColumnCount; i++) {
							if (dashboard.currentDevice.dataTable.views[currentValue].getColumnLabel(i) !== keyAliasConvert(currentValue)) {
								columnIndexes.push(i);
							}
						}
						// Hide the marked columns from the view.
						dashboard.currentDevice.dataTable.views[currentValue].hideColumns(columnIndexes);
					});

					// Mark promise as resolved.
					dashboard.currentDevice.dataTable.update.resolve(dashboard.currentDevice.dataTable.data);
					// End DataTable construction attempt.
				};

				var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.

				// Specify the callbacks for the not-previously-run state and the
				// has-run states.
				if (typeof api.data.Data[deviceId] === 'undefined') {
					// getData Initial Run.
					api.notify(
						'Devices',
						'Getting data for ' + dashboard.currentDevice.Device.Alias + '.',
						'info'
					);

					// On success.
					successCallback = function(r) {
						// Display notice.
						api.notify(
	            'Devices',
	            'Successfully retrieved data for '+ dashboard.currentDevice.Device.Alias + '. Data will automatically update every 5 seconds.',
	            'success'
	          );
						// Sort the data retrieved by date.
						sortData(deviceId, r);

						// If we got some data, then update the device submission stats.
						if (r.length > 0) {
							dashboard.currentDevice.lastDeviceUpdateTime = r[r.length - 1].Time;
							dashboard.currentDevice.firstDeviceUpdateTime = r[0].Time;
						}

						// Update the current app data retrival time.
						updateTime();

						// If there is an update schedule.
						if (typeof dashboard.viewport.schedule !== 'undefined') {
							clearInterval(dashboard.viewport.schedule);
						}

						// Add a new data update schedule for every 5000 ms.
						dashboard.viewport.schedule = setInterval(function() {
							dashboard.currentDevice.getData()
							.then(function() {
								dashboard.viewport.refresh();
								dashboard.viewport.redrawCharts.forEach(function(actions) {
									actions();
								});
							});
						}, 5000);

						return r;
					};
				}
				// If getData() has run before for the device.
				else {
					// On success.
					successCallback = function(r) {
						var deviceId = String(dashboard.currentDevice.Device.Id); // Convenience variable.

						// Sort the data retrieved by date.
						sortData(deviceId, r);

						// If we got some data, then update the device submission stats.
						if (r.length > 0) {
							dashboard.currentDevice.lastDeviceUpdateTime = r[r.length - 1].Time;
							if (typeof dashboard.currentDevice.firstDeviceUpdateTime === 'undefined') {
								dashboard.currentDevice.firstDeviceUpdateTime = r[0].Time;
							}
						}

						// Update the current app data retrival time.
						updateTime();

						return r;
					};
				}

				// If the device has a last update time, then set the OData object to
				// use this parameter to only get new data.
				if (typeof dashboard.currentDevice.lastDeviceUpdateTime !== 'undefined') {
					oData = {
						filter : 'Time gt DateTime\'' + dashboard.currentDevice.lastDeviceUpdateTime + '\''
					};
				}

				// Return deferred object.
				return api.get.Data(dashboard.currentDevice.Device, oData)
				.then(successCallback, function(r) {
					// On failure.
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
				// On failure.
				api.notify(
          'Application',
          'An unknown error has occured, please contact the developer and restart the application.',
          'alert'
        );
			}
		}
	},
	// Function to run to clear relevant data for next user.
	signOut : function() {
		dashboard.viewport.currentView = undefined;
		dashboard.viewport.redrawCharts.length = 0;
		dashboard.currentDevice.reset();
		Object.keys(api.data).map(function(currentValue) {
			store.remove(currentValue);
		});
		if (typeof dashboard.viewport.schedule !== 'undefined') {
			clearInterval(dashboard.viewport.schedule);
		}
	},
};
