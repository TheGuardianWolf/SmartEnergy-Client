dashboard.partial = "<!-- Dashboard view --> <div id=\"dashboard\" class=\"dashboard page-content\"> <div class=\"app-bar fixed-top\" data-role=\"appbar\"> <a class=\"app-bar-element branding\">SmartEnergy<\/a>  <span class=\"app-bar-divider\"><\/span> <ul class=\"app-bar-menu\"> <li class=\"device-list\"> <a href=\"\" class=\"dropdown-toggle\">Devices<\/a> <ul class=\"d-menu\" data-role=\"dropdown\">{{#data.Devices}}<li><a href=\"\">{{Alias}}</a></li>{{/data.Devices}}</ul> <\/li> <\/ul>  <div class=\"app-bar-element place-right\"> <span class=\"dropdown-toggle\"><span class=\"mif-cog\"><\/span><span class=\"username\">{{data.User.Username}}<\/span><\/span> <div class=\"app-bar-drop-container padding10 place-right no-margin-top block-shadow fg-dark\" data-role=\"dropdown\" data-no-close=\"true\" style=\"width: 220px\"> <h2 class=\"text-light\">Quick settings<\/h2> <ul class=\"unstyled-list fg-dark\"> <li><a href=\"\" id=\"sign-out\" class=\"fg-white1 fg-hover-yellow\">Sign Out<\/a><\/li> <\/ul> <\/div> <\/div> <\/div>  <div class=\"page-content\"> <div class=\"flex-grid no-responsive-future\" style=\"height: 100%;\"> <div class=\"row\" style=\"height: 100%\"> <div class=\"cell size-x200\" id=\"cell-sidebar\" style=\"background-color: #71b1d1; height: 100%\"> <ul class=\"sidebar\"> <li><a href=\"#\"> <span class=\"mif-apps icon\"><\/span> <span class=\"title\">Overview<\/span> <span class=\"counter\">0<\/span> <\/a><\/li> <li><a href=\"#\"> <span class=\"mif-vpn-publ icon\"><\/span> <span class=\"title\">Current Usage<\/span> <span class=\"counter\">0<\/span> <\/a><\/li> <li><a href=\"#\"> <span class=\"mif-drive-eta icon\"><\/span> <span class=\"title\">History<\/span> <span class=\"counter\">2<\/span> <\/a><\/li> <\/ul> <\/div> <div class=\"cell auto-size padding20 bg-white\" id=\"cell-content\"> <h1 class=\"text-light\">Dashboard <span class=\"mif-drive-eta place-right\"><\/span><\/h1> <hr class=\"thin bg-grayLighter\"> <\/div> <\/div> <\/div> <\/div> <\/div> <!-- End dashboard view -->";

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
          <li><a href="">{{Alias}}</a></li>
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
              <li><a href="#">
                  <span class="mif-apps icon"></span>
                  <span class="title">Overview</span>
                  <span class="counter">0</span>
              </a></li>
              <li><a href="#">
                  <span class="mif-vpn-publ icon"></span>
                  <span class="title">Current Usage</span>
                  <span class="counter">0</span>
              </a></li>
              <li><a href="#">
                  <span class="mif-drive-eta icon"></span>
                  <span class="title">History</span>
                  <span class="counter">2</span>
              </a></li>
          </ul>
      </div>
        <div class="cell auto-size padding20 bg-white" id="cell-content">
          <h1 class="text-light">Dashboard <span class="mif-drive-eta place-right"></span></h1>
          <hr class="thin bg-grayLighter">
        </div>
      </div>
    </div>
  </div>
</div>
<!-- End dashboard view -->
*/