define("resource",
["store2"],
function(store) {
  var resource = {
    username : {
      get: function() {
        store.get("username");
      },
      set: function(username) {
        store.set("username", username);
      }
    }
  };
  return resource;
});
