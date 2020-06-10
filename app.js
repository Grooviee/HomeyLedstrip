'use strict';

const Homey = require('homey');

class LedStrip extends Homey.App {
	
	onInit() {
		this.log('LedStrip is running...');
	}
	
}

module.exports = LedStrip;