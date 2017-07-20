const ChassisComponent = require('../../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, 'overlay', customSpec)
		
		this.selectors = ['chassis-overlay']
		this.resetType = 'block'
	}
}

module.exports = ChassisOverlayComponent
