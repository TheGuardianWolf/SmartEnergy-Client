var dashboard = {
	display: function() {
	  console.log("Switching to dashboard.");
	  $(".viewport").children().velocity("fadeOut").promise().then(function() {
		$("#dashboard .app-bar-element .dropdown-toggle .username").text(username);
		dashboard.setEventsHandler();
		$("#dashboard").velocity("fadeIn");
	  });
	},
	signOut: function() {
	  store.set("username", false);
	},
	setEventsHandler: function() {
	  $("#sign-out").click(function(event) {
		event.preventDefault();
		dashboard.signOut();
		login.display();
	  });
	}
};
