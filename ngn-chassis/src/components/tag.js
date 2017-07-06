const ChassisComponent = require('../component')

class ChassisTagComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null
		
		this.states = [
			'default',
			'icon',
			'pill'
		]
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		settings.componentResetSelectors.push('.tag')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.small
		
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule('.tag', [
			utils.css.newDeclObj('display', 'inline-flex'),
			utils.css.newDeclObj('justify-content', 'center'),
			utils.css.newDeclObj('align-items', 'center'),
			utils.css.newDeclObj('margin', '0'),
			utils.css.newDeclObj('padding', `0 ${Math.log(lineHeightMultiplier)}em`),
			utils.css.newDeclObj('font-size', `${utils.units.toEms(fontSize, this.baseTypography.root.fontSize)}em`),
			utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
			utils.css.newDeclObj('vertical-align', 'baseline'),
			...this.getThemeDecls('tag')
		])
	}
	
	get icon () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let dimension = `${lineHeightMultiplier * (settings.typography.scaleRatio - 1)}em`
		let offset = `-${(Math.log(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`

		return utils.css.newRule('.tag svg.icon', [
			utils.css.newDeclObj('transform', `translateX(${offset})`),
			utils.css.newDeclObj('width', dimension),
			utils.css.newDeclObj('height', dimension),
			...this.getThemeDecls('tag.icon')
		])
	}

	get pill () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule('.pill.tag', [
			utils.css.newDeclObj('padding-left', `${Math.sin(lineHeightMultiplier) / 2}em`),
			utils.css.newDeclObj('padding-right', `${Math.sin(lineHeightMultiplier) / 2}em`),
			utils.css.newDeclObj('border-radius', `${lineHeightMultiplier}em`),
			...this.getThemeDecls('tag.pill')
		])
	}
}

module.exports = ChassisTagComponent
