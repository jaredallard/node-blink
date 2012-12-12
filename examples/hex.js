var blink = require('../');

// get your blink(1) device
blink(function(err, b) {
    if (err) throw err;

    b.set('#ace');
});
