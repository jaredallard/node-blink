var blink = require('../');

// get your blink(1) device
blink(function(err, b) {
    b.set('#ace');
});
