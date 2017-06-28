require('ngn')
require('ngn-data')

const postcss = require('postcss')
const cssnano = require('cssnano')
const perfectionist = require('perfectionist')

const ChassisAtRules = require('./at-rules.js')
const ChassisConstants = require('./constants.js')
const ChassisCore = require('./core.js')
const ChassisLayout = require('./layout.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTheme = require('./theme.js')
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
		
		this.theme = new ChassisTheme(this)
		this.layout = new ChassisLayout(this)
		this.atRules = new ChassisAtRules(this)
		this.core = new ChassisCore(this)

		return this.plugin
	}

	get plugin () {
		console.log(this.utils.console.printTree(this.theme.asJson));
		return (root, result) => {
			let output = this.core.css.append(new ChassisStylesheet(this, root).css)
			let beautifiedOutput = postcss.parse(perfectionist.process(output.toString()))

			result.root = beautifiedOutput
		}
	}

	_validateSettings () {
		if (!this.settings.valid) {
			console.error('[ERROR] Chassis Configuration: Invalid fields:')
			console.error(this.settings.invalidDataAttributes.join(', '))
			
			if (this.settings.invalidDataAttributes.includes('theme')) {
				console.error(`[ERROR] "${this.settings.theme}" is not a valid theme file. Chassis themes must have a ".css" or ".js" extension. Reverting to default theme...`)
				this.settings.theme = this.constants.theme.defaultFilePath
			}
		}
	}
}

module.exports = ChassisPostCss
