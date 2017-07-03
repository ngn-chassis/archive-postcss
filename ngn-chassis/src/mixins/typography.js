class ChassisTypographyMixins {
  constructor (chassis) {
    this.chassis = chassis
    this.baseTypography = chassis.settings.typography.ranges.first.typography
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

  layout () {
    let { settings, typography, utils } = this.chassis
    let { args, atRule, source } = arguments[0]
    let { fontSize, lineHeight } = this.baseTypography.root

    let model = args[0]
    let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

    let decls = [
      utils.css.newDecl('margin', `0 ${typography.calculateInlineMarginX(lineHeightInEms)}em ${typography.calculateInlineMarginY(lineHeightInEms)}em 0`),
			utils.css.newDecl('padding', `0 ${typography.calculateInlinePaddingX(lineHeightInEms)}em`),
			utils.css.newDecl('line-height', `${typography.calculateInlineHeight(lineHeightInEms)}em`)
    ]

    atRule.replaceWith(decls)
  }
}

module.exports = ChassisTypographyMixins
