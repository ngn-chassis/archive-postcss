/**
 * @class ChassisGenerator
 * Used to generate default elements for the core stylesheet
 */
class ChassisGenerator {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	generate (rule, args, line) {
		let { mixins, project, utils } = this.chassis
		let element = args[0]
		
		
	}
}

module.exports = ChassisGenerator
