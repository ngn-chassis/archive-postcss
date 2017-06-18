class ChassisTypographyMixins {
  constructor (chassis) {
    this.chassis = chassis
  }

  /**
	 * @mixin ellipsis
	 */
	ellipsis () {
		let { utils } = this.chassis
    let { atRule } = arguments[0]

		atRule.replaceWith([
			utils.css.newDecl('white-space', 'nowrap'),
			utils.css.newDecl('overflow', 'hidden'),
			utils.css.newDecl('text-overflow', 'ellipsis')
		])
	}

  fontSize () {
		let { constants, settings, typography, utils } = this.chassis
		let { args, atRule, source } = arguments[0]

		let alias = args[0]
		let multiplier = 1
		let addMargin = false

		if (!constants.typography.sizeAliases.includes(alias)) {
			console.log(`[ERROR] Line ${source.line}: Font size alias "${alias}" not found.  Accepted values: ${utils.string.listValues(constants.typography.sizeAliases)}`);
			atRule.remove()
			return
		}

		if (args.length > 0) {
			for (let i = 1; i < args.length; i++) {
				if (args[i].startsWith('mult')) {
					multiplier = parseFloat(utils.string.stripParentheses(args[i].replace('mult', '')))
				} else if (args[i] === 'add-margin') {
					addMargin = true
				} else {
					console.warn(`[WARNING] Line ${source.line}: Unkown argument "${arg}". Skipping...`)
				}
			}
		}

		if (isNaN(multiplier)) {
			console.warn(`[WARNING] Line ${source.line}: mult() value must be a valid decimal. Ignoring...`)
		}

		let decl = utils.css.newDecl(
			'font-size',
			`${utils.units.toEms(typography.calculateFontSize(alias, multiplier), typography.calculateFontSize('root'))}rem`
		)

		atRule.replaceWith(decl)
  }
}

module.exports = ChassisTypographyMixins
