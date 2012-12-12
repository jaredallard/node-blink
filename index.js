var HID = require('HID'),
    parseColor = require('./lib/colorparser').parseCSSColor;

function blink(cb) {
    var b = {},
        VENDOR_ID = 10168,
        white = [255, 255, 255],
        black = [0, 0, 0],
        interval;

    // this mostly just from blink1-lib - converts colors into usable
    // values for wRGB's message format
    function degamma(n) {
        return (((1<<(n/32))-1) + ((1<<(n/32))*((n%32)+1)+15)/32);
    }

    // parse a color value if it needs parsing into a rgb 3-element array,
    // and set the color to black if it cannot be parsed
    function parseRgb(rgb) {
        if (typeof rgb === 'object') return rgb;
        if (typeof rgb === 'undefined') {
            console.log('Color value undefined');
            return black;
        }
        var c = parseColor(rgb);
        if (!c) {
            console.log('Could not parse color', rgb);
            return black;
        }
        return c;
    }

    // create a message that writes a certain rgb value to the blink
    function wRGB(rgb, ms) {
        var dms = ms/10;
        var msg = new Buffer(9);
        rgb = parseRgb(rgb);
        msg[0] = 1;
        msg[1] = (ms === 0 ? 'n' : 'c').charCodeAt(0);
        msg[2] = degamma(rgb[0]) | 0;
        msg[3] = degamma(rgb[1]) | 0;
        msg[4] = degamma(rgb[2]) | 0;
        msg[5] = dms >> 8;
        msg[6] = dms % 0xff;
        return msg;
    }

    // try to find and connect to a blink(1) device, returning an error
    // if it is not accessible
    function setup(b) {
        b.device = HID.devices().filter(function(d) {
            return d.vendorId === VENDOR_ID;
        })[0];
        if (!b.device) return Error('blink(1) not found');
        b.connection = new HID.HID(b.device.path);
        if (!b.connection) return Error('could not connect to blink(1)');
    }

    // set an rgb value. if ms is not given or is 0, it is set immediately -
    // otherwise it is faded two with the blink(1)'s internal functionality
    b.setRGB = function(rgb, ms) {
        b.connection.write(wRGB(rgb, ms || 0));
        return b;
    };

    // simple on & off shortcuts
    b.on = function() { b.setRGB(white); };
    b.off = function() { b.setRGB(black); };

    // get the blink's version number. mine is 100. this bit of code
    // is very directly inspired by node-blink1
    b.version = function() {
        b.connection.sendFeatureReport([1,
            'v'.charCodeAt(0), 0, 0, 0, 0, 0, 0, 0]);
        var response = b.connection.getFeatureReport(1, 9);
        return ((response[3] - 0x30) * 100 + (response[4] - 0x30));
    };

    // a manual blink from one color to another
    b.blink = function(on, ms, off) {
        b.stop();
        on = on || white;
        ms = ms || 500;
        off = off || black;
        var phase = true;
        interval = setInterval(function() {
            b.connection.write((phase = !phase) ?
                wRGB(on) : wRGB(off));
        }, ms);
        return b;
    };

    // stop any currently running inverval
    b.stop = function() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    };

    var err = setup(b);

    return cb(err, b);
}

module.exports = blink;
