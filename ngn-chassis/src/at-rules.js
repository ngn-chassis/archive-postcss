const ChassisBrowserMixins = require('./mixins/browser.js')
const ChassisLayoutMixins = require('./mixins/layout.js')
const ChassisTypographyMixins = require('./mixins/typography.js')
const ChassisViewportMixins = require('./mixins/viewport.js')

class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis

		this.layoutMixins = new ChassisLayoutMixins(chassis)
		this.browserMixins = new ChassisBrowserMixins(chassis)
		this.typographyMixins = new ChassisTypographyMixins(chassis)
		this.viewportMixins = new ChassisViewportMixins(chassis)
	}

	get 'constrain-width' () {
		return this.layoutMixins.constrainWidth.bind(this)
	}

	get 'ellipsis' () {
		return this.typographyMixins.ellipsis.bind(this)
	}

	get 'ie-only' () {
		return this.browserMixins.ieOnly.bind(this)
	}

	get 'font-size' () {
		return this.typographyMixins.fontSize.bind(this)
	}

	get 'viewport-height' () {
		return this.viewportMixins.height.bind(this)
	}

	get 'viewport-width' () {
		return this.viewportMixins.width.bind(this)
	}

	get 'z-index' () {
		return this.layoutMixins.zIndex.bind(this)
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
