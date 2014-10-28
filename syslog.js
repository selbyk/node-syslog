var influx = require('influx'),
  exec = require('exec');

var client = influx({
  host : 'localhost',
  port : 8086, // optional, default 8086
  username : 'system',
  password : 'system',
  database : 'system'
});

var options = {};

function log_du() {
  exec(['sudo', 'du', '-m', '/'], function(err, out, code) {
    var du_array = out.split('\n'),
      points = [],
      index = 0,
      next = 1,
      time = new Date();
    if(du_array[du_array.length-1]=='')
      du_array.pop();
    //console.log('stdout: ' + JSON.stringify(du_array));
    //console.log(du_array[next]);
    while(index < du_array.length) {
      var split = du_array[index].replace(/[\s]+/g, ' ').split(' ');
      //if(regex_match)
      //console.log(regex_match);
      var size = split[0];
      var dir = split[1];
      if(size>5){
        //console.log(dir);
        //console.log(size);
        points.push({'time': time, 'version': '0.1.0', 'dir': dir, 'size': parseFloat(size)});
      }
      index = index + 1;
    }
    client.writePoints('du', points, options, function(){});
    console.log('sent: ' + points.length);
    points = [];
    console.log('stderr: ' + code);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
    if (err instanceof Error)
      throw err;
  });
}

log_du();
var timer = setInterval(log_du, 5*60*1000);
// clearInterval and it doesn't run anymore.
// clearInterval(timer);

function log_loadavg() {
  exec(['tail', '/proc/loadavg'], function(err, out, code) {
    var loadavg_array = out.split('\n')[0].split(' ');
    client.writePoint('loadavg', {'one': parseFloat(loadavg_array[0]), 'two':parseFloat(loadavg_array[1]), 'three':parseFloat(loadavg_array[2]), 'four': parseFloat(loadavg_array[3]), 'five': parseFloat(loadavg_array[4])}, options, function(){});
    console.log('stderr: ' + code);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
    if (err instanceof Error)
      throw err;
  });
}

log_loadavg();
var timer_loadavg = setInterval(log_loadavg, 1000);
