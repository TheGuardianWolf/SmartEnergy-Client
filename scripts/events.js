// Document Ready Event
$(function() {
  // Check if already logged in
  if (Login.isLoggedIn) {
    Login.toDashboard();
  }
  else {
    Login.display();
  }

  // Attach event handler to login form
  $('#login-form').submit(function(event) {
    event.preventDefault();
    Login.saveUsername();
    Login.toDashboard();
  });

  $('#sign-out').click(function(event) {
    event.preventDefault();
    Login.signOut();
  });
});
