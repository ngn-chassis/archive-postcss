const postcss = require('postcss')
const util = require('../utilities')

class ChassisAtRules {
  constructor (project) {
    this.project = project
    this.layout = project.layout
    this.viewport = project.viewport
  }

  init (args) {
    console.log(args);


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

  mediaQuery (config, nodes) {
    let type = config[0]
    let viewport = config[1]
    let dimension = config[2]

    return this.viewport.getMediaQuery(type, viewport, nodes)
  }

  addWidthConstraintMediaQueries (input, selector) {
    input.insertAfter(selector, util.newAtRule({
      name: 'media',
      params: `screen and (max-width: ${this.layout.minWidth}px)`,
      nodes: [
        util.newRule(selector, [
          util.newDeclObj('padding-left', this.layout.getParsedGutter(this.layout.minWidth)),
          util.newDeclObj('padding-right', this.layout.getParsedGutter(this.layout.minWidth))
        ])
      ]
    }))

    input.insertAfter(selector, util.newAtRule({
      name: 'media',
      params: `screen and (min-width: ${this.layout.maxWidth}px)`,
      nodes: [
        util.newRule(selector, [
          util.newDeclObj('padding-left', this.layout.getParsedGutter(this.layout.maxWidth)),
          util.newDeclObj('padding-right', this.layout.getParsedGutter(this.layout.maxWidth))
        ])
      ]
    }))
  }

  process (rule, input) {
    let params = rule.params.split(' ')
    let mixin = params[0]
    let args = params.length > 1 ? params.slice(1) : null
    let css

    switch (mixin) {
      case 'init':
        css = this.init(args)
        break

      case 'constrain-width':
        this.addWidthConstraintMediaQueries(input, rule.parent)
        css = this.constrainWidth(!args.includes('no-padding'))
        break

      case 'media-query':
        css = this.mediaQuery(args, rule.nodes)
        break

      case 'block-layout':
        console.log('apply block layout rules')
        break

      case 'inline-layout':
        console.log('apply inline layout rules')
        break

      case 'hide':
        console.log('hide element')
        break

      case 'show':
        console.log('show element')
        break

      case 'ellipsis':
        console.log('apply ellipsis')
        break

      case 'z-index':
        console.log('apply calculated z-index')
        break

      default:
        console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
    }

    if (css) {
      rule.replaceWith(css)
    } else {
      rule.remove()
    }
  }
}

module.exports = ChassisAtRules
