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

    let { mixins } = this.project

    switch (mixin) {
      case 'block-layout':
        // TODO: Add error handling

        atRule.replaceWith(mixins.blockLayout(args))
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

        atRule.replaceWith(mixins.constrainWidth())
        break

      case 'end':
        root.walkAtRules('detailer', (atRule) => {
          ChassisUtils.printTree(atRule);
        })
        break

      case 'ellipsis':
        atRule.replaceWith(mixins.ellipsis())
        break

      case 'font-size':
        root.insertAfter(atRule.parent, mixins.fontSize(atRule.parent.selector, args))
        atRule.remove()
        break

      case 'font-weight':
        atRule.replaceWith(mixins.fontWeight(atRule, line, args))
        break

      case 'hide':
        atRule.replaceWith(mixins.hide())
        break

      case 'ie-only':
        atRule.replaceWith(mixins.ieOnly(line, nodes, args))
        break

      case 'init':
        atRule.replaceWith(mixins.init())
        break

      case 'inline-layout':
        atRule.replaceWith(mixins.inlineLayout(args))
        break

      case 'line-height':
        root.insertAfter(atRule.parent, mixins.lineHeight(atRule, line, args))
        atRule.remove()
        break

      case 'media-query':
        atRule.replaceWith(mixins.mediaQuery(line, args, nodes))
        break

      case 'set-typography':
        root.insertAfter(atRule.parent, mixins.setTypography(atRule.parent.selector, args))
        atRule.remove()
        break

      case 'show':
        atRule.replaceWith(mixins.show(line, args))
        break

      case 'z-index':
        atRule.replaceWith(mixins.zIndex(line, args))
        break

      default:
        console.error(`Chassis At-Rules: At-Rule ${mixin} not found`)
        atRule.remove()
    }
  }
}

module.exports = ChassisAtRules
