const ChassisComponent = require('../../component')

class ChassisSvgIconComponent extends ChassisComponent {
	constructor (chassis, customSpec) {
    super(chassis, customSpec)
    this.chassis = chassis
		
		this.name = 'svg-icon'
    this.selectors = ['svg.icon']
    this.resetType = 'inline-block'
	}
	
	get variables () {
		let { settings, utils } = this.chassis
		let { fontSize, lineHeight } = settings.typography.ranges.first.typography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)
		
		return {
			'width': 'auto',
			'height': `${lineHeightInEms}em`
		}
	}
}

module.exports = ChassisSvgIconComponent
