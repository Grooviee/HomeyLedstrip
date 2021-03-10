'use strict';

const Homey = require('homey');
const request = require('axios');
const ColorMethods = require('../ColorMethods.js');

class LedstripDevice extends Homey.Device {
	

	onInit() {
		this.log('LedstripDevice has been inited');

		this._getInitialStatus();
		this.setCapabilityValue('color_selection', "1");
		
		this.registerCapabilityListener('color_selection', this._onCapabilityColorSelection.bind(this));
		this.registerCapabilityListener('onoff', this._onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('dim', this._onCapabilityDim.bind(this));
		this.registerMultipleCapabilityListener([ 'light_hue', 'light_saturation', ], this._onCapabilityHSV.bind(this), 500);
		this.registerMultipleCapabilityListener([ 'theme', 'theme_speed' ], this._onCapabilityThemeSelection.bind(this), 500);

	}

	_getInitialStatus() {
		request.get('http://' + this.getSettings().ipAddress + '/status').then(result => {            
			this.firstColor = { red: result.data.color[1], green: result.data.color[2], blue: result.data.color[3], white: result.data.color[0]};
			this.secondColor = { red: result.data.color[5], green: result.data.color[6], blue: result.data.color[7], white: result.data.color[4]};
			this.thirdColor = { red: result.data.color[9], green: result.data.color[10], blue: result.data.color[11], white: result.data.color[8]};
			
			this.setCapabilityValue('theme', "" + result.data.fx_mode);
        	this.setCapabilityValue('theme_speed', result.data.speed );
        	this.setCapabilityValue('dim', result.data.brightness / 255);
        	this.setCapabilityValue('onoff', "" + result.data.mode === "1");
        }).catch(error => {
            // TODO: add alert/error handling.
            console.log('could not connect: http://' + this.getSettings().ipAddress + '/status');
            return;
        });;

        
	}

	setColorSelection({color_selection, color}) {
		this.setCapabilityValue('color_selection', color_selection);
		const rgb = ColorMethods.convertHexToRGBW({hex: color.substring(1)});
        this._setColor(rgb);	
        this._sendRequest(this._getSetUrl());
		return Promise.resolve();
	}

	setTheme({theme, speed}) {
		this.setCapabilityValue('theme', theme);
		this.setCapabilityValue('theme_speed', speed);
		this._setTheme({theme: theme, themeSpeed: speed});
        
		return Promise.resolve();
	}

	_onCapabilityOnoff(onoff) {
        let currentOnState = this._isLedStripOn();
        if (currentOnState == true && onoff == false) {
            this._turnOff();
        } else if (currentOnState == false && onoff == true) {
            this._turnOn();
        }
        
        return Promise.resolve();
    }

    _onCapabilityDim(dim) {
    	if (!this._isLedStripOn()) {
    		this.setCapabilityValue("onoff", true);
    	}
        let url = '/set?c=' + Math.ceil(dim * 100);
        this._sendRequest(url); 

        return Promise.resolve();
    }

    _onCapabilityHSV(valueObj) {
        let dimValue = this.getCapabilityValue('dim');
        var hueValue = this.getCapabilityValue('light_hue');
        var saturationValue = this.getCapabilityValue('light_saturation'); 

        if (typeof valueObj.light_hue !== 'undefined') {
            hueValue = valueObj.light_hue;
        }

        if (typeof valueObj.light_saturation !== 'undefined') {
            saturationValue = valueObj.light_saturation;
        }

    	let rgb = ColorMethods.convertHSVToRGB({
			hue: hueValue,
			saturation: saturationValue,
			value: dimValue
        });
        this._setColor(rgb);

        this._sendRequest(this._getSetUrl());
        
        return Promise.resolve();
    }

    _onCapabilityThemeSelection(valueObj) {
    	var themeValue = this.getCapabilityValue('theme');
        var themeSpeedValue = this.getCapabilityValue('theme_speed'); 

        if (typeof valueObj.theme !== 'undefined') {
            themeValue = valueObj.theme;
        }

        if (typeof valueObj.theme_speed !== 'undefined') {
            themeSpeedValue = valueObj.theme_speed;
        }
     	this._setTheme({theme: themeValue, themeSpeed: themeSpeedValue});
        
        return Promise.resolve();
    }

    _onCapabilityColorSelection(valueObj) {
    	return Promise.resolve();
    }

    _setTheme({theme, themeSpeed}) {
    	let url = '/set?' + 
     		'm='  + theme +
     		'&s=' + themeSpeed;
		
		this._sendRequest(url);
		return Promise.resolve();
    }

    _turnOn() {
        this._sendRequest('/on');
    }
	
	_turnOff() {
        this._sendRequest('/off');
    }
    
    _isLedStripOn() {
        return this.getCapabilityValue('onoff') == '1';
    }

    _getTheme(value) {
    	return this.getCapabilityValue('theme');
    }

    _getColorSelection() {
    	return this.getCapabilityValue('color_selection'); 
    }

    _getSetUrl() {
    	let url = '/set?' + 
			'm=' + this._getTheme() +
			'&r=' + this.firstColor.red +
			'&g=' + this.firstColor.green +
			'&b=' + this.firstColor.blue +
			'&r2=' + this.secondColor.red +
			'&g2=' + this.secondColor.green +
			'&b2=' + this.secondColor.blue +
			'&r3=' + this.thirdColor.red +
			'&g3=' + this.thirdColor.green +
			'&b3=' + this.thirdColor.blue;
		return url;
    }

    _setColor(rgb) {
        if (this._getColorSelection() == "1") {
            this.firstColor = this._getColor(rgb);
        } else if (this._getColorSelection() == "2") {
            this.secondColor = this._getColor(rgb);
        } else if (this._getColorSelection() == "3") {
            this.thirdColor = this._getColor(rgb);
        }
    }

    _getColor(rgb) {
    	return {red: rgb.r, green: rgb.g, blue: rgb.b};
    }

    
    _sendRequest(url) {
    	console.log('http://' + this.getSettings().ipAddress + url);
        request.get('http://' + this.getSettings().ipAddress + url).catch(error => {
            // TODO: add alert/error handling.
            return;
        });
    }
	
}

module.exports = LedstripDevice;