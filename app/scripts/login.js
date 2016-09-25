var Login = {
  display : function() {
    $('#login').velocity('fadeIn');
  },
  isLoggedIn : function() {
    if (username) {
      return true;
    }
    return false;
  },
  saveUsername : function() {
    username = $('#login-form input[name="username"]').val();
    store.set('username', username);
  },
  toDashboard : function() {
    $('#dashboard .app-bar-element .dropdown-toggle .username').text(username);
    $('#login').velocity('fadeOut').promise().done(function() {
      $('#dashboard').velocity('fadeIn');
    });
  },
  verify : function() {
    return true;
  },
  signOut : function() {
    store.set('username', false);
    $('#dashboard').velocity('fadeOut').promise().done(function() {
      $('#login').velocity('fadeIn');
    });
  }
};
