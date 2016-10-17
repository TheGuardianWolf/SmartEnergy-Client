var api={base:"https://smart-energy-server.azurewebsites.net/api/",routes:{Users:function(n){return typeof n=="string"?api.base+"Users/Username/"+n:typeof n=="number"?api.base+"Users/"+String(n):void 0},Devices:function(n){return typeof n=="object"&&n!==null?api.base+"Devices/User/"+String(n.Id):typeof n=="number"?api.base+"Devices/"+String(n):void 0},Data:function(n,t){if(typeof n=="object"&&n!==null){var i="";return typeof t=="object"&&n!==null&&Object.keys(t).map(function(n){i===""&&(i+="?");i+="$"+n+"="+String(t[n])}),api.base+"Data/Device/"+String(n.Id)+i}if(typeof n=="number")return api.base+"Data/"+String(n)}},get:{Users:function(n){return $.get(api.routes.Users(n))},Devices:function(n){return $.get(api.routes.Devices(n))},Data:function(n,t){return $.get(api.routes.Data(n,t))}},data:{User:{},Devices:{},Data:{}},notify:function(n,t,i){typeof $.Notify!="undefined"&&$.Notify({caption:n,content:t,type:i,timeout:5e3})}},dashboard={partial:undefined,display:function(){console.log("Switching to dashboard.");$(".viewport").children().velocity("fadeOut").promise().then(function(){$(".viewport").empty();$(".viewport").prepend(Mustache.render(dashboard.partial,api));events.setDashboardEventHandlers();$("#dashboard").velocity("fadeIn")})},viewport:{formatNumber:function(n){return n<1?n.toPrecision(3):n.toPrecision(4)},refresh:function(){var n=String(dashboard.currentDevice.Device.Id);$(".dashboard .sidebar .recent .counter").text(dashboard.viewport.formatNumber(api.data.Data[n].power[api.data.Data[n].power.length-1].Value)+" W");typeof dashboard.viewport.currentView=="undefined"?dashboard.overview.display():dashboard[dashboard.viewport.currentView].refresh()},currentView:undefined,schedule:undefined,redrawCharts:[]},history:{partial:undefined,display:function(){typeof dashboard.currentDevice.Device!="undefined"&&dashboard.viewport.currentView!=="history"&&(dashboard.viewport.currentView="history",$(".dashboard .sidebar li").removeClass("active"),$(".dashboard .sidebar li.history").addClass("active"),console.log("Switching to history."),dashboard.viewport.redrawCharts.length=0,$(".dashboard-viewport").children().velocity("fadeOut").promise().then(function(){$(".dashboard-viewport").empty();$(".dashboard-viewport").prepend(dashboard.history.partial);var n=String(dashboard.currentDevice.Device.Id);dashboard.history.lineChart=new google.visualization.LineChart($(".history .history-line-chart")[0]);dashboard.history.refresh();$(".dashboard-viewport .history").velocity("fadeIn").promise().then(function(){dashboard.currentDevice.dataTable.update.promise().then(function(){dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data,dashboard.history.chartOptions());$(".history .history-line-chart").hide().velocity("fadeIn").promise().then(function(){dashboard.viewport.redrawCharts.push(function(){dashboard.history.lineChart.draw(dashboard.currentDevice.dataTable.data,dashboard.history.chartOptions())})})})})}))},refresh:function(){},chartOptions:function(){return{title:"All Recorded Data",legend:{position:"bottom"},interpolateNulls:!0,vAxes:{0:{title:"Value"}},hAxes:{0:{title:"Time",viewWindow:{min:typeof dashboard.currentDevice.firstDeviceUpdateTime!="undefined"?moment.utc(dashboard.currentDevice.firstDeviceUpdateTime).local().toDate():moment().subtract(1,"year").toDate(),max:typeof dashboard.currentDevice.firstDeviceUpdateTime!="undefined"?moment.utc(dashboard.currentDevice.lastDeviceUpdateTime).local().toDate():moment().toDate()},gridlines:{count:-1,units:{hours:{format:["HH:mm"]}}}}}}},lineChart:undefined},recent:{partial:undefined,display:function(){typeof dashboard.currentDevice.Device!="undefined"&&dashboard.viewport.currentView!=="recent"&&(dashboard.viewport.currentView="recent",$(".dashboard .sidebar li").removeClass("active"),$(".dashboard .sidebar li.recent").addClass("active"),console.log("Switching to recent."),dashboard.viewport.redrawCharts.length=0,$(".dashboard-viewport").children().velocity("fadeOut").promise().then(function(){$(".dashboard-viewport").empty();$(".dashboard-viewport").prepend(dashboard.recent.partial);var n=String(dashboard.currentDevice.Device.Id);dashboard.recent.lineChart.voltage=new google.visualization.LineChart($(".recent .voltage-line-chart")[0]);dashboard.recent.lineChart.current=new google.visualization.LineChart($(".recent .current-line-chart")[0]);dashboard.recent.lineChart.power=new google.visualization.LineChart($(".recent .power-line-chart")[0]);dashboard.recent.refresh();$(".dashboard-viewport .recent").velocity("fadeIn").promise().then(function(){dashboard.currentDevice.dataTable.update.promise().then(function(){var n=function(){dashboard.recent.lineChart.voltage.draw(dashboard.currentDevice.dataTable.views.voltage,dashboard.recent.chartOptions("RMS Voltage in Last 5 Minutes","RMS Voltage (V)"));dashboard.recent.lineChart.current.draw(dashboard.currentDevice.dataTable.views.current,dashboard.recent.chartOptions("Max Current in Last 5 Minutes","Max Current (A)"));dashboard.recent.lineChart.power.draw(dashboard.currentDevice.dataTable.views.power,dashboard.recent.chartOptions("Average Power in Last 5 Minutes","Average Power (W)"))};n();$(".recent .line-chart").hide().velocity("fadeIn").promise().then(function(){dashboard.viewport.redrawCharts.push(n)})})})}))},refresh:function(){},chartOptions:function(n,t){return{title:n,legend:{position:"bottom"},interpolateNulls:!0,vAxes:{0:{title:t}},hAxes:{0:{title:"Time",viewWindow:{min:moment().subtract(5,"minutes").toDate(),max:moment().toDate()},gridlines:{count:-1,units:{hours:{format:["HH:mm"]}}}}}}},lineChart:{voltage:undefined,current:undefined,power:undefined}},overview:{partial:undefined,display:function(){typeof dashboard.currentDevice.Device!="undefined"&&dashboard.viewport.currentView!=="overview"&&(dashboard.viewport.currentView="overview",$(".dashboard .sidebar li").removeClass("active"),$(".dashboard .sidebar li.overview").addClass("active"),console.log("Switching to overview."),dashboard.viewport.redrawCharts.length=0,$(".dashboard-viewport").children().velocity("fadeOut").promise().then(function(){$(".dashboard-viewport").empty();$(".dashboard-viewport").prepend(dashboard.overview.partial);var n=String(dashboard.currentDevice.Device.Id);dashboard.overview.deviceAlias=$(".overview .device-alias");dashboard.overview.quickPower=$(".overview .quick-stats .power .value");dashboard.overview.quickVoltage=$(".overview .quick-stats .voltage .value");dashboard.overview.quickCurrent=$(".overview .quick-stats .current .value");dashboard.overview.lastUpdate=$(".overview span.last-update");dashboard.overview.lastSubmit=$(".overview span.last-submit");dashboard.overview.lineChart=new google.visualization.LineChart($(".overview .overview-line-chart")[0]);dashboard.overview.refresh();$(".dashboard-viewport .overview").velocity("fadeIn").promise().then(function(){dashboard.currentDevice.dataTable.update.promise().then(function(){dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data,dashboard.overview.chartOptions());$(".overview .overview-line-chart").hide().velocity("fadeIn").promise().then(function(){dashboard.viewport.redrawCharts.push(function(){dashboard.overview.lineChart.draw(dashboard.currentDevice.dataTable.data,dashboard.overview.chartOptions())})})})})}))},chartOptions:function(){return{title:"Last Minute",legend:{position:"bottom"},interpolateNulls:!0,vAxes:{0:{title:"Value"}},hAxes:{0:{title:"Time",viewWindow:{min:moment().subtract(1,"minute").toDate(),max:moment().toDate()},gridlines:{count:-1,units:{minutes:{format:["mm:ss"]}}}}}}},refresh:function(){var n=String(dashboard.currentDevice.Device.Id);dashboard.overview.deviceAlias.text(dashboard.currentDevice.Device.Alias);dashboard.overview.quickPower.text(dashboard.viewport.formatNumber(api.data.Data[n].power[api.data.Data[n].power.length-1].Value)+" W");dashboard.overview.quickCurrent.text(dashboard.viewport.formatNumber(api.data.Data[n].current[api.data.Data[n].current.length-1].Value)+" A");dashboard.overview.quickVoltage.text(dashboard.viewport.formatNumber(api.data.Data[n].voltage[api.data.Data[n].voltage.length-1].Value)+" V");dashboard.overview.lastUpdate.text(moment.utc(dashboard.currentDevice.lastAppUpdateTime).local().format("Do MMMM YYYY, h:mm:ss a"));typeof dashboard.currentDevice.lastDeviceUpdateTime!="undefined"?dashboard.overview.lastSubmit.text(moment.utc(dashboard.currentDevice.lastDeviceUpdateTime).local().format("Do MMMM YYYY, h:mm:ss a")):dashboard.overview.lastSubmit.text("No data.")},quickPower:undefined,quickVoltage:undefined,quickCurrent:undefined,lastUpdate:undefined,lastSubmit:undefined,lineChart:undefined,deviceAlias:undefined},currentDevice:{dataTable:{data:undefined,update:undefined,views:{voltage:undefined,current:undefined,power:undefined}},Device:undefined,firstDeviceUpdateTime:undefined,lastDeviceUpdateTime:undefined,lastAppUpdateTime:undefined,reset:function(){dashboard.currentDevice.Device=undefined;dashboard.currentDevice.firstDeviceUpdateTime=undefined;dashboard.currentDevice.lastDeviceUpdateTime=undefined;dashboard.currentDevice.dataTable={data:undefined,update:undefined,views:{voltage:undefined,current:undefined,power:undefined}}},getData:function(){var n,t,i,r,u;if(typeof dashboard.currentDevice.Device.Id!="undefined")return t="",i=function(){dashboard.currentDevice.lastAppUpdateTime=moment()},dashboard.currentDevice.dataTable.update=$.Deferred(),r=function(n,t){var f=t.sort(function(n,t){return new Date(n.Time)-new Date(t.Time)}),r,u,i,e;typeof api.data.Data[n]=="undefined"&&(api.data.Data[n]={});r=function(n){switch(n){case"voltage":return"RMS Voltage (V)";case"current":return"Max Current (A)";case"power":return"Average Power (W)";default:return n}};f.map(function(t){typeof api.data.Data[n][t.Label]=="undefined"&&(api.data.Data[n][t.Label]=[]);api.data.Data[n][t.Label].push(t)});u=Object.keys(api.data.Data[n]);typeof dashboard.currentDevice.dataTable.data=="undefined"&&(i=new google.visualization.DataTable,dashboard.currentDevice.dataTable.data=i,i.addColumn({type:"date",role:"domain",label:"Time"}),e=new google.visualization.NumberFormat({pattern:"@####"}),u.map(function(n,t){i.addColumn({type:"number",role:"data",label:r(n)});e.format(i,t+1)}));f.map(function(n){var t=[];t[0]=moment.utc(n.Time).local().toDate();u.map(function(i){n.Label===i?t.push(n.Value):t.push(null)});dashboard.currentDevice.dataTable.data.addRow(t)});dashboard.currentDevice.dataTable.data.sort([{column:0}]);Object.keys(dashboard.currentDevice.dataTable.views).map(function(n){var u,i,t;for(typeof dashboard.currentDevice.dataTable.views[n]=="undefined"&&(dashboard.currentDevice.dataTable.views[n]=new google.visualization.DataView(dashboard.currentDevice.dataTable.data)),u=dashboard.currentDevice.dataTable.views[n].getNumberOfColumns(),i=[],t=1;t<u;t++)dashboard.currentDevice.dataTable.views[n].getColumnLabel(t)!==r(n)&&i.push(t);dashboard.currentDevice.dataTable.views[n].hideColumns(i)});dashboard.currentDevice.dataTable.update.resolve(dashboard.currentDevice.dataTable.data)},u=String(dashboard.currentDevice.Device.Id),typeof api.data.Data[u]=="undefined"?(api.notify("Devices","Getting data for "+dashboard.currentDevice.Device.Alias+".","info"),n=function(n){return api.notify("Devices","Successfully retrieved data for "+dashboard.currentDevice.Device.Alias+". Data will automatically update every 5 seconds.","success"),r(u,n),n.length>0&&(dashboard.currentDevice.lastDeviceUpdateTime=n[n.length-1].Time,dashboard.currentDevice.firstDeviceUpdateTime=n[0].Time),i(),typeof dashboard.viewport.schedule!="undefined"&&clearInterval(dashboard.viewport.schedule),dashboard.viewport.schedule=setInterval(function(){dashboard.currentDevice.getData().then(function(){dashboard.viewport.refresh();dashboard.viewport.redrawCharts.forEach(function(n){n()})})},5e3),n}):n=function(n){var t=String(dashboard.currentDevice.Device.Id);return r(t,n),n.length>0&&(dashboard.currentDevice.lastDeviceUpdateTime=n[n.length-1].Time,typeof dashboard.currentDevice.firstDeviceUpdateTime=="undefined"&&(dashboard.currentDevice.firstDeviceUpdateTime=n[0].Time)),i(),n},typeof dashboard.currentDevice.lastDeviceUpdateTime!="undefined"&&(t={filter:"Time gt DateTime'"+dashboard.currentDevice.lastDeviceUpdateTime+"'"}),api.get.Data(dashboard.currentDevice.Device,t).then(n,function(n){return console.log(n),api.notify("Devices","Error getting data for "+dashboard.currentDevice.Device.Alias+". Server response: "+String(n.status)+".","warning"),$.Deferred().reject("requestData").promise()});api.notify("Application","An unknown error has occured, please contact the developer and restart the application.","alert")}},signOut:function(){dashboard.viewport.currentView=undefined;dashboard.viewport.redrawCharts.length=0;dashboard.currentDevice.reset();Object.keys(api.data).map(function(n){store.remove(n)});typeof dashboard.viewport.schedule!="undefined"&&clearInterval(dashboard.viewport.schedule)}},events={appStart:function(){var n,t;console.log("App started.");for(n in api.data)api.data.hasOwnProperty(n)&&(t=store.get(n),typeof t=="object"&&t!==null&&(api.data[n]=t));$(function(){login.isLoggedIn()?(api.notify("Authentication","Resuming from last session.","info"),login.toDashboard().then(function(){$(".preloader").hide();dashboard.display()})):($(".preloader").hide(),login.display());$(window).resize(function(){dashboard.viewport.redrawCharts.forEach(function(n){n()})})})},setLoginEventHandlers:function(){$("#login-form").submit(function(n){n.preventDefault();login.getUsernameFromForm();login.toDashboard().then(function(){dashboard.display()})})},setDashboardEventHandlers:function(){$("#sign-out").click(function(n){n.preventDefault();dashboard.signOut();login.display()});$(".dashboard .sidebar li").click(function(n){n.preventDefault();dashboard[$(this).data("view")].display()});$(".dashboard .app-bar .device-list li a").click(function(n){n.preventDefault();var i=parseInt($(this).data("device-id")),t=api.data.Devices.find(function(n){return n.Id===i});typeof t!="undefined"&&(typeof dashboard.currentDevice.Device=="undefined"||t.Id!==dashboard.currentDevice.Device.Id)&&(dashboard.currentDevice.reset(),dashboard.currentDevice.Device=t,dashboard.currentDevice.getData().then(function(){dashboard.viewport.refresh()}))})}},login={partial:undefined,display:function(){console.log("Switching to login.");$(".viewport").children().velocity("fadeOut").promise().then(function(){$(".viewport").empty();$(".viewport").prepend(Mustache.render(login.partial,api));events.setLoginEventHandlers();$("#login").velocity("fadeIn")})},getUsernameFromForm:function(){return api.data.User.Username=$('#login-form input[name="username"]').val(),api.data.User.Username},isLoggedIn:function(){return typeof api.data.User.Username=="string"?!0:!1},toDashboard:function(){return api.notify("Authentication","Contacting the server to get user details.","info"),api.get.Users(api.data.User.Username).then(function(n){return $('#login-form input[name="username"]').removeClass("error"),$('#login-form input[name="username"]').addClass("success"),api.notify("Authentication","Successfully retrieved user details.","success"),n.length===1?(api.data.User=n[0],store.set("User",n[0]),api.notify("Devices","Contacting the server to get device list.","info"),api.get.Devices(api.data.User).then(function(n){return api.notify("Devices","Successfully retrieved device list.","success"),api.data.Devices=n,store.set("Devices",n),n},function(n){return api.notify("Devices","Error retrieving devices. Please restart the app. Server response: "+String(n.status)+".","warning"),$.Deferred().reject("requestDevice").promise()})):(api.notify("Application","An unknown error has occured, please contact the developer and restart the application.","alert"),$.Deferred().reject("requestUser").promise())},function(n){return $('#login-form input[name="username"]').removeClass("success"),$('#login-form input[name="username"]').addClass("error"),api.notify("Authentication","Error verifying username. Server response: "+String(n.status)+".","warning"),$.Deferred().reject("requestUser").promise()})}};dashboard.history.partial="";dashboard.history.partial+="<!-- Dashboard.History view -->";dashboard.history.partial+='<div class="history">';dashboard.history.partial+='  <h1 class="text-light">History <span class="mif-history place-right"><\/span><\/h1>';dashboard.history.partial+='  <hr class="thin bg-grayLighter">';dashboard.history.partial+='  <div class="flex-grid">';dashboard.history.partial+='    <div class="row">';dashboard.history.partial+='      <div class="cell colspan12">';dashboard.history.partial+='        <div class="history-line-chart line-chart chart">';dashboard.history.partial+="        <\/div>";dashboard.history.partial+="      <\/div>";dashboard.history.partial+="    <\/div>";dashboard.history.partial+="  <\/div>";dashboard.history.partial+="<\/div>";dashboard.history.partial+="<!-- End Dashboard.History view -->";dashboard.overview.partial="";dashboard.overview.partial+="<!-- Dashboard.Overview view -->";dashboard.overview.partial+='<div class="overview">';dashboard.overview.partial+='  <h1 class="text-light">Overview <span class="mif-apps place-right"><\/span><\/h1>';dashboard.overview.partial+='  <hr class="thin bg-grayLighter">';dashboard.overview.partial+='  <div class="flex-grid">';dashboard.overview.partial+='    <div class="row">';dashboard.overview.partial+='      <div class="cell colspan6">';dashboard.overview.partial+='        <div class="row">';dashboard.overview.partial+='          <div class="cell colspan12">';dashboard.overview.partial+='            <h2 class="device-alias"><\/h2>';dashboard.overview.partial+="            <p>";dashboard.overview.partial+="              <strong>Last device data submission<\/strong><br/>";dashboard.overview.partial+='              <span class="last-submit"><\/span><br/>';dashboard.overview.partial+="            <\/p>";dashboard.overview.partial+="            <p>";dashboard.overview.partial+="              <strong>Last app update from server<\/strong><br/>";dashboard.overview.partial+='              <span class="last-update"><\/span>';dashboard.overview.partial+="            <\/p>";dashboard.overview.partial+="          <\/div>";dashboard.overview.partial+="        <\/div>";dashboard.overview.partial+='        <div class="row quick-stats">';dashboard.overview.partial+='          <div class="cell colspan12">';dashboard.overview.partial+="            <h3>Quick Stats<\/h3>";dashboard.overview.partial+='            <div class="voltage">';dashboard.overview.partial+="              <p>";dashboard.overview.partial+="                <strong>Last RMS Voltage<\/strong><br/>";dashboard.overview.partial+='                <span class="value"><\/span>';dashboard.overview.partial+="              <\/p>";dashboard.overview.partial+="            <\/div>";dashboard.overview.partial+='            <div class="current">';dashboard.overview.partial+="              <p>";dashboard.overview.partial+="                <strong>Last Max Current<\/strong><br/>";dashboard.overview.partial+='                <span class="value"><\/span>';dashboard.overview.partial+="              <\/p>";dashboard.overview.partial+="            <\/div>";dashboard.overview.partial+='            <div class="power">';dashboard.overview.partial+="              <p>";dashboard.overview.partial+="                <strong>Last Average Power<\/strong><br/>";dashboard.overview.partial+='                <span class="value"><\/span>';dashboard.overview.partial+="              <\/p>";dashboard.overview.partial+="            <\/div>";dashboard.overview.partial+="          <\/div>";dashboard.overview.partial+="        <\/div>";dashboard.overview.partial+="      <\/div>";dashboard.overview.partial+='      <div class="cell colspan6">';dashboard.overview.partial+="        <h3>At a Glance<\/h3>";dashboard.overview.partial+='        <div class="overview-line-chart line-chart chart">';dashboard.overview.partial+="        <\/div>";dashboard.overview.partial+="      <\/div>";dashboard.overview.partial+="    <\/div>";dashboard.overview.partial+="  <\/div>";dashboard.overview.partial+="<\/div>";dashboard.overview.partial+="<!-- End Dashboard.Overview view -->";dashboard.partial="";dashboard.partial+="<!-- Dashboard view -->";dashboard.partial+='<div id="dashboard" class="dashboard page-content">';dashboard.partial+='    <div class="app-bar fixed-top" data-role="appbar">';dashboard.partial+='        <a class="app-bar-element branding">SmartEnergy<\/a>';dashboard.partial+="";dashboard.partial+='        <span class="app-bar-divider"><\/span>';dashboard.partial+='        <ul class="app-bar-menu">';dashboard.partial+='            <li class="device-list">';dashboard.partial+='                <a href="" class="dropdown-toggle">Devices<\/a>';dashboard.partial+='                <ul class="d-menu" data-role="dropdown">';dashboard.partial+="                    {{#data.Devices}}";dashboard.partial+='                    <li><a href="" data-device-id="{{Id}}">{{Alias}}<\/a><\/li>';dashboard.partial+="                    {{/data.Devices}}";dashboard.partial+="                <\/ul>";dashboard.partial+="            <\/li>";dashboard.partial+="        <\/ul>";dashboard.partial+="";dashboard.partial+='        <div class="app-bar-element place-right">';dashboard.partial+='            <span class="dropdown-toggle"><span class="mif-cog"><\/span><span class="username">{{data.User.Username}}<\/span><\/span>';dashboard.partial+='            <div class="app-bar-drop-container padding10 place-right no-margin-top block-shadow fg-dark" data-role="dropdown" data-no-close="true" style="width: 220px">';dashboard.partial+='                <h2 class="text-light">Quick settings<\/h2>';dashboard.partial+='                <ul class="unstyled-list fg-dark">';dashboard.partial+='                    <li><a href="" id="sign-out" class="fg-white1 fg-hover-yellow">Sign Out<\/a><\/li>';dashboard.partial+="                <\/ul>";dashboard.partial+="            <\/div>";dashboard.partial+="        <\/div>";dashboard.partial+="    <\/div>";dashboard.partial+="";dashboard.partial+='    <div class="page-content">';dashboard.partial+='        <ul class="sidebar">';dashboard.partial+='            <li class="overview" data-view="overview">';dashboard.partial+='                <a href="#">';dashboard.partial+='                    <span class="mif-apps icon"><\/span>';dashboard.partial+='                    <span class="title">Overview<\/span>';dashboard.partial+="                <\/a>";dashboard.partial+="            <\/li>";dashboard.partial+='            <li class="recent" data-view="recent">';dashboard.partial+='                <a href="#">';dashboard.partial+='                    <span class="mif-heartbeat icon"><\/span>';dashboard.partial+='                    <span class="title">Recent Usage<\/span>';dashboard.partial+='                    <span class="counter">0<\/span>';dashboard.partial+="                <\/a>";dashboard.partial+="            <\/li>";dashboard.partial+='            <li class="history" data-view="history">';dashboard.partial+='                <a href="#">';dashboard.partial+='                    <span class="mif-history icon"><\/span>';dashboard.partial+='                    <span class="title">History<\/span>';dashboard.partial+="                <\/a>";dashboard.partial+="            <\/li>";dashboard.partial+="        <\/ul>";dashboard.partial+='        <div class="flex-grid no-responsive-future" style="height: 100%;">';dashboard.partial+='            <div class="row" style="height: 100%">';dashboard.partial+='                <div class="cell auto-size padding20 bg-white" id="cell-content">';dashboard.partial+='                    <div class="dashboard-viewport">';dashboard.partial+='                        <h1 class="text-light block">Select a device<\/h1>';dashboard.partial+="                    <\/div>";dashboard.partial+="                <\/div>";dashboard.partial+="            <\/div>";dashboard.partial+="        <\/div>";dashboard.partial+="    <\/div>";dashboard.partial+="<\/div>";dashboard.partial+="<!-- End Dashboard view -->";dashboard.recent.partial="";dashboard.recent.partial+="<!-- Dashboard.Recent view -->";dashboard.recent.partial+='<div class="recent">';dashboard.recent.partial+='  <h1 class="text-light">Recent Usage <span class="mif-heartbeat place-right"><\/span><\/h1>';dashboard.recent.partial+='  <hr class="thin bg-grayLighter">';dashboard.recent.partial+='  <div class="flex-grid">';dashboard.recent.partial+='    <div class="row">';dashboard.recent.partial+='      <div class="cell colspan4">';dashboard.recent.partial+="        <h3>RMS Voltage<\/h3>";dashboard.recent.partial+='        <div class="voltage-line-chart line-chart chart">';dashboard.recent.partial+="        <\/div>";dashboard.recent.partial+="      <\/div>";dashboard.recent.partial+='      <div class="cell colspan4">';dashboard.recent.partial+="        <h3>Max Current<\/h3>";dashboard.recent.partial+='        <div class="current-line-chart line-chart chart">';dashboard.recent.partial+="        <\/div>";dashboard.recent.partial+="      <\/div>";dashboard.recent.partial+='      <div class="cell colspan4">';dashboard.recent.partial+="        <h3>Average Power<\/h3>";dashboard.recent.partial+='        <div class="power-line-chart line-chart chart">';dashboard.recent.partial+="        <\/div>";dashboard.recent.partial+="      <\/div>";dashboard.recent.partial+="    <\/div>";dashboard.recent.partial+="  <\/div>";dashboard.recent.partial+="<\/div>";dashboard.recent.partial+="<!-- End Dashboard.Current view -->";login.partial="";login.partial+="<!-- Login view -->";login.partial+='<div id="login" class="login">';login.partial+='  <div class="auth wrapper">';login.partial+='    <div class="auth-background bg-steel">';login.partial+='      <div class="auth-strip bg-grayLighter">';login.partial+='        <div class="logo">';login.partial+='          <h1 class="">SmartEnergy<\/h1>';login.partial+="        <\/div>";login.partial+="";login.partial+='        <div class="user-inputs">';login.partial+='          <form id="login-form" class="login-form">';login.partial+='            <div class="input-control text">';login.partial+="              <label>Username<\/label>";login.partial+='              <span class="mif-user prepend-icon"><\/span>';login.partial+='              <input type="text" name="username" placeholder="Username" required>';login.partial+="            <\/div>";login.partial+='            <input class="button primary bg-hover-cyan" type="submit" value="Login">';login.partial+="          <\/form>";login.partial+="        <\/div>";login.partial+="";login.partial+="      <\/div>";login.partial+="    <\/div>";login.partial+="  <\/div>";login.partial+="<\/div>";login.partial+="<!-- End login view -->";google.charts.ready=!1;google.charts.load("current",{packages:["corechart"]});google.charts.setOnLoadCallback(function(){google.charts.ready=!0});events.appStart()