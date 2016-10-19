// Object containing API routes and definitions.
var api = {
  base : 'https://smart-energy-server.azurewebsites.net/api/',
  routes : {
    // API route to retrieve users.
    Users : function(s) {
      // Search by username.
      if ((typeof s) === 'string') {
        return api.base + 'Users/Username/' + s;
      }
      // Search by user id.
      else if ((typeof s) === 'number') {
        return api.base + 'Users/' + String(s);
      }
    },
    // API route to retrieve devices.
    Devices : function(s) {
      // Search by user.
      if ((typeof s) === 'object' && s !== null) {
        return api.base + 'Devices/User/' + String(s.Id);
      }
      // Search by device ID.
      else if ((typeof s) === 'number') {
        return api.base + 'Devices/' + String(s);
      }
    },
    // API route to retrieve data.
    Data : function(s, oData) {
      // Search by device.
      if ((typeof s) === 'object' && s !== null) {
        var oDataString = '';
        if ((typeof oData) === 'object' && s !== null) {
          // Extract the OData parameters from the oData object.
          Object.keys(oData).map(function(currentValue) {
            if (oDataString === '') {
              oDataString += '?';
            }
            // Append to the string to be sent.
            oDataString += '$' + currentValue + '=' + String(oData[currentValue]);
          });
        }
        return api.base + 'Data/Device/' + String(s.Id) + oDataString;
      }
      // Search by data ID.
      else if ((typeof s) === 'number') {
        return api.base + 'Data/' + String(s);
      }
    }
  },
  // Wrapper get functions for API communication.
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
  // Data storage for returning API data.
  data : {
    User : {},
    Devices : {},
    Data : {}
  },
  // API access notification system wrapper.
  notify : function(caption, content, type) {
    if (typeof $.Notify !== 'undefined')
    {
      $.Notify({
        'caption' : caption,
        'content' : content,
        'type' : type,
        'timeout' : 5000
      });
    }
  }
};
