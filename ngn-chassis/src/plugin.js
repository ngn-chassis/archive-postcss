require('ngn')
require('ngn-data')

const ChassisConstants = require('./constants.js')
const ChassisCore = require('./core.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTypography = require('./typography.js')
const ChassisUtilities = require('./utilities.js')

class ChassisPostCss {
	constructor (cfg) {
		this.cfg = NGN.coalesce(cfg, {})
		this.plugins = cfg.hasOwnProperty('plugins') ? cfg.plugins : null
			
		this.utils = ChassisUtilities
		this.constants = ChassisConstants
		
		this.settings = new ChassisSettings(this)
		this.typography = new ChassisTypography(this)
		
		return this.init()
	}
	
	get plugin () {
		return (root, result) => {
			// result.root = this.core.css.append(new ChassisStylesheet(this, root).css)
			result.root = this.core.css.append(root)
		}
	}
	
	init () {
		// if (this.plugins) {
		// 	delete this.cfg.plugins
		// }
		
		// if (!this.cfg.hasOwnProperty('breakpoints')) {
		// 	this.cfg.viewportWidthRanges = this.constants.defaultViewportWidthRanges
		// }
		//
		this.settings.load(this.cfg)
		
		// Populate auto-typography values
		this.settings.typography.ranges.load(this.typography.ranges)
		
		this.core = new ChassisCore(this)
		
		if (!this.settings.valid) {
			console.error('[ERROR] Chassis Configuration: Invalid fields:')
			console.error(this.settings.invalidDataAttributes.join(', '))
		}
		
		return this.plugin
	}
}

module.exports = ChassisPostCss
