require('ngn')
require('ngn-data')

const ChassisAtRules = require('./at-rules.js')
const ChassisConstants = require('./constants.js')
const ChassisCore = require('./core.js')
const ChassisLayout = require('./layout.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTypography = require('./typography.js')
const ChassisUtilities = require('./utilities.js')
const ChassisViewport = require('./viewport.js')

class ChassisPostCss {
	constructor (cfg) {
		cfg = NGN.coalesce(cfg, {})

		this.utils = ChassisUtilities
		this.constants = ChassisConstants
		
		if (cfg.hasOwnProperty('plugins')) {
			this.plugins = cfg.plugins
			delete cfg.plugins
		} else {
			this.plugins = null
		}
		
		let breakpoints = null
		
		if (cfg.layout.hasOwnProperty('breakpoints')) {
			breakpoints = cfg.layout.breakpoints
			delete cfg.layout.breakpoints
		}

		this._initSettings(cfg)
		this._initTypography()
		this._initViewport(breakpoints)

		this.layout = new ChassisLayout(this)
		this.atRules = new ChassisAtRules(this)
		this.core = new ChassisCore(this)

		return this.plugin
	}

	get plugin () {
		// console.log(this.utils.console.printTree(this.settings.data));
		return (root, result) => {
			result.root = this.core.css.append(new ChassisStylesheet(this, root).css)
		}
	}

	_initSettings (cfg) {
		this.settings = new ChassisSettings(this)
		this.settings.load(cfg)

		if (!this.settings.valid) {
			console.error('[ERROR] Chassis Configuration: Invalid fields:')
			console.error(this.settings.invalidDataAttributes.join(', '))
		}
	}

	_initTypography () {
		this.typography = new ChassisTypography(this)
		this.settings.typography.ranges.load(this.typography.ranges)
	}
	
	_initViewport (breakpoints) {
		this.viewport = new ChassisViewport(this)
		
		if (breakpoints) {
			this.settings.viewportWidthRanges.load(this.viewport.getWidthRanges(breakpoints))
		}
	}
}

module.exports = ChassisPostCss
