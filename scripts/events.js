// Document Ready Event
var events = {
	appStart: function() {
	  if (login.isLoggedIn()) {
		login.toDashboard();
		dashboard.display();
	  }
	  else {
		login.display();
	  }
	  console.log('App started.');
	}
};

$(function() {
	events.appStart();
});