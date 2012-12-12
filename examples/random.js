var blink = require('../');

// Get your blink(1) device
blink(function(err, b) {
    // start with pure white
    var color = [255, 255, 255];
    // randomize colors, bounding them by 0->255
    function wander(x) {
        return Math.round(
            // bound by 255 as the max
            Math.min(255,
            // bound by 0 as the min
            Math.max(0,
                // change the number by adding it to a random number from -128 to 128
                x + (Math.random() - 0.5) * 256)));
    }
    // Every second, wander to a new random color, having it fade
    // for 1000ms - 1s
    setInterval(function() {
        // randomize colors
        color = color.map(wander);
        b.setRGB(color, 1000);
    }, 1000);
});
