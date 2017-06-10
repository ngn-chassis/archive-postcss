class ChassisCore {
	constructor (chassis) {
		this.chassis = chassis

		this.baseTypography = chassis.settings.typography.ranges.first.typography

		this.selectors = {
			outerContainers: '.chassis section, .chassis nav, .chassis form',
			innerContainers: '.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed'
		}

		this.css = chassis.utils.newRoot([
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
		return this.chassis.utils.parseStylesheet('stylesheets/reset.css')
	}

	get modifiers () {
		return this.chassis.utils.parseStylesheet('stylesheets/global-modifiers.css')
	}

	get widthConstraint () {
		let { constants, layout, settings, utils } = this.chassis

		let css = utils.newRoot([
			utils.newRule('.chassis .width-constraint', [
				utils.newDeclObj('width', '100%'),
				utils.newDeclObj('min-width', `${settings.layout.minWidth}px`),
				utils.newDeclObj('max-width', `${settings.layout.maxWidth}px`),
				utils.newDeclObj('margin', '0 auto'),
				utils.newDeclObj('padding-left', `${settings.layout.gutter}`),
				utils.newDeclObj('padding-right', `${settings.layout.gutter}`)
			]),
			utils.newAtRule({
				name: 'media',
				params: `screen and (max-width: ${settings.layout.minWidth}px)`,
				nodes: [
					utils.newRule('.chassis .width-constraint', [
						utils.newDecl('padding-left', layout.minGutterWidth),
						utils.newDecl('padding-right', layout.minGutterWidth)
					])
				]
			}),
			utils.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${settings.layout.maxWidth}px)`,
				nodes: [
					utils.newRule('.chassis .width-constraint', [
						utils.newDecl('padding-left', layout.maxGutterWidth),
						utils.newDecl('padding-right', layout.maxGutterWidth)
					])
				]
			})
		])

		return css
	}

	get html () {
		let { constants, settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.newRule('html.chassis', [
			utils.newDeclObj('font-size', `${fontSize}px`),
			utils.newDeclObj('line-height', `${utils.toEms(lineHeight, fontSize)}em`)
		])
	}

	get body () {
		let { constants, settings, utils } = this.chassis

		return utils.newRule('.chassis body', [
			utils.newDeclObj('min-width', `${settings.layout.minWidth}px`)
		])
	}

	get rootHeadings () {
		let { settings, typography, utils } = this.chassis
		let { root } = this.baseTypography

		let headingSizeAliases = settings.typography.fontSizes.headings
		let formLegendAlias = settings.typography.fontSizes.formLegend
		let rules = utils.newRoot([])

		for (let i = 1; i <= 6; i++) {
			rules.append(utils.newRule(`.chassis h${i}`, [
				utils.newDeclObj(
					'font-size',
					`${utils.toEms(this.baseTypography[headingSizeAliases[i]].fontSize, root.fontSize)}em`
				),
				utils.newDeclObj(
					'line-height',
					`${utils.toEms(this.baseTypography[headingSizeAliases[i]].lineHeight, this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				),
				utils.newDeclObj(
					'margin-bottom',
					`${utils.toEms(typography.calculateMarginBottom(this.baseTypography[headingSizeAliases[i]].lineHeight), this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				)
			]))
		}

		rules.append(utils.newRule('.chassis legend', [
			utils.newDeclObj(
				'font-size',
				`${utils.toEms(this.baseTypography[formLegendAlias].fontSize, root.fontSize)}rem`
			),
			utils.newDeclObj(
				'line-height',
				`${utils.toEms(this.baseTypography[formLegendAlias].lineHeight, this.baseTypography[formLegendAlias].fontSize)}em`
			),
			utils.newDeclObj(
				'margin-bottom',
				`${utils.toEms(typography.calculateMarginBottom(this.baseTypography[formLegendAlias].lineHeight), this.baseTypography[formLegendAlias].fontSize)}em`
			)
		]))

		return rules
	}

	get typographyRanges () {
		let { layout, settings, typography, utils } = this.chassis

		let { ranges } = settings.typography
		let mediaQueries = utils.newRoot([])

		for (let i = 1; i < ranges.recordCount; i++) {
			let range = ranges.find(i)
			let { fontSize, lineHeight } = range.typography.root

			let mediaQuery = utils.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${range.bounds.lower}px)`,
				nodes: []
			})

			let htmlRule = utils.newRule('html.chassis', [])

			if (fontSize !== this.baseTypography.root.fontSize) {
				htmlRule.append(utils.newDecl('font-size', `${fontSize}px`))
			}

			htmlRule.append(utils.newDecl('line-height', `${utils.toEms(lineHeight, fontSize)}em`))

			mediaQuery.nodes.push(htmlRule)

			let headingSizeAliases = settings.typography.fontSizes.headings
			let formLegendAlias = settings.typography.fontSizes.formLegend

			for (let i = 1; i <= 6; i++) {
				mediaQuery.nodes.push(utils.newRule(`.chassis h${i}`, [
					utils.newDeclObj(
						'line-height',
						`${utils.toEms(range.typography[headingSizeAliases[i]].lineHeight, range.typography[headingSizeAliases[i]].fontSize)}em`
					),
					utils.newDeclObj(
						'margin-bottom',
						`${utils.toEms(typography.calculateMarginBottom(range.typography[headingSizeAliases[i]].lineHeight), range.typography[headingSizeAliases[i]].fontSize)}em`
					)
				]))
			}

			mediaQuery.nodes.push(utils.newRule('.chassis legend', [
				utils.newDeclObj(
					'line-height',
					`${utils.toEms(range.typography[formLegendAlias].lineHeight, range.typography[formLegendAlias].fontSize)}em`
				),
				utils.newDeclObj(
					'margin-bottom',
					`${utils.toEms(typography.calculateMarginBottom(range.typography[formLegendAlias].lineHeight), range.typography[formLegendAlias].fontSize)}em`
				)
			]))

			mediaQuery.nodes.push(utils.newRule(this.selectors.outerContainers, [
				utils.newDeclObj(
					'margin-bottom',
					`${utils.toEms(layout.calculateMarginBottom(range.typography.root.lineHeight, 'outer'), range.typography.root.fontSize)}em`
				)
			]))

			mediaQuery.nodes.push(utils.newRule(this.selectors.innerContainers, [
				utils.newDeclObj(
					'margin-bottom',
					`${utils.toEms(layout.calculateMarginBottom(range.typography.root.lineHeight, 'inner'), range.typography.root.fontSize)}em`
				)
			]))

			mediaQueries.append(mediaQuery)
		}

		return mediaQueries
	}

	get outerContainers () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.newRule(this.selectors.outerContainers, [
			utils.newDeclObj(
				'margin-bottom',
				`${utils.toEms(layout.calculateMarginBottom(lineHeight, 'outer'), fontSize)}em`
			)
		])
	}

	get innerContainers () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.newRule(this.selectors.innerContainers, [
			utils.newDeclObj(
				'margin-bottom',
				`${utils.toEms(layout.calculateMarginBottom(lineHeight, 'inner'), fontSize)}em`
			)
		])
	}

	get paragraph () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return utils.newRule('.chassis p', [
			utils.newDeclObj('margin-bottom', '1em')
		])
	}
}

module.exports = ChassisCore
