const postcss = require('postcss')
const ChassisUtils = require('../utilities')
const ChassisMixins = require('./mixins')

class ChassisAtRules {
  constructor (project) {
    this.project = project
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
        // TODO: Add error handling

        atRule.replaceWith(this.project.mixins.blockLayout(args))
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

        atRule.replaceWith(this.project.mixins.constrainWidth())
        break

      case 'ellipsis':
        atRule.replaceWith(this.project.mixins.ellipsis())
        break

      case 'font-size':
        root.insertAfter(atRule.parent, this.project.mixins.fontSize(atRule.parent.selector, args))
        atRule.remove()
        break

      case 'font-weight':
        atRule.replaceWith(this.project.mixins.fontWeight(atRule, line, args))
        break

      case 'generate':
        atRule.replaceWith(this.project.mixins.generate(line, args))
        break

      case 'hide':
        atRule.replaceWith(this.project.mixins.hide())
        break

      case 'ie-only':
        atRule.replaceWith(this.project.mixins.ieOnly(line, nodes, args))
        break

      case 'inline-layout':
        atRule.replaceWith(this.project.mixins.inlineLayout(args))
        break

      case 'line-height':
        root.insertAfter(atRule.parent, this.project.mixins.lineHeight(atRule, line, args))
        atRule.remove()
        break

      case 'media-query':
        atRule.replaceWith(this.project.mixins.mediaQuery(line, args, nodes))
        break

      case 'set-typography':
        root.insertAfter(atRule.parent, this.project.mixins.setTypography(atRule.parent.selector, args))
        atRule.remove()
        break

      case 'show':
        atRule.replaceWith(this.project.mixins.show(line, args))
        break

      case 'z-index':
        atRule.replaceWith(this.project.mixins.zIndex(line, args))
        break

      default:
        console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
        atRule.remove()
    }
  }
}

module.exports = ChassisAtRules
