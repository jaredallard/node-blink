# node-blink

Basic nodejs bindings for [blink(1)](http://www.kickstarter.com/projects/thingm/blink1-the-usb-rgb-led).

```javascript
var blink = require('../');

// connect to your blink(1)
blink(function(err, b) {

    // blink on & off every second from #fff to #000
    b.blink();

    // or with specifics
    b.blink([255, 0, 0], 1000, [0, 0, 0]);

    // fade to an rgb color
    b.setRGB([0, 10, 50], 1000);

    // set an rgb color instantly
    b.setRGB([255, 0, 100]);

    // even use hex colors
    b.setRGB('#ace');

    // named css colors
    b.setRGB('cyan');

    // and hsl!
    b.setRGB('hsl(35, 100%, 50%)');

    // just turn it on (white)
    b.on();

    // and off (black)
    b.off();

    // get your blink(1)'s version
    console.log(b.version());

    // programatically change colors with setInterval
    var angle = 0;
    setInterval(function() {
        if (++angle > 360) angle = 0;
        b.setRGB('hsl(' + angle + ', 100%, 50%)');
    }, 100);
});
```

* Uses [node-hid](https://github.com/hanshuebner/node-hid) for most magic.
* Includes deanm's wonderful [css-color-parser-js](https://github.com/deanm/css-color-parser-js) for CSS color support


## See Also

* [node-blink1](https://github.com/sandeepmistry/node-blink1) beat me by 23 hours
* [the official software for the blink1](https://github.com/todbot/blink1)
