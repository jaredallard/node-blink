var blink = require('../');

blink(function(err, b) {
    // b.blink();
    b.blink([255, 0, 0], 1000, [0, 0, 0]);
});
