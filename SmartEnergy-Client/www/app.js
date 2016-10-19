function onDeviceReady() {
    google.charts.ready = false;
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        google.charts.ready = true;
    });
    events.appStart();
}

if (window.cordova !== "undefined")
{
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
}
else
{
    onDeviceReady();
}



