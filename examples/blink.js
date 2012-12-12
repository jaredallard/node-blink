var blink = require('../');

// get your blink(1) device
blink(function(err, b) {
    if (err) throw err;
    // blink from #ff0000 to #000000 every 1000ms
    // or 1s
    b.blink([255, 0, 0], 1000, [0, 0, 0]);
});
