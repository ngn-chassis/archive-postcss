const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

function newRule (selector, decls = []) {
	let rule = postcss.rule({selector})

	decls.forEach(decl => {
    rule.append(postcss.decl(newDeclObj(decl.prop, decl.value)))
	})

	return rule
}

function newAtRule (config) {
  return postcss.atRule(config)
}

function newDeclObj (key, value) {
  return {
    prop: key,
    value
  }
}

function getUnit (value) {
  return value.match(/\D+$/)[0]
}

function stripUnits (value) {
  let data = value.match(/\D+$/)

  return data.input.slice(0, data.index)
}

function parseStylesheet (filepath) {
  filepath = path.join(__dirname, filepath)
  let file = fs.readFileSync(filepath)
  return postcss.parse(file)
}

function parseStylesheets (filepaths) {
  let output = parseStylesheet(filepaths[0])
  let remainingFilepaths = filepaths.slice(1)

  remainingFilepaths.forEach(path => {
    output.append(parseStylesheet(path))
  })

  return output
}

module.exports = {
  newRule,
  newAtRule,
  newDeclObj,
  getUnit,
  stripUnits,
  parseStylesheet,
  parseStylesheets
}
