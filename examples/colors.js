var blink = require('../');

// get your blink(1) device
blink(function(err, b) {
    if (err) throw err;

    var colors = ['cyan', 'yellow', 'magenta'], i = 0;
    setInterval(function() {
        if (++i > colors.length - 1) i = 0;
        b.set(colors[i]);
    }, 1000);
});
