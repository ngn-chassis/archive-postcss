const postcss = require('postcss')
const customProperties = require('postcss-custom-properties')

class ChassisCore {
	constructor (chassis) {
		this.chassis = chassis

		this.baseTypography = chassis.settings.typography.ranges.first.typography

		this.selectors = {
			outerContainers: '.chassis section, .chassis nav, .chassis form',
			innerContainers: '.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed'
		}
	}

	get css () {
		return this.chassis.utils.css.newRoot([
			this.reset,
			this.customProperties,
			this.modifiers,
			this.widthConstraint,
			this.html,
			this.body,
			this.rootHeadings,
			this.outerContainers,
			this.innerContainers,
			this.paragraph,
			this.typographyRanges,
			this.inlineComponentReset,
			this.inlineBlockComponentReset,
			this.blockComponentReset
		])
	}

	get reset () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRoot([
			utils.css.newAtRule({
				name: 'charset',
				params: '"UTF-8"'
			}),
			utils.css.newRule('*, *:before, *:after', [
				utils.css.newDeclObj('box-sizing', 'border-box')
			]),
			utils.css.newRule('html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video', [
				utils.css.newDeclObj('margin', '0'),
				utils.css.newDeclObj('padding', '0'),
				utils.css.newDeclObj('border', '0'),
				utils.css.newDeclObj('font', 'inherit'),
				utils.css.newDeclObj('font-size', '100%'),
				utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
				utils.css.newDeclObj('vertical-align', 'baseline')
			]),
			utils.css.newRule('ol, ul', [
				utils.css.newDeclObj('list-style', 'none')
			]),
			utils.css.newRule('q, blockquote', [
				utils.css.newDeclObj('quotes', 'none')
			]),
			utils.css.newRule('q:before, q:after, blockquote:before, blockquote:after', [
				utils.css.newDeclObj('content', '""'),
				utils.css.newDeclObj('content', 'none')
			]),
			utils.css.newRule('q, blockquote', [
				utils.css.newDeclObj('quotes', 'none')
			]),
			utils.css.newRule('a img', [
				utils.css.newDeclObj('border', 'none')
			]),
			utils.css.newRule('article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary', [
				utils.css.newDeclObj('display', 'block')
			]),
			utils.css.newRule('input, textarea, button', [
				utils.css.newDeclObj('font-size', 'inherit'),
				utils.css.newDeclObj('line-height', 'inherit')
			])
		])
	}

	get customProperties () {
		let { settings, utils } = this.chassis

		return utils.css.newRule(':root', [
			...utils.files.parseStylesheet('../stylesheets/copic-greys.css').nodes,
			utils.css.newDeclObj('--ui-min-width', `${settings.layout.minWidth}px`),
			utils.css.newDeclObj('--ui-max-width', `${settings.layout.maxWidth}px`),
			utils.css.newDeclObj('--ui-gutter', `${settings.layout.gutter}`),
			...this.getThemeDecls('custom-properties')
		])
	}

	get modifiers () {
		let { utils } = this.chassis

		return utils.files.parseStylesheet('../stylesheets/global-modifiers.css')
	}

	get widthConstraint () {
		let { constants, layout, settings, utils } = this.chassis

		let css = utils.css.newRoot([
			utils.css.newRule('.chassis .width-constraint', [
				utils.css.newDeclObj('width', '100%'),
				utils.css.newDeclObj('min-width', `${settings.layout.minWidth}px`),
				utils.css.newDeclObj('max-width', `${settings.layout.maxWidth}px`),
				utils.css.newDeclObj('margin', '0 auto'),
				utils.css.newDeclObj('padding-left', `${settings.layout.gutter}`),
				utils.css.newDeclObj('padding-right', `${settings.layout.gutter}`)
			]),
			utils.css.newAtRule({
				name: 'media',
				params: `screen and (max-width: ${settings.layout.minWidth}px)`,
				nodes: [
					utils.css.newRule('.chassis .width-constraint', [
						utils.css.newDecl('padding-left', layout.minGutterWidth),
						utils.css.newDecl('padding-right', layout.minGutterWidth)
					])
				]
			}),
			utils.css.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${settings.layout.maxWidth}px)`,
				nodes: [
					utils.css.newRule('.chassis .width-constraint', [
						utils.css.newDecl('padding-left', layout.maxGutterWidth),
						utils.css.newDecl('padding-right', layout.maxGutterWidth)
					])
				]
			})
		])

		return css
	}

	get html () {
		let { constants, settings, theme, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('html.chassis', [
			utils.css.newDeclObj('font-size', `${fontSize}px`),
			...this.getThemeDecls('html')]
		)
	}

	get body () {
		let { constants, settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('.chassis body', [
			utils.css.newDeclObj('min-width', `${settings.layout.minWidth}px`),
			...this.getThemeDecls('body')]
		)
	}

	get rootHeadings () {
		let { settings, typography, utils } = this.chassis
		let { root } = this.baseTypography

		let headingSizeAliases = settings.typography.fontSizes.headings
		let formLegendAlias = settings.typography.fontSizes.formLegend
		let rules = utils.css.newRoot([])

		for (let i = 1; i <= 6; i++) {
			rules.append(utils.css.newRule(`.chassis h${i}`, [
				utils.css.newDeclObj(
					'font-size',
					`${utils.units.toEms(this.baseTypography[headingSizeAliases[i]].fontSize, root.fontSize)}em`
				),
				utils.css.newDeclObj(
					'line-height',
					`${utils.units.toEms(this.baseTypography[headingSizeAliases[i]].lineHeight, this.baseTypography[headingSizeAliases[i]].fontSize)}`
				),
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[headingSizeAliases[i]].lineHeight), this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				),
				...this.getThemeDecls(`h${i}`)
			]))
		}

		rules.append(utils.css.newRule('.chassis legend', [
			utils.css.newDeclObj(
				'font-size',
				`${utils.units.toEms(this.baseTypography[formLegendAlias].fontSize, root.fontSize)}rem`
			),
			utils.css.newDeclObj(
				'line-height',
				`${utils.units.toEms(this.baseTypography[formLegendAlias].lineHeight, this.baseTypography[formLegendAlias].fontSize)}`
			),
			utils.css.newDeclObj(
				'margin-bottom',
				`${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[formLegendAlias].lineHeight), this.baseTypography[formLegendAlias].fontSize)}em`
			),
			...this.getThemeDecls('legend')
		]))

		return rules
	}

	get typographyRanges () {
		let { layout, settings, typography, utils } = this.chassis

		let { ranges } = settings.typography
		let mediaQueries = utils.css.newRoot([])

		for (let i = 1; i < ranges.recordCount; i++) {
			let range = ranges.find(i)
			let { fontSize, lineHeight } = range.typography.root

			let mediaQuery = utils.css.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${range.bounds.lower}px)`,
				nodes: []
			})

			let htmlRule = utils.css.newRule('html.chassis', [])

			if (fontSize !== this.baseTypography.root.fontSize) {
				htmlRule.append(utils.css.newDecl('font-size', `${fontSize}px`))
			}

			htmlRule.append(utils.css.newDecl('line-height', `${utils.units.toEms(lineHeight, fontSize)}`))

			mediaQuery.nodes.push(htmlRule)

			let bodyRule = utils.css.newRule('.chassis body', [
				utils.css.newDecl('line-height', `${utils.units.toEms(lineHeight, fontSize)}`)
			])

			mediaQuery.nodes.push(bodyRule)

			let headingSizeAliases = settings.typography.fontSizes.headings
			let formLegendAlias = settings.typography.fontSizes.formLegend

			for (let i = 1; i <= 6; i++) {
				mediaQuery.nodes.push(utils.css.newRule(`.chassis h${i}`, [
					utils.css.newDeclObj(
						'line-height',
						`${utils.units.toEms(range.typography[headingSizeAliases[i]].lineHeight, range.typography[headingSizeAliases[i]].fontSize)}`
					),
					utils.css.newDeclObj(
						'margin-bottom',
						`${utils.units.toEms(typography.calculateMarginBottom(range.typography[headingSizeAliases[i]].lineHeight), range.typography[headingSizeAliases[i]].fontSize)}em`
					)
				]))
			}

			mediaQuery.nodes.push(utils.css.newRule('.chassis legend', [
				utils.css.newDeclObj(
					'line-height',
					`${utils.units.toEms(range.typography[formLegendAlias].lineHeight, range.typography[formLegendAlias].fontSize)}`
				),
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(typography.calculateMarginBottom(range.typography[formLegendAlias].lineHeight), range.typography[formLegendAlias].fontSize)}em`
				)
			]))

			mediaQuery.nodes.push(utils.css.newRule(this.selectors.outerContainers, [
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(layout.calculateMarginBottom(range.typography.root.lineHeight, 'outer'), range.typography.root.fontSize)}em`
				)
			]))

			mediaQuery.nodes.push(utils.css.newRule(this.selectors.innerContainers, [
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(layout.calculateMarginBottom(range.typography.root.lineHeight, 'inner'), range.typography.root.fontSize)}em`
				)
			]))

			mediaQuery.nodes.push(utils.css.newRule('.chassis p', [
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(range.typography.root.lineHeight, range.typography.root.fontSize)}em`
				),
				utils.css.newDecl(
					'line-height',
					`${utils.units.toEms(lineHeight, fontSize)}`
				)
			]))

			mediaQueries.append(mediaQuery)
		}

		return mediaQueries
	}

	get outerContainers () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule(this.selectors.outerContainers, [
			utils.css.newDeclObj(
				'margin-bottom',
				`${utils.units.toEms(layout.calculateMarginBottom(lineHeight, 'outer'), fontSize)}em`
			)
		])
	}

	get innerContainers () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule(this.selectors.innerContainers, [
			utils.css.newDeclObj(
				'margin-bottom',
				`${utils.units.toEms(layout.calculateMarginBottom(lineHeight, 'inner'), fontSize)}em`
			)
		])
	}

	get paragraph () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('.chassis p', [
			utils.css.newDeclObj(
				'margin-bottom',
				`${utils.units.toEms(lineHeight, fontSize)}em`
			)
		])
	}

	get inlineComponentReset () {
		let { utils } = this.chassis

		return utils.css.newAtRule({
			name: 'chassis-post',
			params: 'component-reset inline',
			nodes: utils.files.parseStylesheet('../stylesheets/inline-component-reset.css').nodes
		})
	}
	
	get inlineBlockComponentReset () {
		let { utils } = this.chassis

		return utils.css.newAtRule({
			name: 'chassis-post',
			params: 'component-reset inline-block',
			nodes: utils.files.parseStylesheet('../stylesheets/inline-block-component-reset.css').nodes
		})
	}
	
	get blockComponentReset () {
		let { utils } = this.chassis

		return utils.css.newAtRule({
			name: 'chassis-post',
			params: 'component-reset block',
			nodes: utils.files.parseStylesheet('../stylesheets/block-component-reset.css').nodes
		})
	}

	getThemeDecls (component) {
		let { theme, utils } = this.chassis
		let decls = theme.getComponentProperties(component)

		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDeclObj(decl, decls[decl]))
		}

		return []
	}
}

module.exports = ChassisCore
