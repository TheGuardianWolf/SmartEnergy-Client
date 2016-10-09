var api = {
  base : "https://smart-energy-server.azurewebsites.net/api/",
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
    },
    Data : function(s, oData) {
      if ((typeof s) === "object" && s !== null) {
        var oDataString = "";
        if ((typeof oData) === "object" && s !== null) {

        }
        return api.base + "Data/Device/" + String(s.Id) + oDataString;
      }
      else if ((typeof s) === "number") {
        return api.base + "Data/" + String(s);
      }
    }
  },
  get : {
    Users : function(s) {
      return $.get(api.routes.Users(s));
    },
    Devices : function(s) {
      return $.get(api.routes.Devices(s));
    },
    Data : function(s, oData) {
      return $.get(api.routes.Data(s, oData));
    }
  },
  data : {
    User : {},
    Devices : {},
    Data : {}
  },
  notify : function(caption, content, type) {
    if (typeof $.Notify !== "undefined")
    {
      $.Notify({
        "caption" : caption,
        "content" : content,
        "type" : type,
        "timeout" : 5000
      });
    }
  }
};
