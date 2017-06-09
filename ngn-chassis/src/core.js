class ChassisCore {
	constructor (chassis) {
		this.chassis = chassis
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
		
		this.css = chassis.utils.newRoot([
			this.rootHtml,
			this.rootHeadings,
			this.typographyRanges
		])
	}
	
	get rootHtml () {
		let { constants, settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		return utils.newRule('html', [
			utils.newDeclObj('font-size', `${fontSize}px`),
			utils.newDeclObj('line-height', `${utils.toEms(lineHeight, fontSize)}em`)
		])
	}
	
	get rootHeadings () {
		let { settings, typography, utils } = this.chassis
		let { root } = this.baseTypography
		
		let headingSizeAliases = settings.typography.fontSizes.headings
		let rules = utils.newRoot([])
		
		for (let i = 1; i <= 6; i++) {
			rules.append(utils.newRule(`h${i}`, [
				utils.newDeclObj(
					'font-size',
					`${utils.toEms(this.baseTypography[headingSizeAliases[i]].fontSize, root.fontSize)}rem`
				),
				utils.newDeclObj(
					'line-height',
					`${utils.toEms(this.baseTypography[headingSizeAliases[i]].lineHeight, this.baseTypography[headingSizeAliases[i]].fontSize)}em`
				)
			]))
		}
		
		return rules
	}
	
	get typographyRanges () {
		let { settings, utils } = this.chassis
		
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
			
			let htmlRule = utils.newRule('html', [])
			
			if (fontSize !== this.baseTypography.fontSize) {
				htmlRule.append(utils.newDecl('font-size', `${fontSize}px`))
			}
			
			htmlRule.append(utils.newDecl('line-height', `${utils.toEms(lineHeight, fontSize)}em`))
			
			mediaQuery.nodes.push(htmlRule)
			
			let headingSizeAliases = settings.typography.fontSizes.headings
			
			for (let i = 1; i <= 6; i++) {
				mediaQuery.nodes.push(utils.newRule(`h${i}`, [
					utils.newDeclObj(
						'line-height',
						`${utils.toEms(range.typography[headingSizeAliases[i]].lineHeight, range.typography[headingSizeAliases[i]].fontSize)}em`
					)
				]))
			}
			
			mediaQueries.append(mediaQuery)
		}
		
		return mediaQueries
	}
}

module.exports = ChassisCore
