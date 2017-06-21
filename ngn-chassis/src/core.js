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
			this.modifiers,
			this.widthConstraint,
			this.html,
			this.body,
			this.rootHeadings,
			this.outerContainers,
			this.innerContainers,
			this.paragraph,
			this.typographyRanges
		])
	}

	get reset () {
		return this.chassis.utils.files.parseStylesheet('../stylesheets/reset.css')
	}

	get modifiers () {
		return this.chassis.utils.files.parseStylesheet('../stylesheets/global-modifiers.css')
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
		let { constants, settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('html.chassis', [
			// utils.css.newDeclObj('background', `${settings.theme['root-bg-color']}`),
			utils.css.newDeclObj('font-size', `${fontSize}px`),
			utils.css.newDeclObj('line-height', `${utils.units.toEms(lineHeight, fontSize)}em`)
		])
	}

	get body () {
		let { constants, settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('.chassis body', [
			utils.css.newDeclObj('min-width', `${settings.layout.minWidth}px`),
			utils.css.newDeclObj('line-height', `${utils.units.toEms(lineHeight, fontSize)}em`),
			utils.css.newDeclObj('font-family', `${settings.theme.typography['font-family']}`),
			// utils.css.newDeclObj('color', `${settings.theme['text-color']}`)
		])
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
					`${utils.units.toEms(this.baseTypography[headingSizeAliases[i]].lineHeight, this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				),
				utils.css.newDeclObj(
					'margin-bottom',
					`${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[headingSizeAliases[i]].lineHeight), this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				)
			]))
		}

		rules.append(utils.css.newRule('.chassis legend', [
			utils.css.newDeclObj(
				'font-size',
				`${utils.units.toEms(this.baseTypography[formLegendAlias].fontSize, root.fontSize)}rem`
			),
			utils.css.newDeclObj(
				'line-height',
				`${utils.units.toEms(this.baseTypography[formLegendAlias].lineHeight, this.baseTypography[formLegendAlias].fontSize)}em`
			),
			utils.css.newDeclObj(
				'margin-bottom',
				`${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[formLegendAlias].lineHeight), this.baseTypography[formLegendAlias].fontSize)}em`
			)
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

			htmlRule.append(utils.css.newDecl('line-height', `${utils.units.toEms(lineHeight, fontSize)}em`))

			mediaQuery.nodes.push(htmlRule)
			
			let bodyRule = utils.css.newRule('.chassis body', [
				utils.css.newDecl('line-height', `${utils.units.toEms(lineHeight, fontSize)}em`)
			])
			
			mediaQuery.nodes.push(bodyRule)

			let headingSizeAliases = settings.typography.fontSizes.headings
			let formLegendAlias = settings.typography.fontSizes.formLegend

			for (let i = 1; i <= 6; i++) {
				mediaQuery.nodes.push(utils.css.newRule(`.chassis h${i}`, [
					utils.css.newDeclObj(
						'line-height',
						`${utils.units.toEms(range.typography[headingSizeAliases[i]].lineHeight, range.typography[headingSizeAliases[i]].fontSize)}em`
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
					`${utils.units.toEms(range.typography[formLegendAlias].lineHeight, range.typography[formLegendAlias].fontSize)}em`
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
				utils.css.newDecl('line-height', `${utils.units.toEms(lineHeight, fontSize)}em`)
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
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.css.newRule('.chassis p', [
			utils.css.newDeclObj('margin-bottom', '1em')
		])
	}
}

module.exports = ChassisCore
