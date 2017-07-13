require('ngn')
require('ngn-data')

const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const perfectionist = require('perfectionist')

const ChassisAtRules = require('./at-rules.js')
const ChassisConstants = require('./constants.js')
const ChassisCore = require('./core.js')
const ChassisLayout = require('./layout.js')
const ChassisPost = require('./post.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTheme = require('./theme.js')
const ChassisTypography = require('./typography.js')
const ChassisUtilities = require('./utilities.js')
const ChassisViewport = require('./viewport.js')

class ChassisPostCss {
	constructor (cfg) {
		cfg = this._cleanseCfg(NGN.coalesce(cfg, {}))

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
		this.post = new ChassisPost(this)
		this.core = new ChassisCore(this)
		this.extensions = {}
		
		// List of CSS properties that are applied to <a> tags. Other components that
		// use <a> tags with an additional class or attribute will need to unset or
		// override these properties to avoid picking up unintended styling from
		// default links.
		this.linkOverrides = []

		return this.plugin
	}

	get plugin () {
		// this.utils.console.printTree(this.settings.data)
		// this.utils.console.printTree(this.theme.json)
		return (root, result) => {
			let output = this.core.css.append(new ChassisStylesheet(this, root).css)
			
			output.walkAtRules('chassis-post', (atRule) => {
				let data = Object.assign({
					root: this.tree,
					atRule
				}, this.atRules.getProperties(atRule))
			
				this.post.process(data, output)
			})
			
			output = cssnext(this.cssnextCfg).process(output.toString())
 			output = perfectionist.process(output.toString())
			
			result.root = postcss.parse(output)
		}
	}

	_cleanseCfg (cfg) {
		let cleansedCfg = cfg
		
		this.cssnextCfg = {
			features: {
				customProperties: {
					variables: {}
				}
			}
		}

		if (cleansedCfg.hasOwnProperty('componentResetSelectors')) {
			delete cleansedCfg.componentResetSelectors
		}
		
		if (cleansedCfg.hasOwnProperty('customProperties')) {
			if (typeof cleansedCfg.customProperties === 'boolean') {
				this.cssnextCfg.features.customProperties = cleansedCfg.customProperties
			} else {
				this.cssnextCfg.features.customProperties.variables = cleansedCfg.customProperties
			}
			
			delete cleansedCfg.customProperties
		}

		return cleansedCfg
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
