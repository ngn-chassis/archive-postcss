// TODO: Refactor to use spec sheet

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
		let { utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		return this.parseSpecSheet('../style-sheets/reset.css', {
			'root-line-height': utils.units.toEms(lineHeight, fontSize)
		})
	}

	get customProperties () {
		let { settings, theme, utils } = this.chassis
		let themeProps = theme.getCustomProperties()
		
		return utils.css.newRule(':root', [
			...utils.files.parseStyleSheet('../style-sheets/copic-greys.css').nodes,
			utils.css.newDeclObj('--ui-min-width', `${settings.layout.minWidth}px`),
			utils.css.newDeclObj('--ui-max-width', `${settings.layout.maxWidth}px`),
			utils.css.newDeclObj('--ui-gutter', `${settings.layout.gutter}`),
			...Object.keys(themeProps).map((prop) => utils.css.newDeclObj(prop, themeProps[prop]))
		])
	}

	get modifiers () {
		// TODO: Add font-weight stuff here

		return this.parseSpecSheet('../style-sheets/global-modifiers.css')
	}

	get widthConstraint () {
		let { layout, settings, utils } = this.chassis

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
		return this.parseSpecSheet('../style-sheets/html.css', {
			'font-size': `${this.baseTypography.root.fontSize}px`
		})
	}

	get body () {
		return this.parseSpecSheet('../style-sheets/body.css')
	}

	get rootHeadings () {
		let { settings, typography, utils } = this.chassis
		let { root } = this.baseTypography

		let headingSizeAliases = settings.typography.fontSizes.headings
		let formLegendAlias = settings.typography.fontSizes.formLegend
		
		let variables = {
			'legend-font-size': `${utils.units.toEms(this.baseTypography[formLegendAlias].fontSize, root.fontSize)}rem`,
			'legend-line-height': `${utils.units.toEms(this.baseTypography[formLegendAlias].lineHeight, this.baseTypography[formLegendAlias].fontSize)}`,
			'legend-margin-bottom': `${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[formLegendAlias].lineHeight), this.baseTypography[formLegendAlias].fontSize)}em`
		}
		
		for (let i = 1; i <= 6; i++) {
			variables[`h${i}-font-size`] = `${utils.units.toEms(this.baseTypography[headingSizeAliases[i]].fontSize, root.fontSize)}em`
			variables[`h${i}-line-height`] = `${utils.units.toEms(this.baseTypography[headingSizeAliases[i]].lineHeight, this.baseTypography[headingSizeAliases[i]].fontSize)}`
			variables[`h${i}-margin-bottom`] = `${utils.units.toEms(typography.calculateMarginBottom(this.baseTypography[headingSizeAliases[i]].lineHeight), this.baseTypography[headingSizeAliases[i]].fontSize)}em`
		}
		
		return this.parseSpecSheet('../style-sheets/headings.css', variables)
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

		return this.parseSpecSheet('../style-sheets/outer-containers.css', {
			'selectors': this.selectors.outerContainers,
			'margin-bottom': `${utils.units.toEms(layout.calculateMarginBottom(lineHeight, 'outer'), fontSize)}em`
		})
	}

	get innerContainers () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return this.parseSpecSheet('../style-sheets/inner-containers.css', {
			'selectors': this.selectors.innerContainers,
			'margin-bottom': `${utils.units.toEms(layout.calculateMarginBottom(lineHeight, 'inner'), fontSize)}em`
		})
	}

	get paragraph () {
		let { layout, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		return this.parseSpecSheet('../style-sheets/paragraph.css', {
			'margin-bottom': `${utils.units.toEms(lineHeight, fontSize)}em`
		})
	}

	get inlineComponentReset () {
		return this.parseSpecSheet('../style-sheets/inline-component-reset.css')
	}
	
	get inlineBlockComponentReset () {
		return this.parseSpecSheet('../style-sheets/inline-block-component-reset.css')
	}
	
	get blockComponentReset () {
		return this.parseSpecSheet('../style-sheets/block-component-reset.css')
	}
	
	parseSpecSheet (path, variables = {}) {
		let { utils } = this.chassis
		
		let tree = utils.files.parseStyleSheet(path)
		
		if (!variables) {
			return tree
		}

		tree.walk((node) => {
			if (node.type === 'atrule') {
				node.params = utils.string.resolveVariables(node.params, variables)
			}
			
			if (node.type === 'rule') {
				node.selector = utils.string.resolveVariables(node.selector, variables)
			}
			
			if (node.type === 'decl') {
				node.prop = utils.string.resolveVariables(node.prop, variables)
				node.value = utils.string.resolveVariables(node.value, variables)
			}
    })
		
		return tree
	}
}

module.exports = ChassisCore
