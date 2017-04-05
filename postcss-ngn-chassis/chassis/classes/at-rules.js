const postcss = require('postcss')
const ChassisUtils = require('../utilities')

class ChassisAtRules {
  constructor (project) {
    this.project = project
    this.layout = project.layout
    this.viewport = project.viewport
  }

  initMixin (line, args) {
    // console.log(args);
    return this.project.coreStyles
  }

  constrainWidthMixin (line, hasPadding = true) {
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

  mediaQueryMixin (line, config, nodes) {
    let type = config[0]
    let viewport = config[1]

    if (!this.viewport.validateMediaQuery(line, type, viewport)) {
      return
    }

    let dimension = NGN.coalesce(config[2], 'width')

    return this.viewport.getMediaQuery(type, viewport, nodes, dimension)
  }

  hideMixin () {
    return [
      ChassisUtils.newDecl('display', 'none'),
      ChassisUtils.newDecl('visibility', 'hidden'),
      ChassisUtils.newDecl('opacity', '0')
    ]
  }

  showMixin (args) {
    let boxModel = NGN.coalesce(args, 'block')
    // TODO: Handle invalid box-model values

    return [
      ChassisUtils.newDecl('display', boxModel),
      ChassisUtils.newDecl('visibility', 'visible'),
      ChassisUtils.newDecl('opacity', '1')
    ]
  }

  _addWidthConstraintMediaQueries (input, selector) {
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
    let line = Object.keys(rule.source.start).map(key => `${key}: ${rule.source.start[key]}`).join(', ')
    let params = rule.params.split(' ')
    let mixin = params[0]
    let args = params.length > 1 ? params.slice(1) : null
    let nodes = NGN.coalesce(rule.nodes || [])
    let css
    let append = false

    switch (mixin) {
      case 'init':
        rule.replaceWith(this.initMixin(line, args))
        break

      case 'constrain-width':
        this._addWidthConstraintMediaQueries(input, rule.parent)
        rule.replaceWith(this.constrainWidthMixin(line, !args.includes('no-padding')))
        break

      case 'media-query':
        rule.replaceWith(this.mediaQueryMixin(line, args, nodes))
        break

      case 'block-layout':
        console.log('apply block layout rules')
        break

      case 'inline-layout':
        console.log('apply inline layout rules')
        break

      case 'hide':
        rule.parent.append(this.hideMixin())
        break

      case 'show':
        rule.parent.append(this.showMixin(args))
        break

      case 'ellipsis':
        console.log('apply ellipsis')
        break

      case 'z-index':
        console.log('apply calculated z-index')
        break

      default:
        console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
        rule.remove()
    }
  }
}

module.exports = ChassisAtRules
