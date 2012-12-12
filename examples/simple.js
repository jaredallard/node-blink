var blink = require('../');

blink(function(err, b) {
    // set to #ff00ff instantly
    b.set([255,0,255]);
});
