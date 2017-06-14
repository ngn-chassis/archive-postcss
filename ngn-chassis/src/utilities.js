const ChassisCssUtils = require('./utilities/css.js')
const ChassisConsoleUtils = require('./utilities/console.js')
const ChassisUnitUtils = require('./utilities/units.js')
const ChassisFileUtils = require('./utilities/files.js')
const ChassisStringUtils = require('./utilities/string.js')


class ChassisUtils {
	static get array () {
		return ChassisArrayUtils
	}
	
	static get css () {
		return ChassisCssUtils
	}
	
	static get console () {
		return ChassisConsoleUtils
	}
	
	static get files () {
		return ChassisFileUtils
	}
	
	static get string () {
		return ChassisStringUtils
	}
	
	static get units () {
		return ChassisUnitUtils
	}
}

module.exports = ChassisUtils
