const postcss = require('postcss')
const nesting = require('postcss-nesting')

class ChassisSpecsheet {
	constructor (chassis, filepath) {
		this.chassis = chassis
		
		this.directoryPath = NGN.coalesce(chassis.utils.getFilePath(filepath), '')
		this.css = chassis.utils.parseStylesheet(filepath)
		
		// this.css = this.unnest(this.css)
		
		this.css.walkAtRules('chassis-spec', (atRule) => {
			this.processSpecRule(atRule, this.getAtRuleData(atRule))
		})
	}
	
	getAtRuleData (raw, range = null) {
		let params = raw.params.split(' ')
		
		let cfg = {
			args: params.length > 1 ? params.slice(1) : null
		}
		
		if (range) {
			cfg.range = range
		}
		
		return {
			source: raw.source.start,
			mixin: params[0],
			cfg,
			nodes: raw.nodes
		}
	}
	
	processVar (variable, range = null) {
		// console.log(range);
		
		let variables = {
			'min-ui-width': this.chassis.settings.layout.minWidth,
			'max-ui-width': this.chassis.settings.layout.maxWidth,
			
		}
		
		return ''
	}
	
	processTypographyRangeLoop (specRule, range) {
		let { settings, utils } = this.chassis
		
		let output = []
		
		for (let i = range[0]; i <= range[1]; i++) {
			let vwr = settings.typography.ranges.find(i)
		
			specRule.nodes.forEach((node) => {
				switch (node.type) {
					case 'atrule':
						console.log('TODO: Process nested at-rule');
						break
			
					default:
						node.walkAtRules('chassis', (atRule) => {
							let data = this.getAtRuleData(atRule, vwr)
						
							switch (data.mixin) {
								case 'font-size':
								console.log('heyyy');
									let alias = NGN.coalesce(data.cfg.args[0], 'root')
									let fontSize = data.cfg.range.typography[alias].size
									let unit = NGN.coalesce(data.cfg.args[1], 'px')
									
									if (unit !== 'px') {
										console.log('handle units');
									}
						
									atRule.replaceWith(utils.newDecl('font-size', `${fontSize}${unit}`))
									break;
								default:
						
							}
						})
			
						node.walkDecls((decl) => {
							if (decl.value.startsWith('$')) {
								this.processVar(decl.value, vwr)
							}
						})
				}
			})
		
			let mediaQuery = this.chassis.utils.newAtRule({
		    name: 'media',
		    params: `screen and (min-width: ${vwr.bounds.lower}px)`,
		    nodes: specRule.nodes
		  })
		
			output.push(mediaQuery)
		}
		
		return output
	}
	
	processForLoop (specRule, args) {
		let { settings } = this.chassis
		
		let iterable = args[0]
		let lowerBound = NGN.coalesce(parseInt(args[1]), 0)
		let upperBound = NGN.coalesce(args[3], null)
		
		let range = [lowerBound]
		
		if (upperBound) {
			range.push(upperBound)
		}
		
		switch (iterable) {
			case 'typography-range':
				if (range.length === 1) {
					range.push(settings.typography.ranges.recordCount - 1)
				}
				
				specRule.replaceWith(this.processTypographyRangeLoop(specRule, range))
				break
				
			default:
				console.error(`[ERROR] Chassis Spec Sheet: Mixin "for" iterable "${iterable}" not found.`)
		}
	}
	
	processSpecRule (specRule, data) {
		switch (data.mixin) {
			case 'for':
				this.processForLoop(specRule, data.cfg.args)
				break
			
			// case 'forEach':
			// 	specRule.replaceWith(this.processForEachLoop(data))
			// 	break
				
			default:
				console.error(`[ERROR] Chassis Spec Sheet: Mixin "${data.mixin}" not found.`)
		}
	}
	
	processAtRule (atRule, data) {
		let { atRules, generator, importer } = this.chassis
		// this.chassis.utils.printTree(data);
		
		switch (data.mixin) {
			// case 'import':
			// 	atRule.replaceWith(importer.importStylesheet(`${this.directoryPath}/${data.cfg.args[0].replace(/\"/g, "")}`))
			// 	break
			//
			// case 'generate':
			// 	generator.generate(this.css, atRule, data)
			// 	break
		
			default:
				atRules.process(this.css, atRule, data)
		}
	}
	
	unnest (stylesheet) {
		return postcss.parse(nesting.process(stylesheet))
	}
}

module.exports = ChassisSpecsheet
