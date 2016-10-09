var login = {
  partial : undefined,
  display : function() {
    console.log('Switching to login.');
    $('.viewport').children().velocity('fadeOut').promise().then(function() {
      $('.viewport').empty();
      $('.viewport').prepend(Mustache.render(login.partial, api));
      events.setLoginEventHandlers();
      $('#login').velocity('fadeIn');
    });
  },
  getUsernameFromForm : function() {
    api.data.User.Username = $('#login-form input[name="username"]').val();
    return api.data.User.Username;
  },
  isLoggedIn : function() {
    if (typeof api.data.User.Username === 'string') {
      return true;
    }
    return false;
  },
  toDashboard : function() {
    api.notify(
      'Authentication',
      'Contacting the server to get user details.',
      'info'
    );
    return api.get.Users(api.data.User.Username)
    .then(function(r) {
      $('#login-form input[name="username"]').removeClass('error');
      $('#login-form input[name="username"]').addClass('success');
      api.notify(
        'Authentication',
        'Successfully retrieved user details.',
        'success'
      );
      if (r.length === 1) {
        api.data.User = r[0];
        store.set('User', r[0]);
        api.notify(
          'Devices',
          'Contacting the server to get device list.',
          'info'
        );
        return api.get.Devices(api.data.User)
        .then(function(r) {
          api.notify(
            'Devices',
            'Successfully retrieved device list.',
            'success'
          );
          api.data.Devices = r;
          store.set('Devices', r);
          return r;
        },
        function(r) {
          api.notify(
            'Devices',
            'Error retrieving devices. Please restart the app. Server response: ' + String(r.status) + '.',
            'warning'
          );
          return $.Deferred().reject('requestDevice').promise();
        });
      }
      else {
        api.notify(
          'Application',
          'An unknown error has occured, please contact the developer and restart the application.',
          'alert'
        );
        return $.Deferred().reject('requestUser').promise();
      }

    },
    function(r) {
      $('#login-form input[name="username"]').removeClass('success');
      $('#login-form input[name="username"]').addClass('error');
      api.notify(
        'Authentication',
        'Error verifying username. Server response: ' + String(r.status) + '.',
        'warning'
      );
      return $.Deferred().reject('requestUser').promise();
    });
  }
};
