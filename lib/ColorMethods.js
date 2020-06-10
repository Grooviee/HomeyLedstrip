'use strict';

var convert = require('color-convert');


module.exports = {
    convertHSVToRGB({ hue, saturation, value }) {
        if (typeof hue !== 'number') hue = 1;
        if (typeof saturation !== 'number') saturation = 1;
        if (typeof value !== 'number') value = 1;

        const [r, g, b] = convert.hsv.rgb(
            hue * 360,
            saturation * 100,
            value * 100
        );

        return { r, g, b };
    },

    convertHexToRGB({ hex}) {
        const [r, g, b] = convert.hex.rgb(
            hex
        );

        return { r, g, b };
    },

    convertRgbToHsv({ rgb }) {
        const [h, s, v ] = convert.rgb.hsv(
            rgb.red,
            rgb.green,
            rgb.blue,
        );
        return { h, s, v };
    }
};