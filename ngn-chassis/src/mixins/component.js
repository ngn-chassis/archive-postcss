const ChassisButtonComponent = require('../components/button.js')
const ChassisSvgIconComponent = require('../components/svg-icon.js')
const ChassisLinkComponent = require('../components/link.js')
const ChassisModalComponent = require('../components/modal.js')
const ChassisOverlayComponent = require('../components/overlay.js')
const ChassisTagComponent = require('../components/tag.js')

class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		
		this.specs = {
			'button': ChassisButtonComponent,
			'link': ChassisLinkComponent,
			'modal': ChassisModalComponent,
			'overlay': ChassisOverlayComponent,
			'svg-icon': ChassisSvgIconComponent,
			'tag': ChassisTagComponent
		}
  }
	
	_componentExists (component) {
		return Object.keys(this.specs).includes(component)
	}
	
	include () {
		let { args, atRule, source } = arguments[0]
	
		let css = args.map((component) => {
			if (this._componentExists(component)) {
				return new this.specs[component](this.chassis).css
			}
		
			console.warn(`[WARNING] Line ${source.line}: Component "${component}" not found.`)
			return
		}).filter((entry) => entry !== undefined)
		
		atRule.replaceWith(css)
	}
	
	extend () {
		let { utils } = this.chassis
		let { args, atRule, source } = arguments[0]
		let component = args[0]
		
		if (!this._componentExists(component)) {
			console.warn(`[WARNING] Line ${source.line}: Extensible component "${component}" not found. Discarding...`)
			atRule.remove()
			return
		}
		
		let instance = new this.specs[component](this.chassis)
		
		let root = utils.css.newRoot([
			utils.css.newRule(atRule.parent.selector, atRule.nodes.map((node) => {
				if (node.type === 'decl') {
					return node
				}
				
				return
			}).filter((entry) => entry !== undefined))
		])
		
		atRule.nodes.forEach((node) => {
			if (node.type === 'rule') {
				if (!(node.selector in instance)) {
					// TODO: Add link to proper documentation!
					console.warn(`[WARNING] Line ${source.line}: Chassis extend mixin cannot accept nested rulesets. Please see documentation for formatting. Discarding...`)
					node.remove()
					return
				}
				
				let state = node.selector
				let selector = instance.generateSelectorList(instance.states[state], [atRule.parent.selector], true)
				
				root.append(utils.css.newRule(selector, node.nodes))
			}
		})
		
		atRule.parent.replaceWith(root)
	}
}

module.exports = ChassisComponentMixins
