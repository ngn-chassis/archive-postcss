const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

class ChassisUtils {
	static newAtRule (config) {
	  return postcss.atRule(config)
	}

	static newRule (selector, decls = []) {
		let rule = postcss.rule({selector})

		decls.forEach(decl => {
	    rule.append(postcss.decl(this.newDeclObj(decl.prop, decl.value)))
		})

		return rule
	}

	static newDeclObj (key, value) {
	  return {
	    prop: key,
	    value
	  }
	}

	static newDecl (key, value) {
		return postcss.decl(this.newDeclObj(key, value))
	}

	static getUnit (value) {
	  return value.match(/\D+$/)[0]
	}

	static stripUnits (value) {
	  let data = value.match(/\D+$/)

	  return data.input.slice(0, data.index)
	}

	static parseStylesheet (filepath) {
	  filepath = path.join(__dirname, filepath)
	  let file = fs.readFileSync(filepath)
	  return postcss.parse(file)
	}

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
