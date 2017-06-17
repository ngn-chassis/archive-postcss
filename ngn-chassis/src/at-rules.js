const ChassisLayoutMixins = require('./mixins/layout.js')
const ChassisViewportMixins = require('./mixins/viewport.js')

class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis

		this.layoutMixins = new ChassisLayoutMixins(chassis)
		this.viewportMixins = new ChassisViewportMixins(chassis)

		this.mappings = {
			'constrain-width': this.layoutMixins.constrainWidth,
			'ellipsis': this.ellipsis,
			'ie-only': this.ieOnly,
			'font-size': this.fontSize,
			'viewport-height': this.viewportMixins.height,
			'viewport-width': this.viewportMixins.width,
			'z-index': this.zIndex
		}

		Object.keys(this.mappings).forEach((mixin) => {
			this.mappings[mixin] = this.mappings[mixin].bind(this)
		})
	}

	/**
	 * @mixin ellipsis
	 */
	ellipsis () {
		let { utils } = this.chassis

		this.atRule.replaceWith([
			utils.css.newDecl('white-space', 'nowrap'),
			utils.css.newDecl('overflow', 'hidden'),
			utils.css.newDecl('text-overflow', 'ellipsis')
		])
	}

	/**
	 * @mixin ieOnly
	 * TODO: Implement version support
	 */
	ieOnly () {
		let { utils } = this.chassis

		this.atRule.replaceWith(utils.css.newAtRule({
			name: 'media',
			params: 'all and (-ms-high-contrast: none)',
			nodes: this.nodes.map((rule) => {
				rule.selector = `*::-ms-backdrop, ${rule.selector}`
				return rule
			})
		}))
	}

	fontSize () {
		let { constants, settings, typography, utils } = this.chassis
		let { args } = this.cfg

		let alias = args[0]
		let multiplier = 1
		let addMargin = false

		if (!constants.typography.sizeAliases.includes(alias)) {
			console.log(`[ERROR] Line ${this.source.line}: Font size alias "${alias}" not found.  Accepted values: ${utils.string.listValues(constants.typography.sizeAliases)}`);
			this.atRule.remove()
			return
		}

		if (args.length > 0) {
			for (let i = 1; i < args.length; i++) {
				if (args[i].startsWith('mult')) {
					multiplier = parseFloat(utils.string.stripParentheses(args[i].replace('mult', '')))
				} else if (args[i] === 'add-margin') {
					addMargin = true
				} else {
					console.warn(`[WARNING] Line ${this.source.line}: Unkown argument "${arg}". Skipping...`)
				}
			}
		}

		if (isNaN(multiplier)) {
			console.warn(`[WARNING] Line ${this.source.line}: mult() value must be a valid decimal. Ignoring...`)
		}

		let decl = utils.css.newDecl(
			'font-size',
			`${utils.units.toEms(typography.calculateFontSize(alias, multiplier), typography.calculateFontSize('root'))}rem`
		)

		this.atRule.replaceWith(decl)
  }

	/**
	 * @mixin zIndex
	 * Get calculated z-index value from project settings
	 */
	zIndex () {
		let { settings, utils } = this.chassis
		let index = settings.zIndex[this.cfg.args[0]]

		if (!index) {
			console.error(`[ERROR] Line ${this.source.line}: Invalid z-index alias. Accepted values: ${utils.string.listValues(settings.zIndex)}`)
		}

		this.atRule.replaceWith(utils.css.newDecl('z-index', index))
	}

	process (root, atRule, data) {
		this.root = root
		this.atRule = atRule

		for (let property in data) {
			this[property] = data[property]
		}

		if (this.mappings.hasOwnProperty(data.mixin)) {
			this.mappings[data.mixin](root, atRule, data)
			return
		}

		console.error(`[ERROR] Line ${data.source.line}: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
