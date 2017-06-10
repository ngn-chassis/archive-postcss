const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

class ChassisUtils {
	static listPropertyValues (array) {
		return array.map(value => value === 0 ? 0 : `${value}em`).join(' ')
	}

	/**
	 * @method fileExists
	 * Determine whether or not a filepath points to an existing file
	 * @param {string} filepath
	 * @static
	 */
	static fileExists (filepath, relative = true) {
		if (relative) {
			filepath = this.resolvePath(filepath)
		}

		return fs.existsSync(filepath)
	}

	static getFilePath (filepath) {
		return filepath.substring(0, filepath.lastIndexOf("/"))
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

	static toEms (pxValue, root) {
		return pxValue / root
	}

	/**
	 * @method isDirectory
	 * Determine whether or not a filepath points to a directory
	 * @param {string} filepath
	 * @static
	 */
	static isDirectory (filepath) {
		filepath = path.join(__dirname, filepath)

		if (fs.existsSync(filepath)) {
			return fs.lstatSync(filepath).isDirectory()
		}

		return false
	}

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
	 * @method newRoot
	 * @param {array} nodes
	 * Nodes to populate new root element with
	 * @static
	 */
	static newRoot (nodes = []) {
		return postcss.root({nodes})
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

	static newMediaQuery (params, nodes) {
		return this.newAtRule({name: 'media', params, nodes})
	}

	/**
	 * @method parseDirectory
	 * Parse all stylesheets in a given directory
	 * @param {string} dirpath
	 * @param {boolean} relative
	 * Whether or not dirpath is relative (false means absolute)
	 * @static
	 */
	static parseDirectory (dirpath, relative = true) {
		if (relative) {
			dirpath = this.resolvePath(dirpath)
		}

		let files = fs.readdirSync(dirpath).map(file => `${dirpath}/${file}`)
		return this.parseStylesheets(files, false)
	}

	/**
	 * @method parseStylesheet
	 * Parse a CSS stylesheet into a postcss AST
	 * @param {string} filepath
	 * @return {AST}
	 * @static
	 */
	static parseStylesheet (filepath, relative = true) {
		if (relative) {
			filepath = this.resolvePath(filepath)
		}

		return postcss.parse(fs.readFileSync(filepath))
	}

	/**
	 * @method parseStylesheets
	 * Parse an array of CSS stylesheets into a single postcss AST
	 * @param {array} filepaths
	 * @return {AST}
	 * @static
	 */
	static parseStylesheets (filepaths, relative = true) {
		let output = this.parseStylesheet(filepaths[0], relative)
		let remainingFilepaths = filepaths.slice(1)

		remainingFilepaths.forEach(path => {
			output.append(this.parseStylesheet(path, relative))
		})

		return output
	}

	/**
	 * @method printTree
	 * Print a prettified JSON respresentation of an object to console
	 */
	static printTree (tree) {
		console.log(JSON.stringify(tree, null, 2));
	}

	/**
	 * @method resolvePath
	 * Resolve a relative path
	 * @param {string} filepath
	 * @static
	 */
	static resolvePath (filepath) {
		return path.join(__dirname, filepath)
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

module.exports = ChassisUtils
