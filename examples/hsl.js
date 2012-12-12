var blink = require('../');

// get your blink(1) device
blink(function(err, b) {
    var angle = 0;
    setInterval(function() {
        if (++angle > 360) angle = 0;
        b.set('hsl(' + angle + ', 100%, 50%)');
    }, 100);
});

