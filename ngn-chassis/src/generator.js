/**
 * @class ChassisGenerator
 * Used to generate default elements for the core stylesheet
 */
class ChassisGenerator {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	generate (element, args, nodes, line) {
		let { mixins, project } = this.chassis
		
		switch (element) {
			case 'width-constraint':
				return mixins.process('constrain-width', {})
				break
				
			default:
				return ''
		}
	}
}

module.exports = ChassisGenerator
