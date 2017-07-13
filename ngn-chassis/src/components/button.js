const ChassisComponent = require('../component')

class ChassisButtonComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)

		this.baseTypography = chassis.settings.typography.ranges.first.typography

		this.states = {
			'default': [''],
			'visited': [':visited'],
			'hover': [':hover'],
			'active': [':active'],
			'disabled': ['[disabled]', '.disabled'],
			'focus': [':focus'],
			'icon': [' svg.icon'],
			'pill': ['.pill'],
			'multi-line': ['.multi-line']
		}

		this.variants = {
			'class': '.button',
			'tag': 'button'
		}
		
		// TODO: Use this to determine which reset to use
		this.type = 'inline-block'
		this.selectors = ['.button', 'button']
		this.extensions = NGN.coalesce(chassis.extensions.button, null)
	}

	get css () {
		let { atRules, linkOverrides, settings, theme, utils } = this.chassis
		let { rules } = this

		if (settings.legacy) {
			rules.push(atRules.browserMixins.ieOnly({
				nodes: [
					utils.css.newRule('button, button:focus, button:active', [
						utils.css.newDeclObj('background', 'none'),
						utils.css.newDeclObj('border', 'none'),
						utils.css.newDeclObj('outline', 'none'),
						utils.css.newDeclObj('color', 'inherit')
					]),
					utils.css.newRule('button span', [
						utils.css.newDeclObj('position', 'relative')
					])
				]
			}))
		}

		return utils.css.newRoot(rules)
	}
	
	_getLinkOverrides (state, themeDecls) {
		let { linkOverrides, utils } = this.chassis
		
		let globalLinkOverrides = linkOverrides.find((decl) => {
			return decl.state === state
		})
		
		if (!globalLinkOverrides) {
			return []
		}
		
		let linkDecls = globalLinkOverrides.decls
		let uniqueLinkProps = utils.css.getUniqueProps(linkDecls, themeDecls)
		
		if (state === 'default') {
			return uniqueLinkProps.map((prop) => utils.css.newDeclObj(prop, 'unset'))
		}
		
		console.log('--- ' + state.toUpperCase() + ' STATE ---');
		console.log(state.toUpperCase() + ' LINK THEME:');
		console.log(linkDecls);
		console.log('DEFAULT BUTTON THEME');
		console.log(this.getThemeDecls('button'));
		console.log(state.toUpperCase() + ' BUTTON THEME');
		console.log(themeDecls);
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
		let defaultTheme = this.getThemeDecls('button')
		
		// Props common between Link Component State and Default Button Component
		let commonProps = utils.css.getCommonProps(linkDecls, defaultTheme)
		
		// If both link.${state} AND button.default themes include a property,
		// AND it is not already included in the button.${state} theme, add this override:
		// property: default button value;
		if (commonProps.length > 0) {
			let defaultDecls = commonProps.map((prop) => {
				return defaultTheme.find((decl) => decl.prop === prop)
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
				return !themeDecls.some((decl) => decl.prop === prop)
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
		
		let themeDecls = this.getThemeDecls('button')
		let overrides = this._getLinkOverrides('default', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.default), [
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
			...overrides,
			...themeDecls
		])
	}

	get visited () {
		let { utils } = this.chassis
		
		let themeDecls = this.getThemeDecls('button.visited')
		// let overrides = this._getLinkOverrides('visited', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.visited), [
			// ...overrides,
			...themeDecls
		])
	}

	get hover () {
		let { utils } = this.chassis
		
		let themeDecls = this.getThemeDecls('button.hover')
		let overrides = this._getLinkOverrides('hover', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.hover), [
			...overrides,
			...themeDecls
		])
	}

	get active () {
		let { utils } = this.chassis
		
		let themeDecls = this.getThemeDecls('button.active')
		// let overrides = this._getLinkOverrides('active', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.active), [
			// ...overrides,
			...themeDecls
		])
	}

	get disabled () {
		let { utils } = this.chassis
		
		let themeDecls = this.getThemeDecls('button.disabled')
		// let overrides = this._getLinkOverrides('disabled', themeDecls)

		return utils.css.newRule(`${this.generateSelectorList(this.states.disabled[0])}, ${this.generateSelectorList(this.states.disabled[1])}`, [
			utils.css.newDeclObj('pointer-events', 'none'),
			// ...overrides,
			...themeDecls
		])
	}

	get focus () {
		let { utils } = this.chassis
		
		let themeDecls = this.getThemeDecls('button.focus')
		// let overrides = this._getLinkOverrides('focus', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.focus), [
			// ...overrides,
			...themeDecls
		])
	}

	get icon () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let offset = `-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`
		
		let themeDecls = this.getThemeDecls('button.icon')
		// let overrides = this._getLinkOverrides('icon', themeDecls)

		return utils.css.newRule(this.generateSelectorList(this.states.icon), [
			utils.css.newDeclObj('transform', `translateX(${offset})`),
			// ...overrides,
			...themeDecls
		])
	}

	get pill () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule(this.generateSelectorList(this.states.pill), [
			utils.css.newDeclObj('padding-left', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('padding-right', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('border-radius', `${lineHeightMultiplier}em`),
			...this.getThemeDecls('button.pill')
		])
	}

	get 'multi-line' () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)

		let padding = (inlineHeight - lineHeightMultiplier) / 2

		return utils.css.newRule(this.generateSelectorList(this.states['multi-line']), [
			utils.css.newDeclObj('padding-top', `${padding}em`),
			utils.css.newDeclObj('padding-bottom', `${padding}em`),
			utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
			utils.css.newDeclObj('white-space', 'normal'),
			...this.getThemeDecls('button.multi-line')
		])
	}
}

module.exports = ChassisButtonComponent
