'use strict'

const postcss = require('postcss')

function newRule(selector, decls = []) {
	const rule = postcss.rule({
		selector
	})

	decls.forEach(decl => {
		rule.append(postcss.decl({
			prop: decl.prop,
			value: decl.value
		}))
	})

	return rule
}

module.exports = newRule

