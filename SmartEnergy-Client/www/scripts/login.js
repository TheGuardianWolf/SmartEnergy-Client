var login = {
  partial : undefined,
  // Display function for when transitioning to the login screen.
  display : function() {
    console.log('Switching to login.');
    $('.viewport').children().velocity('fadeOut').promise().then(function() {
      $('.viewport').empty();
      $('.viewport').prepend(Mustache.render(login.partial, api)); // Use Moustache to render template.
      events.setLoginEventHandlers(); // Attach the event handlers to the view.
      $('#login').velocity('fadeIn'); // Reveal the view.
    });
  },
  // Function to retrieve the user entered username and set it to API user username.
  getUsernameFromForm : function() {
    api.data.User.Username = $('#login-form input[name="username"]').val();
    return api.data.User.Username;
  },
  // Check if user is logged in.
  isLoggedIn : function() {
    if (typeof api.data.User.Username === 'string') {
      return true;
    }
    return false;
  },
  // Transition to the dashboard.
  toDashboard : function() {
    api.notify(
      'Authentication',
      'Contacting the server to get user details.',
      'info'
    );

    // Returns deferred object.
    return api.get.Users(api.data.User.Username)
    .then(function(r) {
      // On success
      // Set text box classes.
      $('#login-form input[name="username"]').removeClass('error');
      $('#login-form input[name="username"]').addClass('success');
      api.notify(
        'Authentication',
        'Successfully retrieved user details.',
        'success'
      );

      // If the user is retrieved, get the devices for the user.
      if (r.length === 1) {
        api.data.User = r[0];
        store.set('User', r[0]); // Save user in storage.
        api.notify(
          'Devices',
          'Contacting the server to get device list.',
          'info'
        );
        // Returned deferred object.
        return api.get.Devices(api.data.User)
        .then(function(r) {
          api.notify(
            'Devices',
            'Successfully retrieved device list.',
            'success'
          );
          api.data.Devices = r;
          store.set('Devices', r); // Save devices in storage.
          return r;
        },
        // On fail.
        function(r) {
          api.notify(
            'Devices',
            'Error retrieving devices. Please restart the app. Server response: ' + String(r.status) + '.',
            'warning'
          );
          return $.Deferred().reject('requestDevice').promise();
        });
      }
      // On unknown error.
      else {
        api.notify(
          'Application',
          'An unknown error has occured, please contact the developer and restart the application.',
          'alert'
        );
        return $.Deferred().reject('requestUser').promise();
      }

    },
    // On fail.
    function(r) {
      // Show failure highlighting on text box.
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
