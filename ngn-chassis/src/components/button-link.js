const ChassisComponent = require('../component')

class ChassisButtonLinkComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['a.button'], states = {
		'default': [''],
		'visited': [':visited'],
		'hover': [':hover'],
		'active': [':active'],
		'disabled': ['[disabled]', '.disabled'],
		'focus': [':focus'],
		'icon': [' svg.icon'],
		'pill': ['.pill'],
		'multi-line': ['.multi-line']
	}, extensions = NGN.coalesce(chassis.extensions.button, null), resetType = 'inline-block') {
		super(chassis, theme, selectors, states, extensions, resetType)
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}
	
	_getLinkOverrides (state) {
		let { linkOverrides, utils } = this.chassis
	
		let globalLinkOverrides = linkOverrides.find((decl) => {
			return decl.state === state
		})
	
		if (!globalLinkOverrides) {
			return []
		}
		
		let defaultTheme = this.getThemeDecls('default')
		let stateTheme = this.getThemeDecls(state)
		let linkDecls = globalLinkOverrides.decls
		let uniqueLinkProps = utils.css.getUniqueProps(linkDecls, stateTheme)
	
		if (state === 'default') {
			return uniqueLinkProps.map((prop) => utils.css.newDeclObj(prop, 'unset'))
		}
	
		console.log('--- ' + state.toUpperCase() + ' STATE ---');
		console.log(state.toUpperCase() + ' LINK THEME:');
		console.log(linkDecls);
		console.log('DEFAULT BUTTON THEME');
		console.log(defaultTheme);
		console.log(state.toUpperCase() + ' BUTTON THEME');
		console.log(stateTheme);
		console.log('---');
		console.log(`If both ${state} link AND default button themes include a property,`);
		console.log(`AND it is not already included in the ${state} button theme, add this override:`);
		console.log(`property: default button value;`);
		console.log('UNLESS extending a button, in which case use this override');
		console.log(`property: extended button default state value;`);
		console.log('---');
		console.log(`If a property is included in ${state} link theme but not default button theme,`);
		console.log(`AND it is not already included in the ${state} button theme,`);
		console.log(`unset it in ${state} button theme`);
	
		let overrides = []
		
		// Props common between Link Component State and Default Button Component
		let commonProps = utils.css.getCommonProps(linkDecls, stateTheme)
	
		// If both link.${state} AND button.default themes include a property,
		// AND it is not already included in the button.${state} theme, add this override:
		// property: default button value;
		if (commonProps.length > 0) {
			let defaultDecls = commonProps.map((prop) => {
				return stateTheme.find((decl) => decl.prop === prop)
			}).filter((entry) => entry !== undefined)
	
			overrides.push(...defaultDecls)
		}
	
		// UNLESS extending a button, in which case use this override
		// property: extended button default state value;
		// TODO
	
		// If a property is included in link.${state} theme but not default button theme,
		// AND it is not already included in the button.${state} theme,
		// unset it in ${state} button theme
		if (uniqueLinkProps.length > 0) {
			let unset = uniqueLinkProps.filter((prop) => {
				return !commonProps.includes(prop)
			}).filter((prop) => {
				return !stateTheme.some((decl) => decl.prop === prop)
			})
			
			let indexesToRemove = []
			
			unset.forEach((prop, index) => {
				let matchInDefaultTheme = defaultTheme.find((decl) => decl.prop === prop)
				
				if (matchInDefaultTheme) {
					indexesToRemove.push(index)
					overrides.push(matchInDefaultTheme)
				}
			})
			
			indexesToRemove.forEach((index) => {
				unset.splice(index, 1)
			})
	
			if (unset.length > 0) {
				overrides.push(...unset.map((prop) => {
					return utils.css.newDeclObj(prop, 'unset')
				}))
			}
		}
	
		console.log('\n---');
		console.log('FINAL OUTPUT');
		console.log(overrides);
		console.log('\n');
	
		return overrides
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('display', 'inline-flex'),
			utils.css.newDeclObj('justify-content', 'center'),
			utils.css.newDeclObj('align-items', 'center'),
			utils.css.newDeclObj('margin', `0 ${typography.calculateInlineMarginX(lineHeightMultiplier)}em ${typography.calculateInlineMarginY(lineHeightMultiplier)}em 0`),
			utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`),
			utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightMultiplier)}`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('text-align', 'center'),
			utils.css.newDeclObj('white-space', 'nowrap'),
			utils.css.newDeclObj('cursor', 'pointer'),
			utils.css.newDeclObj('user-select', 'none'),
			...this._getLinkOverrides('default')
		]
	}

	get visited () {
		let { utils } = this.chassis
		return [...this._getLinkOverrides('visited')]
	}
	
	get hover () {
		let { utils } = this.chassis
		return [...this._getLinkOverrides('hover')]
	}
	
	get active () {
		let { utils } = this.chassis
		return [...this._getLinkOverrides('active')]
	}
	
	get disabled () {
		let { utils } = this.chassis
	
		return [
			utils.css.newDeclObj('pointer-events', 'none'),
			...this._getLinkOverrides('disabled')
		]
	}
	
	get focus () {
		let { utils } = this.chassis
		return [...this._getLinkOverrides('focus')]
	}
	
	get icon () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
	
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let offset = `-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`
	
		return [
			utils.css.newDeclObj('transform', `translateX(${offset})`),
			...this._getLinkOverrides('icon')
		]
	}
	
	get pill () {
		let { settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
	
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
	
		return [
			utils.css.newDeclObj('padding-left', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('padding-right', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('border-radius', `${lineHeightMultiplier}em`),
			...this._getLinkOverrides('pill')
		]
	}
	
	get 'multi-line' () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
	
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2
	
		return [
			utils.css.newDeclObj('padding-top', `${padding}em`),
			utils.css.newDeclObj('padding-bottom', `${padding}em`),
			utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
			utils.css.newDeclObj('white-space', 'normal'),
			...this._getLinkOverrides('multi-line')
		]
	}
}

module.exports = ChassisButtonLinkComponent
