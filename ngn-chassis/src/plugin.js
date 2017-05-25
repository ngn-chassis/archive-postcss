require('ngn')
require('ngn-data')

const ChassisConstants = require('./constants.js')
const ChassisGenerator = require('./generator.js')
const ChassisImporter = require('./importer.js')
const ChassisMixins = require('./mixins.js')
const ChassisSettings = require('./settings.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisUtilities = require('./utilities.js')

class ChassisPostCss {
	constructor (cfg) {
		this.cfg = NGN.coalesce(cfg, {})
		this.plugins = cfg.hasOwnProperty('plugins') ? cfg.plugins : null
		
		this.constants = ChassisConstants
		this.generator = new ChassisGenerator(this)
		this.importer = new ChassisImporter(this)
		// this.mediaQueries = console.log('get media queries');
		this.mixins = new ChassisMixins(this)
		this.settings = new ChassisSettings(this)
		this.utils = ChassisUtilities
		
		return this.init()
	}
	
	get plugin () {
		let core = new ChassisStylesheet(this, 'stylesheets/core.spec.css')
		
		return (root, result) => {
			result.root = core.css.append(new ChassisStylesheet(this, root).css)
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
		
		return this.plugin
	}
}

module.exports = ChassisPostCss
