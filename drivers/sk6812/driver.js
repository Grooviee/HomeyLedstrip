'use strict';

const Homey = require('homey');

class LedstripSK6812Driver extends Homey.Driver {
	
	onInit() {
		this.log('LedstripSK6812Driver has been inited');

		new Homey.FlowCardAction('set_color')
  	  		.register()
  	  		.registerRunListener( args => {
      			let device = args.device;
    	  		return device.setColorSelection({
    	  			color: args.color, 
    	  			color_selection: args.color_selection
    	  		});
  			});

		new Homey.FlowCardAction('set_theme')
  	  		.register()
  	  		.registerRunListener( args => {
      			let device = args.device;
    	  		return device.setTheme({
    	  			theme: args.theme, 
    	  			speed: args.speed
    	  		});
  			});
	}
	
}

module.exports = LedstripSK6812Driver;