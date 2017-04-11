const postcss = require('postcss')
const ChassisUtils = require('../utilities')

class ChassisAtRules {
  constructor (project) {
    this.project = project

    this.mixins = {
      blockLayout: (rule, line, args) => {
        let config = {
          alias: 'root'
        }

        if (args) {
          let stripPadding = NGN.coalesce(args.includes('no-padding'), true)
          let stripHorizontalPadding = NGN.coalesce(args.includes('no-horizontal-padding'), true)
          let stripVerticalPadding = NGN.coalesce(args.includes('no-vertical-padding'), true)
          let stripMargin = NGN.coalesce(args.includes('no-margin'), false)

          if (stripHorizontalPadding) {
            config.stripHorizontalPadding = stripHorizontalPadding
          }

          if (stripVerticalPadding) {
            config.stripVerticalPadding = stripVerticalPadding
          }

          if (stripPadding || (stripHorizontalPadding && stripVerticalPadding)) {
            delete config.stripHorizontalPadding
            delete config.stripVerticalPadding
            config.stripPadding = true
          }

          if (stripMargin) {
            config.stripMargin = true
          }
        }

        return this.project.layout.getBlockElementProperties(rule, line, config)
      },

      /**
       * @mixin constrainWidth
       * @param  {object}  line
       * Line and column at which mixin was called
       * @param  {Boolean} [hasPadding=true]
       * Whether or not to add layout gutter to left and right
       * @return {array} of decls
       */
      constrainWidth: (line, hasPadding = true) => {
        let decls = [
          ChassisUtils.newDecl('width', '100%'),
          ChassisUtils.newDecl('min-width', `${this.project.layout.minWidth}px`),
          ChassisUtils.newDecl('max-width', `${this.project.layout.maxWidth}px`),
          ChassisUtils.newDecl('margin', '0 auto')
        ]

        if (hasPadding) {
          decls = [
            ...decls,
            ChassisUtils.newDecl('padding-left', this.project.layout.gutter),
            ChassisUtils.newDecl('padding-right', this.project.layout.gutter)
          ]
        }

        return decls
      },

      ellipsis: () => {
        return [
          ChassisUtils.newDecl('white-space', 'nowrap'),
          ChassisUtils.newDecl('overflow', 'hidden'),
          ChassisUtils.newDecl('text-overflow', 'ellipsis')
        ]
      },

      fontSize: (atRule, line, args) => {
        // TODO: Add error handling
        let fontSizeAlias = args
        return this.project.typography.getCalculatedFontSizeProperty(atRule, line, fontSizeAlias)
      },

      /**
       * @mixin generate
       * Generate core stylesheet from user configuration
       * @param  {object} line
       * Line and column at which mixin was called
       * @param  {array} args
       * additional params passed to mixin
       * @return {AST}
       */
      generate: (line, args) => {
        // console.log(args);
        return this.project.coreStyles
      },

      /**
       * @mixin hide
       * Hide element
       * Sets the following properties:
       * display: none;
       * visibility: hidden;
       * opacity: 0;
       * @return {decls}
       */
      hide: () => {
        return [
          ChassisUtils.newDecl('display', 'none'),
          ChassisUtils.newDecl('visibility', 'hidden'),
          ChassisUtils.newDecl('opacity', '0')
        ]
      },

      /**
       * @mixin ieOnly
       * @param  {object} line
       * Line and column at which mixin was called
       * @param  {array} nodes
       * ie-specific rules
       * @param  {number} version
       * Earliest version of IE to support
       * TODO: Implement version support
       * @return {CSS}
       */
      ieOnly: (line, rules, version = 11) => {
        return ChassisUtils.newAtRule({
          name: 'media',
          params: 'all and (-ms-high-contrast: none)',
          nodes: rules.map(rule => {
            rule.selector = `*::-ms-backdrop, ${rule.selector}`
            return rule
          })
        })
      },

      inlineLayout: (rule, line, args) => {
        let config = {
          alias: 'root'
        }

        if (args) {
          let stripMargin = NGN.coalesce(args.includes('no-margin'), true)
          let stripHorizontalMargin = NGN.coalesce(args.includes('no-horizontal-margin'), true)
          let stripVerticalMargin = NGN.coalesce(args.includes('no-vertical-margin'), true)

          let stripPadding = NGN.coalesce(args.includes('no-padding'), false)

          let multiLine = NGN.coalesce(args.includes('multi-line'), false)

          let setHeight = NGN.coalesce(args.includes('set-height'), false)

          if (stripHorizontalMargin) {
            config.stripHorizontalMargin = stripHorizontalMargin
          }

          if (stripVerticalMargin) {
            config.stripVerticalMargin = stripVerticalMargin
          }

          if (stripMargin || (stripHorizontalMargin && stripVerticalMargin)) {
            delete config.stripHorizontalMargin
            delete config.stripVerticalMargin
            config.stripMargin = true
          }

          if (stripPadding) {
            config.stripPadding = true
          }

          if (multiLine) {
            config.multiLine = true
          }

          if (setHeight) {
            config.setHeight = true
          }
        }

        return this.project.layout.getInlineElementProperties(rule, line, config)
      },

      lineHeight: (atRule, line, args) => {
        // TODO: Add error handling
        let fontSizeAlias = args
        return this.project.typography.getCalculatedLineHeightProperty(atRule, line, fontSizeAlias)
      },

      /**
       * @mixin mediaQuery
       * @param  {object} line
       * Line and column at which mixin was called
       * @param  {object} config
       * media query params. Shape: {name: {string}, params: {string}, nodes: {array}}
       * @param  {array} nodes
       * rules to add inside media query
       * @return {CSS}
       */
      mediaQuery: (line, config, nodes) => {
        let type = config[0]
        let viewport = config[1]

        if (!this.project.viewport.validateMediaQuery(line, type, viewport)) {
          return
        }

        let dimension = NGN.coalesce(config[2], 'width')

        return this.project.viewport.getMediaQuery(type, viewport, nodes, dimension)
      },

      setTypography: (atRule, line, args) => {
        let config = {
          alias: 'root'
        }

        if (args) {
          let alias = NGN.coalesce(args.find(arg => ['root', 'small', 'large', 'larger', 'largest'].includes(arg)), 'root')
          let multiplier = NGN.coalesce(args.find(arg => typeof arg === 'number'), 1)
          let addMargin = NGN.coalesce(args.includes('add-margin'), false)

          if (!alias) {
            console.error('[ERROR] Chassis At Rule set-typography must include a size alias. Valid values include "root", "small", "large", "larger", and "largest"')
            return ''
          }

          config.alias = alias

          if (multiplier) {
            config.multiplier = multiplier
          }

          if (addMargin) {
            config.addMargin = true
          }
        }

        return this.project.typography.getCalculatedProperties(atRule, line, config)
      },

      /**
       * @mixin show
       * Show element
       * Sets the following properties:
       * display: {string};
       * visibility: visible;
       * opacity: 1;
       * @param {array} args
       * Accepts CSS box model property values
       * @return {decls}
       */
      show: (line, args) => {
        let boxModel = NGN.coalesce(args, 'block')
        // TODO: Handle invalid box-model values

        return [
          ChassisUtils.newDecl('display', boxModel),
          ChassisUtils.newDecl('visibility', 'visible'),
          ChassisUtils.newDecl('opacity', '1')
        ]
      },

      zIndex: (line, args) => {
        let index = this.project.settings.zIndex[args[0]]

        if (!index) {
          console.error(`[ERROR] Chassis z-index: Invalid identifier. Accepted values: ${Object.keys(this.project.settings.zIndex).join(', ')}`)
        }

        return ChassisUtils.newDecl('z-index', index)
      }
    }
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
