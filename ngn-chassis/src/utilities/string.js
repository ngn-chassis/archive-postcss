class ChassisStringUtils {
	/**
	 * @method getUnit
	 * Get the units from a CSS Property value
	 * @param {string} value with units
	 * @return {string}
	 * @static
	 */
	static getUnit (value) {
		return value.match(/\D+$/)[0]
	}
	
	static listPropertyValues (array) {
		return array.map(value => value === 0 ? 0 : `${value}em`).join(' ')
	}
	
	/**
	 * @method stripParentheses
	 * Strip all parentheses from string
	 * @param  {string} string
	 * @return {string}
	 */
	static stripParentheses (string) {
		return string.replace(/[()]/g, '')
	}
	
	/**
	 * @method stripUnits
	 * Strip the units from a CSS Property value
	 * @param {string} value with units
	 * @return {string}
	 * @static
	 */
	static stripUnits (value) {
		let data = value.match(/\D+$/)
		return data.input.slice(0, data.index)
	}
}

module.exports = ChassisStringUtils
