const postcss = require('postcss')

class ChassisCssUtils {
	static mergeDecls (originalDecls, newDecls) {
		let finalDecls = originalDecls
		
		newDecls.forEach((newDecl) => {
			let index = originalDecls.findIndex((originalDecl) => {
				return originalDecl.prop === newDecl.prop
			})
			
			if (index) {
				finalDecls[index] = newDecl
				return
			}
			
			finalDecls.push(newDecl)
		})
		
		return finalDecls
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
}

module.exports = ChassisCssUtils
