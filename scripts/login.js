var login = {
  partial : undefined,
  display : function() {
    console.log("Switching to login.");
    $(".viewport").children().velocity("fadeOut").promise().then(function() {
      $(".viewport").prepend(Mustache.render(login.partial, api));
      events.setLoginEventHandlers();
      $("#login").velocity("fadeIn");
    });
  },
  getUsernameFromForm : function() {
    api.data.User.Username = $("#login-form input[name=\"username\"]").val();
    return api.data.User.Username;
  },
  isLoggedIn : function() {
    if (typeof api.data.User.Username === "string") {
      return true;
    }
    return false;
  },
  toDashboard : function() {
    return api.get.Users(api.data.User.Username)
    .then(function(r) {
      api.data.User = r[0];
      store.set("User", r[0]);

      return api.get.Devices(api.data.User)
      .then(function(r) {
        api.data.Devices = r;
        store.set("Devices", r);
        return r;
      },
      function(r) {
        console.log(r);
        return $.Deferred().reject("requestDevice").promise();
      });
    },
    function(r) {
      console.log(r);
      return $.Deferred().reject("requestUser").promise();
    });
  }
};
