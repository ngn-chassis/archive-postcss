require('ngn')
require('ngn-data')

const ChassisAtRules = require('./at-rules.js')
const ChassisConstants = require('./constants.js')
const ChassisCore = require('./core.js')
const ChassisErrors = require('./errors.js')
const ChassisLayout = require('./layout.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTypography = require('./typography.js')
const ChassisUtilities = require('./utilities.js')

class ChassisPostCss {
	constructor (cfg) {
		cfg = NGN.coalesce(cfg, {})

		this.utils = ChassisUtilities
		this.constants = ChassisConstants
		this.plugins = cfg.hasOwnProperty('plugins') ? cfg.plugins : null

		this._initSettings(cfg)
		this._initTypography()

		this.layout = new ChassisLayout(this)
		this.atRules = new ChassisAtRules(this)
		this.core = new ChassisCore(this)

		return this.plugin
	}

	get plugin () {
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
}

module.exports = ChassisPostCss
