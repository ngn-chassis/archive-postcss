require('ngn')
require('ngn-data')

const ChassisGenerator = require('./generator.js')
const ChassisImporter = require('./importer.js')
const ChassisMixins = require('./mixins.js')
const ChassisProject = require('./project.js')
const ChassisStylesheet = require('./stylesheet.js')
const ChassisUtilities = require('./utilities.js')

class ChassisPostCss {
	constructor (cfg) {
		this.cfg = NGN.coalesce(cfg, {})
		return this.plugin
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
		
		return (input, output) => {
			// TODO: Process user stylesheet
			
			output.root = core.css.append(input)
		}
	}
	
	get project () {
		return new ChassisProject(this)
	}
	
	get utils () {
		return ChassisUtilities
	}
}

module.exports = ChassisPostCss
