var HID = require('HID'),
    parseColor = require('./lib/colorparser').parseCSSColor;

var VENDOR_ID = 10168;

function blink(cb) {
    var b = {},
        interval;

    b.blink1_degamma_log2lin = function(n) {
        return (((1<<(n/32))-1) + ((1<<(n/32))*((n%32)+1)+15)/32);
    };

    function parseRgb(rgb) {
        if (typeof rgb === 'object') return rgb;
        if (typeof rgb === 'undefined') {
            console.log('Color value undefined');
            return [0,0,0];
        }
        var c = parseColor(rgb);
        if (!c) {
            console.log('Could not parse color', rgb);
            c = [0,0,0];
        }
        return c;
    }

    function wRGB(rgb, ms) {
        var dms = ms/10;
        var msg = new Buffer(9);
        rgb = parseRgb(rgb);
        msg[0] = 1;
        msg[1] = (ms === 0 ? 'n' : 'c').charCodeAt(0);
        msg[2] = b.blink1_degamma_log2lin(rgb[0]) | 0;
        msg[3] = b.blink1_degamma_log2lin(rgb[1]) | 0;
        msg[4] = b.blink1_degamma_log2lin(rgb[2]) | 0;
        msg[5] = dms >> 8;
        msg[6] = dms % 0xff;
        return msg;
    }

    function rRGB(rgb, ms) {
        var msg = new Buffer(9);
        msg[0] = 1;
        msg[1] = 'R'.charCodeAt(0);
        msg[2] = 0;
        msg[3] = 0;
        msg[4] = 0;
        msg[5] = 0;
        msg[6] = 0;
        msg[7] = 0;
        return msg;
    }

    function setup(b) {
        b.device = HID.devices().filter(function(d) {
            return d.vendorId === VENDOR_ID;
        })[0];
        if (!b.device) return Error('blink(1) not found');
        b.connection = new HID.HID(b.device.path);
        if (!b.connection) return Error('could not connect to blink(1)');
    }

    b.setRGB = function(rgb, ms) {
        b.connection.write(wRGB(rgb, ms || 0));
        return b;
    };

    b.getRGB = function(rgb, ms) {
        b.connection.read(function(err, res) {
            console.log(arguments);
        });
        b.connection.write(rRGB());
    };

    b.blink = function(on, ms, off) {
        on = on || [255, 255, 255];
        ms = ms || 500;
        off = off || [0, 0, 0];
        var phase = true;
        interval = setInterval(function() {
            b.connection.write((phase = !phase) ?
                wRGB(on) : wRGB(off));
        }, ms);
        return b;
    };

    b.stop = function() {
        if (interval) clearInterval(interval);
    };

    var err = setup(b);

    return cb(err, b);
}

module.exports = blink;
