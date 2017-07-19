const ChassisComponent = require('../../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
		this.name = 'modal'
		this.selectors = ['chassis-modal']
		this.resetType = 'block'
	}
}

module.exports = ChassisModalComponent
