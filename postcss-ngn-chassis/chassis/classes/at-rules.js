const postcss = require('postcss')
const ChassisUtils = require('../utilities')
const ChassisMixins = require('./mixins')

class ChassisAtRules {
  constructor (project) {
    this.project = project
    this.mixins = new ChassisMixins(this.project)
  }

  /**
   * @method process
   * Process @chassis at-rule
   * @param {object} rule
   * PostCss AST
   * @param {object} root
   * CSS Root node
   */
  process (atRule, root) {
    let line = Object.keys(atRule.source.start).map(key => {
      return `${key}: ${atRule.source.start[key]}`
    }).join(', ')

    let params = atRule.params.split(' ')
    let mixin = params[0]
    let args = params.length > 1 ? params.slice(1) : null
    let nodes = NGN.coalesce(atRule.nodes, [])

    let css

    switch (mixin) {
      case 'block-layout':
        atRule.replaceWith(this.mixins.blockLayout(atRule, line, args))
        break

      case 'constrain-width':
        root.insertAfter(atRule.parent, ChassisUtils.newAtRule({
          name: 'media',
          params: `screen and (max-width: ${this.project.layout.minWidth}px)`,
          nodes: [
            ChassisUtils.newRule(atRule.parent.selector, [
              ChassisUtils.newDeclObj('padding-left', this.project.layout.getGutterLimit(this.project.layout.minWidth)),
              ChassisUtils.newDeclObj('padding-right', this.project.layout.getGutterLimit(this.project.layout.minWidth))
            ])
          ]
        }))

        root.insertAfter(atRule.parent, ChassisUtils.newAtRule({
          name: 'media',
          params: `screen and (min-width: ${this.project.layout.maxWidth}px)`,
          nodes: [
            ChassisUtils.newRule(atRule.parent.selector, [
              ChassisUtils.newDeclObj('padding-left', this.project.layout.getGutterLimit(this.project.layout.maxWidth)),
              ChassisUtils.newDeclObj('padding-right', this.project.layout.getGutterLimit(this.project.layout.maxWidth))
            ])
          ]
        }))

        atRule.replaceWith(this.mixins.constrainWidth(line))
        break

      case 'ellipsis':
        atRule.replaceWith(this.mixins.ellipsis())
        break

      case 'font-size':
        root.insertAfter(atRule.parent, this.mixins.fontSize(atRule, line, args))
        atRule.remove()
        break

      case 'generate':
        atRule.replaceWith(this.mixins.generate(line, args))
        break

      case 'hide':
        atRule.replaceWith(this.mixins.hide())
        break

      case 'ie-only':
        atRule.replaceWith(this.mixins.ieOnly(line, nodes, args))
        break

      case 'inline-layout':
        atRule.replaceWith(this.mixins.inlineLayout(atRule, line, args))
        break

      case 'line-height':
        root.insertAfter(atRule.parent, this.mixins.lineHeight(atRule, line, args))
        atRule.remove()
        break

      case 'media-query':
        atRule.replaceWith(this.mixins.mediaQuery(line, args, nodes))
        break

      case 'set-typography':
        root.insertAfter(atRule.parent, this.mixins.setTypography(atRule, line, args))
        atRule.remove()
        break

      case 'show':
        atRule.replaceWith(this.mixins.show(line, args))
        break

      case 'z-index':
        atRule.replaceWith(this.mixins.zIndex(line, args))
        break

      default:
        console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
        atRule.remove()
    }
  }
}

module.exports = ChassisAtRules
