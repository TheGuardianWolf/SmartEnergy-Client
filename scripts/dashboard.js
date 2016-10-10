var dashboard = {
	partial : undefined,
	display : function() {
	  console.log('Switching to dashboard.');
	  $('.viewport').children().velocity('fadeOut').promise().then(function() {
			$('.viewport').empty();
			console.log(api.data.Devices);
			$('.viewport').prepend(Mustache.render(dashboard.partial, api));
			events.setDashboardEventHandlers();
			$('#dashboard').velocity('fadeIn');
	  });
	},
	viewport : {
		refresh : function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			if (typeof dashboard.viewport.currentView === 'undefined')
			{
				$('.dashboard .sidebar .current .counter').text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + ' W');
				dashboard.overview.display();
			}
			else {
				$('.dashboard .sidebar .current .counter').text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + ' W');
				dashboard[dashboard.viewport.currentView].refresh();
			}
		},
		currentView : undefined,
		schedule : undefined,
		redrawCharts : [],
	},
	history : {
		partial : undefined,
		display : function() {
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'history') {
				dashboard.viewport.currentView = 'history';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.history').addClass('active');
				console.log('Switching to history.');
				dashboard.viewport.redrawCharts.length = 0;
				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty();
					$('.dashboard-viewport').prepend(dashboard.history.partial);
					var deviceId = String(dashboard.currentDevice.Device.Id);
					dashboard.history.lineChart = new google.visualization.LineChart($('.history .history-line-chart')[0]);
					dashboard.history.refresh();
					$('.dashboard-viewport .history').velocity('fadeIn').promise().then(function() {
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.history.chartOptions());
							$('.history .history-line-chart').hide().velocity('fadeIn').promise().then(function() {
								dashboard.viewport.redrawCharts.push(function() {
									dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.history.chartOptions());
								});
							});
						});
					});
				});
			}
		},
		refresh : function() {

		},
		chartOptions : function() {
			return {
        title: 'All Recorded Data',
        curveType: 'function',
        legend: { position: 'bottom' },
 				interpolateNulls : true,
 				vAxes: {
          0: {title: 'Value'},
        },
 				hAxes: {
          0: {
 						title: 'Time',
 						viewWindow: {
 	            min: (typeof dashboard.currentDevice.firstDeviceUpdateTime !== "undefined") ? moment(dashboard.currentDevice.firstDeviceUpdateTime).toDate() : moment().subtract(1, 'year').toDate(),
 	            max: (typeof dashboard.currentDevice.firstDeviceUpdateTime !== "undefined") ? moment(dashboard.currentDevice.lastDeviceUpdateTime).toDate() : moment().toDate()
 	          },
 					}
        }
 		 };
	 },
	 lineChart : undefined
	},
	current : {
		partial : undefined,
		display : function() {
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'current') {
				dashboard.viewport.currentView = 'current';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.current').addClass('active');
				console.log('Switching to current.');
				dashboard.viewport.redrawCharts.length = 0;
				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty();
					$('.dashboard-viewport').prepend(dashboard.current.partial);
					var deviceId = String(dashboard.currentDevice.Device.Id);
					dashboard.current.lineChart.voltage = new google.visualization.LineChart($('.current .voltage-line-chart')[0]);
					dashboard.current.lineChart.current = new google.visualization.LineChart($('.current .current-line-chart')[0]);
					dashboard.current.lineChart.power = new google.visualization.LineChart($('.current .power-line-chart')[0]);
					dashboard.current.refresh();
					$('.dashboard-viewport .current').velocity('fadeIn').promise().then(function() {
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							var drawCharts = function() {
								dashboard.current.lineChart.voltage.draw(dashboard.currentDevice.dataTable.views.voltage, dashboard.current.chartOptions('RMS Voltage in Last Hour', 'RMS Voltage (V)'));
								dashboard.current.lineChart.current.draw(dashboard.currentDevice.dataTable.views.current, dashboard.current.chartOptions('Max Current in Last Hour', 'Max Current (A)'));
								dashboard.current.lineChart.power.draw(dashboard.currentDevice.dataTable.views.power, dashboard.current.chartOptions('Average Power in Last Hour', 'Average Power (W)'));
							};
							drawCharts();
							$('.current  .line-chart').hide().velocity('fadeIn').promise().then(function() {
								dashboard.viewport.redrawCharts.push(drawCharts);
							});
						});
					});
				});
			}
		},
		refresh : function() {

		},
		chartOptions : function(title, yTitle) {
			return {
				"title" : title,
				curveType: 'function',
				legend: { position: 'bottom' },
				interpolateNulls : true,
				vAxes: {
					0: {title: yTitle},
				},
				hAxes: {
					0: {
						title: 'Time',
						viewWindow: {
							min: moment().subtract(1, 'hours').toDate(),
							max: moment().toDate()
						},
					}
				}
		 };
	 },
	 lineChart : {
		 voltage : undefined,
		 current : undefined,
		 power : undefined
	 }
	},
	overview : {
		partial : undefined,
		display: function() {
			if (typeof dashboard.currentDevice.Device !== 'undefined' && dashboard.viewport.currentView !== 'overview') {
				dashboard.viewport.currentView = 'overview';
				$('.dashboard .sidebar li').removeClass('active');
				$('.dashboard .sidebar li.overview').addClass('active');
				console.log('Switching to overview.');
				dashboard.viewport.redrawCharts.length = 0;
				$('.dashboard-viewport').children().velocity('fadeOut').promise().then(function() {
					$('.dashboard-viewport').empty();
					$('.dashboard-viewport').prepend(dashboard.overview.partial);
					var deviceId = String(dashboard.currentDevice.Device.Id);
					dashboard.overview.deviceAlias = $('.overview .device-alias');
					dashboard.overview.quickPower = $('.overview .quick-stats .power .value');
					dashboard.overview.quickVoltage = $('.overview .quick-stats .voltage .value');
					dashboard.overview.quickCurrent = $('.overview .quick-stats .current .value');
					dashboard.overview.lastUpdate = $('.overview span.last-update');
					dashboard.overview.lastSubmit = $('.overview span.last-submit');
					dashboard.overview.lineChart = new google.visualization.LineChart($('.overview .overview-line-chart')[0]);
					dashboard.overview.refresh();
					$('.dashboard-viewport .overview').velocity('fadeIn').promise().then(function() {
						dashboard.currentDevice.dataTable.update.promise().then(function() {
							dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.overview.chartOptions());
							$('.overview .overview-line-chart').hide().velocity('fadeIn').promise().then(function() {
								dashboard.viewport.redrawCharts.push(function() {
									dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data, dashboard.overview.chartOptions());
								});
							});
						});
					});
				});
			}
		},
		chartOptions : function() {
		 return {
       title: 'Last Hour',
       curveType: 'function',
       legend: { position: 'bottom' },
				interpolateNulls : true,
				vAxes: {
         0: {title: 'Value'},
       },
				hAxes: {
         0: {
						title: 'Time',
						viewWindow: {
	            min: moment().subtract(1, 'hour').toDate(),
	            max: moment().toDate()
	          },
						gridlines: {
	            count: -1,
	            units: {
	              hours: {format: ['HH:mm', 'ha']}
	            }
	          },
						minorGridlines: {
             units : {
								hours: {format: ['hh:mm:ss a', 'ha']},
								minutes: {
									format: [':mm']
								}
							}
	          }
					}
       }
		 };
	 },
		refresh: function() {
			var deviceId = String(dashboard.currentDevice.Device.Id);
			dashboard.overview.deviceAlias.text(dashboard.currentDevice.Device.Alias);
			dashboard.overview.quickPower.text(api.data.Data[deviceId].power[api.data.Data[deviceId].power.length - 1].Value + ' W');
			dashboard.overview.quickCurrent.text(api.data.Data[deviceId].current[api.data.Data[deviceId].current.length - 1].Value + ' A');
			dashboard.overview.quickVoltage.text(api.data.Data[deviceId].voltage[api.data.Data[deviceId].voltage.length - 1].Value + ' V');
			dashboard.overview.lastUpdate.text(moment(dashboard.currentDevice.lastAppUpdateTime).format('Do MMMM YYYY, h:mm:ss a'));
			if (typeof dashboard.currentDevice.lastDeviceUpdateTime !== "undefined") {
				dashboard.overview.lastSubmit.text(moment(dashboard.currentDevice.lastDeviceUpdateTime).format('Do MMMM YYYY, h:mm:ss a'));
			}
			else {
				dashboard.overview.lastSubmit.text("No data.");
			}
		},
		// jQuery Objects for data binding
		quickPower : undefined,
		quickVoltage : undefined,
		quickCurrent : undefined,
		lastUpdate : undefined,
		lastSubmit : undefined,
		lineChart : undefined,
		deviceAlias : undefined
	},
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
					var sortedData = data.sort(function(a,b){
					  // Turn your strings into dates, and then subtract them
					  // to get a value that is either negative, positive, or zero.
					  return new Date(a.Time) - new Date(b.Time);
					});
					if (typeof api.data.Data[deviceId] === 'undefined')
					{
						api.data.Data[deviceId] = {};
					}

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

					sortedData.map(function(currentValue) {
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
							role:'domain',
							label: 'Time'
						});

						columnNames.map(function(currentValue) {
							dataTable.addColumn({
								type:'number',
								role:'data',
								label : keyAliasConvert(currentValue)
							});
						});
					}

					sortedData.map(function(dataValue) {
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

						dashboard.currentDevice.dataTable.data.addRow(row);
					});

					dashboard.currentDevice.dataTable.data.sort([{column: 0}]);

					Object.keys(dashboard.currentDevice.dataTable.views).map(function(currentValue) {
						if (typeof dashboard.currentDevice.dataTable.views[currentValue] === 'undefined') {
							dashboard.currentDevice.dataTable.views[currentValue] = new google.visualization.DataView(dashboard.currentDevice.dataTable.data);
						}
						var viewColumnCount =  dashboard.currentDevice.dataTable.views[currentValue].getNumberOfColumns();
						var rowIndexes;
						var columnIndexes = [];
						for (var i = 1; i < viewColumnCount; i++) {
							if (dashboard.currentDevice.dataTable.views[currentValue].getColumnLabel(i) !== keyAliasConvert(currentValue)) {
								columnIndexes.push(i);
							}
						}
						dashboard.currentDevice.dataTable.views[currentValue].hideColumns(columnIndexes);
						rowIndexes = dashboard.currentDevice.dataTable.views[currentValue].getFilteredRows([{column: 1, value: null}]);
						dashboard.currentDevice.dataTable.views[currentValue].hideRows(rowIndexes);
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

						if (r.length > 0) {
							dashboard.currentDevice.lastDeviceUpdateTime = r[r.length - 1].Time;
							dashboard.currentDevice.firstDeviceUpdateTime = r[0].Time;
						}

						updateTime();

						if (typeof dashboard.viewport.schedule !== 'undefined') {
							clearInterval(dashboard.viewport.schedule);
						}
						dashboard.viewport.schedule = setInterval(function() {
							dashboard.currentDevice.getData()
							.then(function() {
								dashboard.viewport.refresh();
								dashboard.viewport.redrawCharts.forEach(function(actions) {
									actions();
								});
							});
						}, 30000);

						return r;
					};
				}
				else {
					successCallback = function(r) {
						var deviceId = String(dashboard.currentDevice.Device.Id);
						sortData(deviceId, r);

						if (r.length > 0) {
							dashboard.currentDevice.lastDeviceUpdateTime = r[r.length - 1].Time;
							if (typeof dashboard.currentDevice.firstDeviceUpdateTime === 'undefined') {
								dashboard.currentDevice.firstDeviceUpdateTime = r[0].Time;
							}
						}

						updateTime();
						return r;
					};
				}

				if (typeof dashboard.currentDevice.lastDeviceUpdateTime !== 'undefined') {
					oData = {
						filter : 'Time gt DateTime\'' + dashboard.currentDevice.lastDeviceUpdateTime + '\''
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
		Object.keys(api.data).map(function(currentValue) {
			store.remove(currentValue);
		});
		if (typeof dashboard.viewport.schedule !== 'undefined') {
			clearInterval(dashboard.viewport.schedule);
		}
	},
};
