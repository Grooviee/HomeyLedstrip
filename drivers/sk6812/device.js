'use strict';

const LedstripDevice = require('../../lib/device/LedstripDevice.js');

class LedstripSK6812Device extends LedstripDevice {
	
	onInit() {

		this.firstColor =  { red: 255, blue:   0, green:   0, white: 0 };
		this.secondColor = { red:   0, blue: 255, green:   0, white: 0 };
		this.thirdColor =  { red:   0, blue:   0, green: 255, white: 0 };

		this.log('LedstripSK6812Device has been inited');
		this.registerCapabilityListener( 'light_temperature', this._onCapabilityLightTemperature.bind(this), 500);
		super.onInit();
	}

	_onCapabilityLightTemperature(light_temperature) {
		let rgb = {r: 0, b: 0, g: 0, w: Math.ceil(light_temperature * 255)};
		this._setColor(rgb);
        this._sendRequest(this._getSetUrl());
        return Promise.resolve();
    }

	_getColor(rgb) {
		if (typeof rgb.w == 'undefined') {
    		return {red: rgb.r, green: rgb.g, blue: rgb.b, white: 0};
    	}
    	return {red: rgb.r, green: rgb.g, blue: rgb.b, white: rgb.w};
    }
	
	_getSetUrl() {
    	let url = '/set?' + 
			'm=' + this._getTheme() +
			'&r=' + this.firstColor.red +
			'&g=' + this.firstColor.green +
			'&b=' + this.firstColor.blue +
			'&w=' + this.firstColor.white +
			'&r2=' + this.secondColor.red +
			'&g2=' + this.secondColor.green +
			'&b2=' + this.secondColor.blue +
			'&w2=' + this.secondColor.white +
			'&r3=' + this.thirdColor.red +
			'&g3=' + this.thirdColor.green +
			'&b3=' + this.thirdColor.blue +
			'&w3=' + this.thirdColor.white ;
		return url;
    }
}

module.exports = LedstripSK6812Device;