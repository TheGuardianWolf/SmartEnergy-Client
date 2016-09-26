define.amd.jQuery = true;
require("normalize.css/normalize.css");
require("metro-dist/css/metro.css");
require("metro-dist/css/metro-colors.css");
require("metro-dist/css/metro-icons.css");
require("metro-dist/css/metro-schemes.css");
require("metro-dist/css/metro-responsive.css");
require("./app.scss");

require("metro-dist/js/metro");

require(["./scripts/events"], function(events) {
  $(function() {
    events.appStart();
  });
});
