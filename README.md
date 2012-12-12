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
    b.setRGB(color, 1000);
});
```

Uses [node-hid](https://github.com/hanshuebner/node-hid) for most magic.

## See Also

* [node-blink1](https://github.com/sandeepmistry/node-blink1) beat me by 23 hours
* [the official software for the blink1](https://github.com/todbot/blink1)
