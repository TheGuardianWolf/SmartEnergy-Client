// Document Ready Event
define("events",
["./login", "./dashboard"],
function(login, dashboard) {
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
  return events;
});
