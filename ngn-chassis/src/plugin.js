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
		
		this.settings = new ChassisSettings(this)
		this.settings.load(cfg)
		
		this._validateSettings()
		
		this.typography = new ChassisTypography(this)
		this.settings.typography.ranges.load(this.typography.ranges)
		
		this.viewport = new ChassisViewport(this)
		this.settings.viewportWidthRanges.load(this.viewport.getWidthRanges(this.settings.layout.breakpoints))
		
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

	_validateSettings () {
		console.log(this.settings.theme.typography['font-size']);
		console.log(this.settings.theme.typography.valid);
		
		if (!this.settings.valid) {
			console.error('[ERROR] Chassis Configuration: Invalid fields:')
			console.error(this.settings.invalidDataAttributes.join(', '))
		}
	}
}

module.exports = ChassisPostCss
