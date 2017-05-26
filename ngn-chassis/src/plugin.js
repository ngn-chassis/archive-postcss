require('ngn')
require('ngn-data')

const ChassisAtRules = require('./at-rules.js')
const ChassisConstants = require('./constants.js')
const ChassisGenerator = require('./generator.js')
const ChassisImporter = require('./importer.js')
const ChassisLayout = require('./layout.js')
const ChassisSettings = require('./settings.js')
const ChassisSpecsheet = require('./specsheet.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisTypography = require('./typography.js')
const ChassisUtilities = require('./utilities.js')
const ChassisViewport = require('./viewport.js')

class ChassisPostCss {
	constructor (cfg) {
		this.cfg = NGN.coalesce(cfg, {})
		this.plugins = cfg.hasOwnProperty('plugins') ? cfg.plugins : null
			
		this.utils = ChassisUtilities
		this.constants = ChassisConstants
		this.settings = new ChassisSettings(this)
		
		this.generator = new ChassisGenerator(this)
		this.importer = new ChassisImporter(this)
		this.layout = new ChassisLayout(this)
		// this.mediaQueries = console.log('get media queries');
		this.typography = new ChassisTypography(this)
		this.viewport = new ChassisViewport(this)
		
		this.atRules = new ChassisAtRules(this)
		
		return this.init()
	}
	
	get plugin () {
		return (root, result) => {
			result.root = this.core.css.append(new ChassisStylesheet(this, root).css)
		}
	}
	
	init () {
		if (this.plugins) {
			delete this.cfg.plugins
		}
		
		if (!this.cfg.hasOwnProperty('viewportWidthRanges')) {
			this.cfg.viewportWidthRanges = this.constants.defaultViewportWidthRanges
		}
		
		this.settings.load(this.cfg)
		
		if (!this.settings.valid) {
			console.error('[ERROR] Chassis Configuration: Invalid fields:')
			console.error(this.settings.invalidDataAttributes.join(', '))
		}
		
		this.core = new ChassisSpecsheet(this, 'stylesheets/core.spec.css')
		
		return this.plugin
	}
}

module.exports = ChassisPostCss
