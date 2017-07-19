const ChassisComponent = require('../../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
		this.name = 'overlay'
		this.selectors = ['chassis-overlay']
		this.resetType = 'block'
	}
}

module.exports = ChassisOverlayComponent
