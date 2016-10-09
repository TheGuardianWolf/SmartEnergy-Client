dashboard.overview.partial="";
dashboard.overview.partial += "<!-- Dashboard.Overview view -->";
dashboard.overview.partial += "<div class=\"overview\">";
dashboard.overview.partial += "  <h1 class=\"text-light\">Overview <span class=\"mif-drive-eta place-right\"><\/span><\/h1>";
dashboard.overview.partial += "  <hr class=\"thin bg-grayLighter\">";
dashboard.overview.partial += "  <div class=\"flex-grid\">";
dashboard.overview.partial += "    <div class=\"row\">";
dashboard.overview.partial += "      <div class=\"cell colspan6\">";
dashboard.overview.partial += "        <div class=\"row\">";
dashboard.overview.partial += "          <div class=\"cell colspan12\">";
dashboard.overview.partial += "            <h2>{{Device.Alias}}<\/h2>";
dashboard.overview.partial += "            Last update from server: <span>{{lastUpdateTime}}<\/span>";
dashboard.overview.partial += "          <\/div>";
dashboard.overview.partial += "        <\/div>";
dashboard.overview.partial += "        <div class=\"row quick-stats\">";
dashboard.overview.partial += "          <div class=\"cell colspan12\">";
dashboard.overview.partial += "            <h3>Quick Stats<\/h3>";
dashboard.overview.partial += "            <div class=\"power\">";
dashboard.overview.partial += "              Current Power<br\/>";
dashboard.overview.partial += "              <span class=\"value\"><\/span> W";
dashboard.overview.partial += "            <\/div>";
dashboard.overview.partial += "          <\/div>";
dashboard.overview.partial += "        <\/div>";
dashboard.overview.partial += "      <\/div>";
dashboard.overview.partial += "      <div class=\"cell colspan6\">";
dashboard.overview.partial += "        <h3>Last 6 Hours<\/h3>";
dashboard.overview.partial += "      <\/div>";
dashboard.overview.partial += "    <\/div>";
dashboard.overview.partial += "  <\/div>";
dashboard.overview.partial += "<\/div>";
dashboard.overview.partial += "<!-- End Dashboard.Overview view -->";



/*
<!-- Dashboard.Overview view -->
<div class="overview">
  <h1 class="text-light">Overview <span class="mif-drive-eta place-right"></span></h1>
  <hr class="thin bg-grayLighter">
  <div class="flex-grid">
    <div class="row">
      <div class="cell colspan6">
        <div class="row">
          <div class="cell colspan12">
            <h2>{{Device.Alias}}</h2>
            Last update from server: <span>{{lastUpdateTime}}</span>
          </div>
        </div>
        <div class="row quick-stats">
          <div class="cell colspan12">
            <h3>Quick Stats</h3>
            <div class="power">
              Current Power<br/>
              <span class="value"></span> W
            </div>
          </div>
        </div>
      </div>
      <div class="cell colspan6">
        <h3>Last 6 Hours</h3>
      </div>
    </div>
  </div>
</div>
<!-- End Dashboard.Overview view -->
*/
