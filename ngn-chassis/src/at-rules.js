class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis

		this.mixins = {
			'constrain-width': this.constrainWidth.bind(this),
			'ellipsis': this.ellipsis.bind(this),
			'ie-only': this.ieOnly.bind(this),
			'viewport-width': this.viewportWidth.bind(this),
			'viewport-height': this.viewportHeight.bind(this),
			'z-index': this.zIndex.bind(this)
		}
	}
	
	/**
	 * @mixin constrainWidth
	 * @return {array} of decls
	 */
	constrainWidth () {
		let { layout, settings, utils } = this.chassis
		let { minWidth, maxWidth, gutter } = settings.layout
		let { args } = this.cfg
		let parent = this.atRule.parent
		
		if (args && args.length > 0) {
			args.forEach((arg) => {
				if (arg.startsWith('min')) {
					minWidth = utils.string.stripParentheses(arg.replace('min', ''))
				} else if (arg.startsWith('max')) {
					maxWidth = utils.string.stripParentheses(arg.replace('max', ''))
				} else if (arg.startsWith('gutter')) {
					gutter = utils.string.stripParentheses(arg.replace('gutter', ''))
				} else {
					console.warn(`[WARNING] Line ${this.source.line}: Unkown argument "${arg}". Skipping...`)
				}
			})
		}
		
		let decls = [
			utils.css.newDecl('width', '100%'),
			utils.css.newDecl('min-width', `${minWidth}px`),
			utils.css.newDecl('max-width', `${maxWidth}px`),
			utils.css.newDecl('margin', '0 auto')
		]
		
		if (parseInt(gutter) !== 0) {
			decls = [
				...decls,
				utils.css.newDecl('padding-left', gutter),
				utils.css.newDecl('padding-right', gutter)
			]
		
			this.root.insertAfter(this.atRule.parent, utils.css.newAtRule({
				name: 'media',
				params: `screen and (max-width: ${minWidth}px)`,
				nodes: [
					utils.css.newRule(this.atRule.parent.selector, [
						utils.css.newDeclObj('padding-left', layout.getGutterLimit(minWidth)),
						utils.css.newDeclObj('padding-right', layout.getGutterLimit(minWidth))
					])
				]
			}))
		
			this.root.insertAfter(this.atRule.parent, utils.css.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${maxWidth}px)`,
				nodes: [
					utils.css.newRule(this.atRule.parent.selector, [
						utils.css.newDeclObj('padding-left', layout.getGutterLimit(maxWidth)),
						utils.css.newDeclObj('padding-right', layout.getGutterLimit(maxWidth))
					])
				]
			}))
		}
		
		this.atRule.replaceWith(decls)
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

	viewportWidth () {
		let { settings, utils, viewport } = this.chassis

		let operator = this.cfg.args[0]
			
		if (!viewport.operatorIsValid(operator)) {
			console.error(`[ERROR] Line ${this.source.line}: Invalid media query operator "${operator}".`)
			this.atRule.remove()
			return
		}
		
		let width = parseInt(this.cfg.args[1])
		let isRange = false
		
		if (isNaN(width)) {
			let name = this.cfg.args[1]
			
			width = settings.viewportWidthRanges.find({name})[0]
			
			if (!width) {
				console.error(`[ERROR] Line ${this.source.line}: Viewport Width Range "${this.cfg.args[1]}" not found.`)
				this.atRule.remove()
				return
			}
			
			isRange = true
		}
		
		if (operator === 'from') {
			let secondOperator = this.cfg.args[2]
			
			if (secondOperator !== undefined) {
				if (secondOperator !== 'to') {
					console.error(`[ERROR] Line ${this.source.line}: Invalid second media query operator "${secondOperator}". Please use "to" instead.`)
					this.atRule.remove()
					return
				}
				
				operator = '='
				
				let secondWidthValue = this.cfg.args[3]
				let secondWidthValueIsRange = false
				
				if (isNaN(secondWidthValue)) {
					secondWidthValue = settings.viewportWidthRanges.find({
						name: secondWidthValue
					})[0]
					
					if (!secondWidthValue) {
						console.error(`[ERROR] Line ${this.source.line}: Viewport Width Range "${this.cfg.args[3]}" not found.`)
						this.atRule.remove()
						return
					}
					
					secondWidthValueIsRange = true
				}
				
				if (secondWidthValue) {
					width = {
						name: 'custom',
						lowerBound: isRange ? width.lowerBound : width,
						upperBound: secondWidthValueIsRange ? secondWidthValue.upperBound : secondWidthValue
					}
				}
			}
		}

		let mediaQuery = utils.css.newMediaQuery(
			viewport.getMediaQueryParams('width', operator, width),
			this.nodes
		)
		
		this.atRule.replaceWith(mediaQuery)
	}

	viewportHeight () {
		let { settings, utils, viewport } = this.chassis

		let operator = this.cfg.args[0]
		let height = parseInt(this.cfg.args[1])
		
		if (isNaN(height)) {
			console.error(`[ERROR] Line ${this.source.line}: Invalid viewport height value "${this.cfg.args[1]}".`)
			this.atRule.remove()
			return
		}

		let mediaQuery = utils.css.newMediaQuery(
			viewport.getMediaQueryParams('height', operator, height),
			this.nodes
		)

		this.atRule.replaceWith(mediaQuery)
	}

	/**
   * @mixin zIndex
   * Get calculated z-index value from project settings
   */
  zIndex () {
		let { settings, utils } = this.chassis
    let index = settings.zIndex[this.cfg.args[0]]

    if (!index) {
      console.error(`[ERROR] Line ${this.source.line}: Invalid z-index alias. Accepted values: ${Object.keys(settings.zIndex).join(', ')}`)
    }

    this.atRule.replaceWith(utils.css.newDecl('z-index', index))
  }

	process (root, atRule, data) {
		this.root = root
		this.atRule = atRule

		for (let property in data) {
			this[property] = data[property]
		}

		if (this.mixins.hasOwnProperty(data.mixin)) {
			this.mixins[data.mixin]()
			return
		}

		console.error(`[ERROR] Line ${data.source.line}: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
