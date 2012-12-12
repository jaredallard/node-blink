var blink = require('../');

blink(function(err, b) {
    var color = [255, 255, 255];
    function wander(x) {
        return Math.min(255,
            Math.max(0,
                x + (Math.random() - 0.5) * 50)) | 0;
    }
    setInterval(function() {
        color = color.map(wander);
        b.setRGB(color, 1000);
    }, 100);
});
