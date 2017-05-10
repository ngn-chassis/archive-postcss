const ChassisProject = require('./project')
const ChassisUtils = require('../utilities')

const ChassisLayoutMixins = require('../mixins/layout')
const ChassisTypographyMixins = require('../mixins/typography')

class ChassisMixins {
	constructor (project) {
		this.project = project
		
		this.layout = new ChassisLayoutMixins(project)
		this.typography = new ChassisTypographyMixins(project)
	}
	
	/**
   * @mixin init
   * Generate core stylesheet from user configuration
   * @return {AST}
   */
  init () {
    return this.project.coreStyles
  }

  /**
   * @mixin hide
   * Hide element
   * Sets the following properties:
   * display: none;
   * visibility: hidden;
   * opacity: 0;
   * @return {decls}
   */
  hide () {
    return [
      ChassisUtils.newDecl('display', 'none'),
      ChassisUtils.newDecl('visibility', 'hidden'),
      ChassisUtils.newDecl('opacity', '0')
    ]
  }
	
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
  show (args) {
    let boxModel = NGN.coalesce(args && args[0], 'block')
    // TODO: Handle invalid box-model values

    return [
      ChassisUtils.newDecl('display', boxModel),
      ChassisUtils.newDecl('visibility', 'visible'),
      ChassisUtils.newDecl('opacity', '1')
    ]
  }
	
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
  mediaQuery (line, config, nodes) {
		let { viewport } = this.project
    let type = config[0]
    let viewportName = config[1]

    if (!viewport.validateMediaQuery(line, type, viewportName)) {
      return
    }

    let dimension = NGN.coalesce(config[2], 'width')

    return viewport.getMediaQuery(type, viewportName, nodes, dimension)
  }
	
	/**
	 * @mixin disableTextSelection
	 * Disable the user's ability to select a text node
	 * @return {AST}
	 */
	disableTextSelection () {
		return [
      ChassisUtils.newDecl('-webkit-touch-callout', 'none'),
      ChassisUtils.newDecl('-webkit-user-select', 'none'),
      ChassisUtils.newDecl('-khtml-user-select', 'none'),
			ChassisUtils.newDecl('-moz-user-select', 'none'),
      ChassisUtils.newDecl('-ms-user-select', 'none'),
      ChassisUtils.newDecl('-o-user-select', 'none'),
			ChassisUtils.newDecl('user-select', 'none')
    ]
	}
	
	/**
	 * @mixin ellipsis
	 * @return {AST}
	 */
  ellipsis () {
    return [
      ChassisUtils.newDecl('white-space', 'nowrap'),
      ChassisUtils.newDecl('overflow', 'hidden'),
      ChassisUtils.newDecl('text-overflow', 'ellipsis')
    ]
  }

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
  ieOnly (line, rules, version = 11) {
    return ChassisUtils.newAtRule({
      name: 'media',
      params: 'all and (-ms-high-contrast: none)',
      nodes: rules.map(rule => {
        rule.selector = `*::-ms-backdrop, ${rule.selector}`
        return rule
      })
    })
  }

  /**
   * @mixin zIndex
   * Get calculated z-index value from project settings
   * @param  {array} args
   * arguments passed to mixin
   * @return {decl}
   */
  zIndex (args) {
		let { settings } = this.project
    let index = settings.zIndex[args[0]]

    if (!index) {
      console.error(`[ERROR] Chassis z-index: Invalid identifier. Accepted values: ${Object.keys(settings.zIndex).join(', ')}`)
    }

    return ChassisUtils.newDecl('z-index', index)
  }
}

module.exports = ChassisMixins
