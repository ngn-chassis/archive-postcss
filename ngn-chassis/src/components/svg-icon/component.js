const ChassisComponent = require('../../component')

class ChassisSvgIconComponent extends ChassisComponent {
	constructor (chassis, customSpec) {
    super(chassis, customSpec)
    this.chassis = chassis
		
		this.name = 'svg-icon'
    this.selectors = ['svg.icon']
    this.resetType = 'inline-block'
	}

	get default () {
		let { utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('width', 'auto'),
			utils.css.newDeclObj('height', `${lineHeightInEms}em`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('pointer-events', 'none'),
		]
	}
}

module.exports = ChassisSvgIconComponent
