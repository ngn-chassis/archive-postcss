const ChassisComponent = require('../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['chassis-overlay'], states = {
		
	}, extensions = NGN.coalesce(chassis.extensions.overlay, null), resetType = 'block') {
		super(chassis, 'overlay', theme, selectors, states, extensions, resetType)
	}
}

module.exports = ChassisOverlayComponent
