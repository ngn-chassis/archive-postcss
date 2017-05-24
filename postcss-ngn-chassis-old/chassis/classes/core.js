const ChassisUtils = require('../utilities')

class ChassisCore {
	constructor (project) {
		this.project = project
	}

	/**
   * @property _defaultMediaQueries
   * Create media queries for default typography settings
   * @private
   */
  get _defaultMediaQueries () {
    let { typography, viewport } = this.project

    return viewport.widthRanges.map((range, index) => {
			if (index === 0) {
				return
			}
			
			let queryType = index === viewport.widthRanges.length - 1 ? 'min' : 'at'
      let mediaQuery = viewport.getMediaQuery(queryType, range.name)

      let rule = ChassisUtils.newRule('.chassis', [
        ChassisUtils.newDeclObj(
					'font-size',
					`${typography.getFontSize('root', range.upperBound)}px`
				),
        ChassisUtils.newDeclObj(
					'line-height',
					`${typography.getLineHeight('root', range.upperBound)}em`
				)
      ])
			
			let headingStyles = []
			
			for (let i = 1; i <= 6; i++) {
				headingStyles.push(ChassisUtils.newRule(
					`.chassis h${i}`,
					this._getDefaultHeadingProperties(i, range, true)
				))
			}

      mediaQuery.nodes = [
        ...mediaQuery.nodes,
        rule,
				...headingStyles,
				ChassisUtils.newRule(
					'.chassis legend',
					this._getDefaultFormLegendProperties(range, true)
				),
				ChassisUtils.newRule(
					'.chassis section, .chassis nav, .chassis form',
					this._getDefaultContainerProperties(range, true)
				),
				ChassisUtils.newRule(
					'.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed',
					this._getDefaultBlockProperties(range, true)
				),
				ChassisUtils.newRule(
					'.chassis p',
					this._getDefaultParagraphProperties(range, true)
				)
      ]

      return mediaQuery

    }).filter(mediaQuery => mediaQuery !== undefined)
  }

	/**
   * @method _getDefaultBlockProperties
   * Get default decls for Block elements
   * @param {object} range
   * Viewport width range from which to calculate property values
	 * @param {boolean} raw
	 * if true, return an array of simple objects, else return postcss decl object
   * @return {rule}
   * @private
   */
  _getDefaultBlockProperties (range, raw = false) {
		let { layout } = this.project

		if (raw) {
			return [ChassisUtils.newDeclObj(
				'margin-bottom',
				`${layout.getMargin('root', range.upperBound, 'block')}em`
			)]
		}

    return ChassisUtils.newDecl(
			'margin-bottom',
			`${layout.getMargin('root', range.upperBound, 'block')}em`
		)
  }

	/**
   * @method _getDefaultContainerProperties
   * Get default decls for Container elements
   * @param {object} range
   * Viewport width range from which to calculate property values
	 * @param {boolean} raw
   * if true, return an array of simple objects, else return postcss decl object
   * @return {rule}
   * @private
   */
  _getDefaultContainerProperties (range, raw = false) {
		let { layout } = this.project

		if (raw) {
			return [ChassisUtils.newDeclObj(
				'margin-bottom',
				`${layout.getMargin('root', range.upperBound, 'container')}em`
			)]
		}

    return ChassisUtils.newDecl(
			'margin-bottom',
			`${layout.getMargin('root', range.upperBound, 'container')}em`
		)
  }

	/**
   * @method _getDefaultFormLegendProperties
   * Get GR-Typography default settings for legend tags
   * @param {object} range
   * Viewport width range from which to calculate property values
	 * @param {boolean} raw
   * if true, return an array of simple objects, else return postcss decl object
   * @return {rule}
   * @private
   */
  _getDefaultFormLegendProperties (range, raw = false) {
		let { typography } = this.project
    let alias = typography.fontSizes.formLegend

    let fontSize = `${typography.getFontSize(alias, range.upperBound, true)}em`
    let lineHeight = `${typography.getLineHeight(alias, range.upperBound)}em`
    let marginBottom = `${typography.getMargin(alias, range.upperBound)}em`

		if (raw) {
			return [
	      ChassisUtils.newDeclObj('font-size', fontSize),
	      ChassisUtils.newDeclObj('line-height', lineHeight),
	      ChassisUtils.newDeclObj('margin-bottom', marginBottom)
	    ]
		}

    return [
      ChassisUtils.newDecl('font-size', fontSize),
      ChassisUtils.newDecl('line-height', lineHeight),
      ChassisUtils.newDecl('margin-bottom', marginBottom)
    ]
  }

	/**
   * @method _getDefaultHeadingProperties
   * Generate default styles for h1-h6
   * @param {object} range
   * Viewport width range from which to calculate property values
	 * @param {boolean} raw
   * if true, return an array of simple objects, else return postcss decl object
   * @private
   */
  _getDefaultHeadingProperties (level, range, raw = false) {
    let { typography } = this.project
		let alias = typography.fontSizes.headings[level]

		let fontSize = `${typography.getFontSize(alias, range.upperBound, true)}em`
		let lineHeight = `${typography.getLineHeight(alias, range.upperBound)}em`
		let marginBottom = `${typography.getMargin(alias, range.upperBound)}em`

		if (raw) {
			return [
				ChassisUtils.newDeclObj('font-size', fontSize),
				ChassisUtils.newDeclObj('line-height', lineHeight),
				ChassisUtils.newDeclObj('margin-bottom', marginBottom)
			]
		}

		return [
			ChassisUtils.newDecl('font-size', fontSize),
			ChassisUtils.newDecl('line-height', lineHeight),
			ChassisUtils.newDecl('margin-bottom', marginBottom)
		]
  }

	/**
   * @method _getDefaultParagraphProperties
   * Get default styles for p tags
   * @param {object} range
   * Viewport width range from which to calculate property values
	 * @param {boolean} raw
   * if true, return an array of simple objects, else return postcss decl object
   * @private
   */
  _getDefaultParagraphProperties (range, raw = false) {
		let { typography } = this.project

		if (raw) {
			return [ChassisUtils.newDeclObj(
				'margin-bottom',
				`${typography.getMargin('root', range.upperBound)}em`
			)]
		}

    return ChassisUtils.newDecl(
			'margin-bottom',
			`${typography.getMargin('root', range.upperBound)}em`
		)
  }

	generate () {
		let { plugins } = this.project
		let root = ChassisUtils.parseStylesheet('stylesheets/core.spec.css')

		root.walkAtRules((atRule) => {
			let params = atRule.params.split(' ')
			let mixin = params[0]
			let args = params.length > 1 ? params.slice(1) : null

			if (atRule.name === 'chassis') {
				this.processChassisAtRule(atRule, mixin, args)
			}

			if (atRule.name === 'detailer' && plugins.includes('Detailer')) {
				this.processDetailerAtRule(atRule, mixin, args)
			} else {
				atRule.remove()
			}
		})

		return root
	}

	processChassisAtRule (atRule, mixin, args) {
		let { layout, mixins, typography, viewport } = this.project
		let firstRange = viewport.widthRanges[0]

		if (mixin === 'import') {
			atRule.replaceWith(ChassisUtils.parseStylesheet(`stylesheets/partials/${args[0]}.css`))
			return
		}

		if (mixin === 'generate') {
			switch (args[0]) {
				case 'font-weight-vars':
					// TODO: Insert a CSS comment explaining these here
					atRule.replaceWith(Object.keys(typography.fontWeights).map(weight => {
						return ChassisUtils.newDecl(`--${weight}`, typography.fontWeights[weight])
					}))
					break

				case 'font-weight-classes':
					// TODO: Insert a CSS comment explaining these here
					atRule.replaceWith(Object.keys(typography.fontWeights).map(weight => {
			      return ChassisUtils.newRule(`.${weight}-weight`, [
			        ChassisUtils.newDeclObj(
			          'font-weight',
			          `var(--${weight}) !important`
			        )
			      ])
			    }))
					break

				case 'width-constraint':
					atRule.replaceWith([
						ChassisUtils.newRule('.width-constraint', mixins.layout.constrainWidth()),
						ChassisUtils.newAtRule({
				      name: 'media',
				      params: `screen and (max-width: ${layout.minWidth}px)`,
				      nodes: [
				        ChassisUtils.newRule('.width-constraint', [
				          ChassisUtils.newDeclObj(
										'padding-left',
										layout.getGutterLimit(layout.minWidth)
									),
				          ChassisUtils.newDeclObj(
										'padding-right',
										layout.getGutterLimit(layout.minWidth)
									)
				        ])
				      ]
				    }),
						ChassisUtils.newAtRule({
				      name: 'media',
				      params: `screen and (min-width: ${layout.maxWidth}px)`,
				      nodes: [
				        ChassisUtils.newRule('.width-constraint', [
				          ChassisUtils.newDeclObj(
										'padding-left',
										layout.getGutterLimit(layout.maxWidth)
									),
				          ChassisUtils.newDeclObj(
										'padding-right',
										layout.getGutterLimit(layout.maxWidth)
									)
				        ])
				      ]
				    })
					])
					break

				case 'root-container-styles':
					atRule.replaceWith([
			      ChassisUtils.newDecl('min-width', `${layout.minWidth}px`),
			      ChassisUtils.newDecl('margin', '0'),
			      ChassisUtils.newDecl('padding', '0'),
			      ChassisUtils.newDecl(
							'font-size',
							`${typography.getFontSize('root', firstRange.upperBound)}px`
						),
			      ChassisUtils.newDecl(
							'line-height',
							`${typography.getLineHeight('root', firstRange.upperBound)}em`
						)
			    ])
					break

				case 'default-h1-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(1, firstRange))
					break

				case 'default-h2-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(2, firstRange))
					break

				case 'default-h3-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(3, firstRange))
					break

				case 'default-h4-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(4, firstRange))
					break

				case 'default-h5-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(5, firstRange))
					break

				case 'default-h6-styles':
					atRule.replaceWith(this._getDefaultHeadingProperties(6, firstRange))
					break

				case 'default-form-legend-styles':
					atRule.replaceWith(this._getDefaultFormLegendProperties(firstRange))
					break

				case 'default-container-styles':
					atRule.replaceWith(this._getDefaultContainerProperties(firstRange))
					break

				case 'default-block-styles':
					atRule.replaceWith(this._getDefaultBlockProperties(firstRange))
					break

				case 'default-paragraph-styles':
					atRule.replaceWith(this._getDefaultParagraphProperties(firstRange))
					break

				case 'default-media-queries':
					atRule.replaceWith(this._defaultMediaQueries)
					break

				default:
					atRule.remove()
			}
		}
	}

	processDetailerAtRule (atRule, mixin, args) {
		let Detailer = this.project.plugins.get('Detailer')

		if (mixin === 'import') {
			atRule.replaceWith(ChassisUtils.parseStylesheet(`${Detailer.basePath}/stylesheets/core/${args[0]}.css`))
			return
		}

		if (mixin === 'generate') {
			switch (args[0]) {
				case 'root-container-styles':
					atRule.replaceWith(Detailer.rootContainerStyles.map(decl => {
						return ChassisUtils.newDecl(decl.param, decl.value)
					}))
					break;

				default:
					atRule.remove()
			}
		}
	}
}

module.exports = ChassisCore
