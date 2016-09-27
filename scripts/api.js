var api = {
  base : "http://smart-energy-server.azurewebsites.net/api/",
  routes : {
    Users : function(s) {
      if ((typeof s) === "string") {
        return api.base + "Users/Username/" + s;
      }
      else if ((typeof s) === "number") {
        return api.base + "Users/" + String(s);
      }
    },
    Devices : function(s) {
      if ((typeof s) === "object" && s !== null) {
        return api.base + "Devices/User/" + String(s.Id);
      }
      else if ((typeof s) === "number") {
        return api.base + "Devices/" + String(s);
      }
    }
  },
  get : {
    Users : function(s) {
      return $.get(api.routes.Users(s));
    },
    Devices : function(s) {
      return $.get(api.routes.Devices(s));
    }
  },
  data : {
    User : {},
    Devices : {},
    Data : {}
  }
};
