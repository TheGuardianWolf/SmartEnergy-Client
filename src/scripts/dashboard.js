var login = require("./login");
define("dashboard",
["velocity-animate", "store2", "./resource", "../partials/dashboard.part.html"],
function (velocity, store, resource, dashboardPartial) {
  var dashboard = {
    partial: dashboardPartial,
    display: function() {
      console.log("Switching to dashboard.");
      $(".viewport").children().velocity("fadeOut").promise().then(function() {
        $(".viewport").empty();
        $(".viewport").prepend(dashboard.partial);
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
  return dashboard;
});
