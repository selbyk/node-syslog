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
  exec(['tail', '/proc/loadavg'], function(err, out, code) {
    console.log(out.split('\n')[0].split(' '));
    console.log('stderr: ' + code);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
    if (err instanceof Error)
      throw err;
  });
}

log_du();
//var timer = setInterval(log_du, 60*1000);
// clearInterval and it doesn't run anymore.
// clearInterval(timer); 
