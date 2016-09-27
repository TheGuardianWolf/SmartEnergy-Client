var dashboard = {
	partial : undefined,
	display : function() {
	  console.log("Switching to dashboard.");
	  $(".viewport").children().velocity("fadeOut").promise().then(function() {
		$(".viewport").prepend(Mustache.render(dashboard.partial, api));
		events.setDashboardEventHandlers();
		$("#dashboard").velocity("fadeIn");
	  });
	},
	currentDevice : {},
	signOut : function() {
		for (var key in api.data) {
			if (api.data.hasOwnProperty(key)) {
				store.remove(key);
			}
		}
	},
};
