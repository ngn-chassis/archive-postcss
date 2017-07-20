/**
 * @class ChassisGenerator
 * Used to generate default elements for the core stylesheet
 */
class ChassisGenerator {
	constructor (chassis) {
		this.chassis = chassis
		
		this.elements = {
			// 'default-media-queries': this._defaultMediaQueries.bind(this),
			// 'form-legend-rule': this._formLegend.bind(this),
			// 'heading-rule': this._heading.bind(this),
			'root-element-rule': this._rootElement.bind(this),
			// 'container-decls': this._container.bind(this)
		}
	}
	
	generate (root, atRule, data) {
		let element = data.cfg.args[0]
		this.root = root
		this.atRule = atRule
		this.data = data
		
		if (this.elements.hasOwnProperty(element)) {
			this.elements[element]()
			return
		}
		
		console.error(`Chassis spec stylesheet line ${data.source.line}, column ${data.source.column}: Element "${element}" not found.`)
	}
	
	// _container (root, atRule, cfg) {
	// 	let { layout, utils, viewport } = this.chassis
	// 	let range = cfg.hasOwnProperty('range') ? cfg.range : viewport.firstWidthRange
	//
	// 	let level = cfg.args[1]
	// 	let marginBottom = `${layout.getMargin('root', range.upperBound, level)}em`
	//
	// 	atRule.replaceWith(utils.newDecl('margin-bottom', marginBottom))
	// }
	
	/**
   * @property _defaultMediaQueries
   * Create media queries for default typography settings
   * @private
   */
  // _defaultMediaQueries (root, atRule, cfg) {
	// 	// TODO: Create a new root from atRule nodes, process the children
	// 	// at-rules separately and then push the new root to atRule.nodes
	// 	return ''
  // }
	
	// _formLegend (root, atRule, cfg) {
	// 	let { typography, utils, viewport } = this.chassis
	// 	let range = cfg.hasOwnProperty('range') ? cfg.range : viewport.firstWidthRange
	//
	// 	let alias = typography.fontSizes.formLegend
	//
	// 	let fontSize = `${typography.getFontSize(alias, range.upperBound, true)}em`
	// 	let lineHeight = `${typography.getLineHeight(alias, range.upperBound)}em`
	// 	let marginBottom = `${typography.getMargin(alias, range.upperBound)}em`
	//
	// 	let css = utils.newRule('.chassis legend', [
	// 		utils.newDeclObj('font-size', fontSize),
	// 		utils.newDeclObj('line-height', lineHeight),
	// 		utils.newDeclObj('margin-bottom', marginBottom)
	// 	])
	//
	// 	atRule.replaceWith(css)
	// }
	
	// _heading (root, atRule, cfg) {
	// 	let { typography, utils, viewport } = this.chassis
	// 	let range = cfg.hasOwnProperty('range') ? cfg.range : viewport.firstWidthRange
	//
	// 	let level = cfg.args[1]
	// 	let alias = typography.fontSizes.headings[level]
	//
	// 	let fontSize = `${typography.getFontSize(alias, range.upperBound, true)}em`
	// 	let lineHeight = `${typography.getLineHeight(alias, range.upperBound)}em`
	// 	let marginBottom = `${typography.getMargin(alias, range.upperBound)}em`
	//
	// 	let css = utils.newRule(`.chassis h${level}`, [
	// 		utils.newDeclObj('font-size', fontSize),
	// 		utils.newDeclObj('line-height', lineHeight),
	// 		utils.newDeclObj('margin-bottom', marginBottom)
	// 	])
	//
	// 	atRule.replaceWith(css)
	// }
	
	_rootElement () {
		let css = ''
		console.log(this.data.cfg.range);
		// let { layout, typography, utils, viewport } = this.chassis
		//
		// let upperBound = viewport.firstWidthRange.upperBound
		// let fontSize = `${typography.getFontSize('root', upperBound)}px`
		// let lineHeight = `${typography.getLineHeight('root', upperBound)}em`
		//
		// let css = utils.newRule('.chassis', [
		// 	utils.newDeclObj('min-width', `${layout.minWidth}px`),
		// 	utils.newDeclObj('margin', '0'),
		// 	utils.newDeclObj('padding', '0'),
		// 	utils.newDeclObj('font-size', fontSize),
		// 	utils.newDeclObj('line-height', lineHeight)
		// ])
		
		this.atRule.replaceWith(css)
	}
}

module.exports = ChassisGenerator
