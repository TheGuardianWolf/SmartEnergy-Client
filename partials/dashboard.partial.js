dashboard.partial="";
dashboard.partial += "<!-- Dashboard view -->";
dashboard.partial += "<div id=\"dashboard\" class=\"dashboard page-content\">";
dashboard.partial += "  <div class=\"app-bar fixed-top\" data-role=\"appbar\">";
dashboard.partial += "    <a class=\"app-bar-element branding\">SmartEnergy<\/a>";
dashboard.partial += "";
dashboard.partial += "    <span class=\"app-bar-divider\"><\/span>";
dashboard.partial += "    <ul class=\"app-bar-menu\">";
dashboard.partial += "      <li class=\"device-list\">";
dashboard.partial += "        <a href=\"\" class=\"dropdown-toggle\">Devices<\/a>";
dashboard.partial += "        <ul class=\"d-menu\" data-role=\"dropdown\">";
dashboard.partial += "          {{#data.Devices}}";
dashboard.partial += "          <li><a href=\"\" data-device-id=\"{{Id}}\">{{Alias}}<\/a><\/li>";
dashboard.partial += "          {{\/data.Devices}}";
dashboard.partial += "        <\/ul>";
dashboard.partial += "      <\/li>";
dashboard.partial += "    <\/ul>";
dashboard.partial += "";
dashboard.partial += "    <div class=\"app-bar-element place-right\">";
dashboard.partial += "      <span class=\"dropdown-toggle\"><span class=\"mif-cog\"><\/span><span class=\"username\">{{data.User.Username}}<\/span><\/span>";
dashboard.partial += "      <div class=\"app-bar-drop-container padding10 place-right no-margin-top block-shadow fg-dark\" data-role=\"dropdown\" data-no-close=\"true\" style=\"width: 220px\">";
dashboard.partial += "        <h2 class=\"text-light\">Quick settings<\/h2>";
dashboard.partial += "        <ul class=\"unstyled-list fg-dark\">";
dashboard.partial += "          <li><a href=\"\" id=\"sign-out\" class=\"fg-white1 fg-hover-yellow\">Sign Out<\/a><\/li>";
dashboard.partial += "        <\/ul>";
dashboard.partial += "      <\/div>";
dashboard.partial += "    <\/div>";
dashboard.partial += "  <\/div>";
dashboard.partial += "";
dashboard.partial += "  <div class=\"page-content\">";
dashboard.partial += "    <div class=\"flex-grid no-responsive-future\" style=\"height: 100%;\">";
dashboard.partial += "      <div class=\"row\" style=\"height: 100%\">";
dashboard.partial += "        <div class=\"cell size-x200\" id=\"cell-sidebar\" style=\"background-color: #71b1d1; height: 100%\">";
dashboard.partial += "          <ul class=\"sidebar\">";
dashboard.partial += "              <li class=\"overview\" data-view=\"overview\"><a href=\"#\">";
dashboard.partial += "                  <span class=\"mif-apps icon\"><\/span>";
dashboard.partial += "                  <span class=\"title\">Overview<\/span>";
dashboard.partial += "              <\/a><\/li>";
dashboard.partial += "              <li class=\"current\" data-view=\"current\"><a href=\"#\">";
dashboard.partial += "                  <span class=\"mif-vpn-publ icon\"><\/span>";
dashboard.partial += "                  <span class=\"title\">Current Usage<\/span>";
dashboard.partial += "                  <span class=\"counter\">0<\/span>";
dashboard.partial += "              <\/a><\/li>";
dashboard.partial += "              <li class=\"history\" data-view=\"history\"><a href=\"#\">";
dashboard.partial += "                  <span class=\"mif-drive-eta icon\"><\/span>";
dashboard.partial += "                  <span class=\"title\">History<\/span>";
dashboard.partial += "              <\/a><\/li>";
dashboard.partial += "          <\/ul>";
dashboard.partial += "      <\/div>";
dashboard.partial += "        <div class=\"cell auto-size padding20 bg-white\" id=\"cell-content\">";
dashboard.partial += "          <div class=\"dashboard-viewport\">";
dashboard.partial += "          <h1 class=\"text-light block\">Select a device<\/h1>";
dashboard.partial += "          <\/div>";
dashboard.partial += "        <\/div>";
dashboard.partial += "      <\/div>";
dashboard.partial += "    <\/div>";
dashboard.partial += "  <\/div>";
dashboard.partial += "<\/div>";
dashboard.partial += "<!-- End Dashboard view -->";

/*
<!-- Dashboard view -->
<div id="dashboard" class="dashboard page-content">
  <div class="app-bar fixed-top" data-role="appbar">
    <a class="app-bar-element branding">SmartEnergy</a>

    <span class="app-bar-divider"></span>
    <ul class="app-bar-menu">
      <li class="device-list">
        <a href="" class="dropdown-toggle">Devices</a>
        <ul class="d-menu" data-role="dropdown">
          {{#data.Devices}}
          <li><a href="" data-device-id="{{Id}}">{{Alias}}</a></li>
          {{/data.Devices}}
        </ul>
      </li>
    </ul>

    <div class="app-bar-element place-right">
      <span class="dropdown-toggle"><span class="mif-cog"></span><span class="username">{{data.User.Username}}</span></span>
      <div class="app-bar-drop-container padding10 place-right no-margin-top block-shadow fg-dark" data-role="dropdown" data-no-close="true" style="width: 220px">
        <h2 class="text-light">Quick settings</h2>
        <ul class="unstyled-list fg-dark">
          <li><a href="" id="sign-out" class="fg-white1 fg-hover-yellow">Sign Out</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="page-content">
    <div class="flex-grid no-responsive-future" style="height: 100%;">
      <div class="row" style="height: 100%">
        <div class="cell size-x200" id="cell-sidebar" style="background-color: #71b1d1; height: 100%">
          <ul class="sidebar">
              <li class="overview" data-view="overview"><a href="#">
                  <span class="mif-apps icon"></span>
                  <span class="title">Overview</span>
              </a></li>
              <li class="current" data-view="current"><a href="#">
                  <span class="mif-vpn-publ icon"></span>
                  <span class="title">Current Usage</span>
                  <span class="counter">0</span>
              </a></li>
              <li class="history" data-view="history"><a href="#">
                  <span class="mif-drive-eta icon"></span>
                  <span class="title">History</span>
              </a></li>
          </ul>
      </div>
        <div class="cell auto-size padding20 bg-white" id="cell-content">
          <div class="dashboard-viewport">
          <h1 class="text-light block">Select a device</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- End Dashboard view -->
*/
