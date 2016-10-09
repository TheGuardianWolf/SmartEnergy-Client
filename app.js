google.charts.ready = false;
google.charts.load('current', {'packages':['line', 'corechart']});
google.charts.setOnLoadCallback(function() {
  google.charts.ready = true;
});
events.appStart();
