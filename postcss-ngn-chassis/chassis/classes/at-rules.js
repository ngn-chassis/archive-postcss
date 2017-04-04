const postcss = require('postcss')

class ChassisAtRules {
  constructor (project) {
    this.project = project
    this.layout = project.layout
  }

  init () {
    return this.project.coreStyles
  }

  constrainWidth (hasPadding = true) {
    const decls = []

    decls.push(postcss.decl({
      prop: 'width',
      value: '100%'
    }))

    decls.push(postcss.decl({
      prop: 'min-width',
      value: `${this.layout.minWidth}px`
    }))

    decls.push(postcss.decl({
      prop: 'max-width',
      value: `${this.layout.maxWidth}px`
    }))

    decls.push(postcss.decl({
      prop: 'margin',
      value: '0 auto'
    }))

    if (hasPadding) {
      decls.push(postcss.decl({
        prop: 'padding-left',
        value: this.layout.gutter
      }))
      decls.push(postcss.decl({
        prop: 'padding-right',
        value: this.layout.gutter
      }))
    }

    return decls
  }

  process (rule) {
    let params = rule.params.split(' ')
    let mixin = params[0]
    let args = params.length > 1 ? params.slice(1) : null

    if (typeof this[mixin] !== 'function') {
      console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
      return
    }

    let css = this[mixin](args)

    if (css) {
      rule.replaceWith(css)
    } else {
      rule.remove()
    }
  }
}

module.exports = ChassisAtRules
