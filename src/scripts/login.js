var dashboard = require("./dashboard");
define("login",
["velocity-animate", "store2", "./resource", "../partials/login.part.html"],
function (velocity, store, resource, loginPartial) {
  var login = {
    partial : loginPartial,
    display : function() {
      console.log("Switching to login.");
      $(".viewport").children().velocity("fadeOut").promise().then(function() {
        $(".viewport").empty();
        $(".viewport").prepend(login.partial);
        login.setEventsHandler();
        $("#login").velocity("fadeIn");
      });
    },
    isLoggedIn : function() {
      if (resource.username.get()) {
        return true;
      }
      return false;
    },
    saveUsername : function() {
      username = $("#login-form input[name=\"username\"]").val();
      resource.username.set(username);
    },
    verify : function() {
      return true;
    },
    setEventsHandler: function() {
      $("#login-form").submit(function(event) {
        event.preventDefault();
        login.saveUsername();
        dashboard.display();
      });
    }
  };
  return login;
});
