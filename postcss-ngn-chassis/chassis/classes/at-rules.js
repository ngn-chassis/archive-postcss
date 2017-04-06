const postcss = require('postcss')
const ChassisUtils = require('../utilities')

class ChassisAtRules {
  constructor (project) {
    this.project = project
    this.layout = project.layout
    this.viewport = project.viewport

    this.mixins = {
      init: (line, args) => {
        // console.log(args);
        return this.project.coreStyles
      },

      constrainWidth: (line, hasPadding = true) => {
        let decls = [
          ChassisUtils.newDecl('width', '100%'),
          ChassisUtils.newDecl('min-width', `${this.layout.minWidth}px`),
          ChassisUtils.newDecl('max-width', `${this.layout.maxWidth}px`),
          ChassisUtils.newDecl('margin', '0 auto')
        ]

        if (hasPadding) {
          decls = [
            ...decls,
            ChassisUtils.newDecl('padding-left', this.layout.gutter),
            ChassisUtils.newDecl('padding-right', this.layout.gutter)
          ]
        }

        return decls
      },

      mediaQuery: (line, config, nodes) => {
        let type = config[0]
        let viewport = config[1]

        if (!this.viewport.validateMediaQuery(line, type, viewport)) {
          return
        }

        let dimension = NGN.coalesce(config[2], 'width')

        return this.viewport.getMediaQuery(type, viewport, nodes, dimension)
      },

      hide: () => {
        return [
          ChassisUtils.newDecl('display', 'none'),
          ChassisUtils.newDecl('visibility', 'hidden'),
          ChassisUtils.newDecl('opacity', '0')
        ]
      },

      show: (args) => {
        let boxModel = NGN.coalesce(args, 'block')
        // TODO: Handle invalid box-model values

        return [
          ChassisUtils.newDecl('display', boxModel),
          ChassisUtils.newDecl('visibility', 'visible'),
          ChassisUtils.newDecl('opacity', '1')
        ]
      }
    }
  }

  _addWidthConstraintMediaQueries (input, selector) {
    input.insertAfter(selector, ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (max-width: ${this.layout.minWidth}px)`,
      nodes: [
        ChassisUtils.newRule(selector, [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.minWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.minWidth))
        ])
      ]
    }))

    input.insertAfter(selector, ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (min-width: ${this.layout.maxWidth}px)`,
      nodes: [
        ChassisUtils.newRule(selector, [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.maxWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.maxWidth))
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
        rule.replaceWith(this.mixins.init(line, args))
        break

      case 'constrain-width':
        this._addWidthConstraintMediaQueries(input, rule.parent)
        rule.replaceWith(this.mixins.constrainWidth(line, args && !args.includes('no-padding')))
        break

      case 'media-query':
        rule.replaceWith(this.mixins.mediaQuery(line, args, nodes))
        break

      case 'block-layout':
        console.log('apply block layout rules')
        break

      case 'inline-layout':
        console.log('apply inline layout rules')
        break

      case 'hide':
        rule.parent.append(this.mixins.hide())
        break

      case 'show':
        rule.parent.append(this.mixins.show(args))
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
