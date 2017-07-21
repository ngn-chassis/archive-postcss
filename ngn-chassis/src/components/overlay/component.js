const ChassisComponent = require('../../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, customSpec)
		
		this.name = 'overlay'
		this.selectors = ['chassis-overlay']
		this.resetType = 'block'
	}
}

module.exports = ChassisOverlayComponent
