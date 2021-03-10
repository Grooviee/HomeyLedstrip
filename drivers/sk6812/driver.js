'use strict';

const Homey = require('homey');

class LedstripSK6812Driver extends Homey.Driver {
	
	onInit() {
		this.log('LedstripSK6812Driver has been inited');

		 this.homey.flow.getActionCard('set_color')
  	  		.registerRunListener( async (args, state) => {
      			let device = args.device;
    	  		return device.setColorSelection({
    	  			color: args.color, 
    	  			color_selection: args.color_selection
    	  		});
  			});

		this.homey.flow.getActionCard('set_theme')
  	  		.registerRunListener( async (args, state) => {
      			let device = args.device;
    	  		return device.setTheme({
    	  			theme: args.theme, 
    	  			speed: args.speed
    	  		});
  			});
	}
	
}

module.exports = LedstripSK6812Driver;