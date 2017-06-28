const ChassisBrowserMixins = require('./mixins/browser.js')
const ChassisComponentMixins = require('./mixins/component.js')
const ChassisLayoutMixins = require('./mixins/layout.js')
const ChassisTypographyMixins = require('./mixins/typography.js')
const ChassisViewportMixins = require('./mixins/viewport.js')

class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis
		
		this.browserMixins = new ChassisBrowserMixins(chassis)
		this.componentMixins = new ChassisComponentMixins(chassis)
		this.layoutMixins = new ChassisLayoutMixins(chassis)
		this.typographyMixins = new ChassisTypographyMixins(chassis)
		this.viewportMixins = new ChassisViewportMixins(chassis)
	}

	get 'constrain-width' () {
		return (data) => this.layoutMixins.constrainWidth(data)
	}
	
	get 'ellipsis' () {
		return (data) => this.typographyMixins.ellipsis(data)
	}
	
	get 'ie-only' () {
		return (data) => this.browserMixins.ieOnly(data)
	}
	
	get 'include' () {
		return (data) => this.componentMixins.include(data)
	}
	
	get 'font-size' () {
		return (data) => this.typographyMixins.fontSize(data)
	}
	
	get 'viewport-height' () {
		return (data) => this.viewportMixins.height(data)
	}
	
	get 'viewport-width' () {
		return (data) => this.viewportMixins.width(data)
	}
	
	get 'z-index' () {
		return (data) => this.layoutMixins.zIndex(data)
	}
	
	runMixin (mixin) {
		return this[mixin]()
	}

	process (data) {
		if (data.mixin in this) {
			this[data.mixin](data)
			return
		}

		console.error(`[ERROR] Line ${data.source.line}: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
