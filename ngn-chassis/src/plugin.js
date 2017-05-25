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
		return this.plugin
	}
	
	get constants () {
		return ChassisConstants
	}
	
	get generator () {
		return new ChassisGenerator(this)
	}
	
	get importer () {
		return new ChassisImporter(this)
	}
	
	get mediaQueries () {
		console.log('get media queries');
	}
	
	get mixins () {
		return new ChassisMixins(this)
	}
	
	get plugin () {
		let core = new ChassisStylesheet(this, 'stylesheets/core.spec.css')
		
		return (root, result) => {
			result.root = core.css.append(new ChassisStylesheet(this, root).css)
		}
	}
	
	get settings () {
		return new ChassisSettings(this)
	}
	
	get utils () {
		return ChassisUtilities
	}
}

module.exports = ChassisPostCss
