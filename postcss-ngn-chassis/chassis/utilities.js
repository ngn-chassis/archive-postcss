const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

class ChassisUtils {
	/**
	 * @method newAtRule
	 * Generate new postcss at-rule AST
	 * @param {object} config
	 * @return {at-rule}
	 * @static
	 */
	static newAtRule (config) {
	  return postcss.atRule(config)
	}

	/**
	 * @method newRule
	 * Generate new postcss rule AST
	 * @param {string} selector
	 * CSS selector
	 * @param {array} decls
	 * Declarations to add inside rule
	 * Each decl should be an object of shape {prop: {string}, value: {string}}
	 * @return {rule}
	 * @static
	 */
	static newRule (selector, decls = []) {
		let rule = postcss.rule({selector})

		decls.forEach(decl => {
	    rule.append(postcss.decl(this.newDeclObj(decl.prop, decl.value)))
		})

		return rule
	}

	/**
	 * @method printTree
	 * Print a prettified JSON respresentation of an object to console
	 */
	static printTree (tree) {
		console.log(JSON.stringify(tree, null, 2));
	}

	/**
	 * @method newDeclObj
	 * Utility method to reduce code repetition
	 * Generate decl object
	 * @param {string} key
	 * CSS Property
	 * @param {string} value
	 * CSS Property value
	 * @return {object} of shape {prop: {string}, value: {string}}
	 * @static
	 */
	static newDeclObj (key, value) {
	  return {
	    prop: key,
	    value
	  }
	}

	/**
	 * @method newDecl
	 * Generate postcss decl AST
	 * @param {string} key
	 * CSS Property
	 * @param {string} value
	 * CSS Property value
	 * @return {decl}
	 * @static
	 */
	static newDecl (key, value) {
		return postcss.decl(this.newDeclObj(key, value))
	}

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

	/**
	 * @method parseStylesheet
	 * Parse a CSS stylesheet into a postcss AST
	 * @param {string} filepath
	 * @return {AST}
	 * @static
	 */
	static parseStylesheet (filepath) {
	  filepath = path.join(__dirname, filepath)
	  let file = fs.readFileSync(filepath)
	  return postcss.parse(file)
	}

	/**
	 * @method parseStylesheets
	 * Parse an array of CSS stylesheets into a single postcss AST
	 * @param {array} filepaths
	 * @return {AST}
	 * @static
	 */
	static parseStylesheets (filepaths) {
	  let output = this.parseStylesheet(filepaths[0])
	  let remainingFilepaths = filepaths.slice(1)

	  remainingFilepaths.forEach(path => {
	    output.append(this.parseStylesheet(path))
	  })

	  return output
	}
}

module.exports = ChassisUtils
