var darksky = require('darksky'),
    blink = require('node-blink');

function usage() { console.error('usage: index.js APIKEY lat,lon'); }

if (process.argv.length !== 4) return usage();

var client = new darksky.Client(process.argv[2]),
    loc = process.argv[3].split(',');

if (loc.length !== 2) return usage();

blink(function(err, blink) {
    if (err) return console.error(err);
    client.brief_forecast(loc[0], loc[1],
        function(err, data) {
            if (err) {
                console.error(err);
            }
            var d = JSON.parse(data.toString());
            if (d.daySummary.match(/rain/)) blink.set('blue');
            else if (d.daySummary.match(/snow/)) blink.set('white');
            else if (d.daySummary.match(/sleet/)) blink.set('cyan');
            else if (d.daySummary.match(/sleet/)) blink.set('cyan');
            else blink.set();
        }
    );
});
