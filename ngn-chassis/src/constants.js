const ChassisButtonComponent = require('./components/button.js')
const ChassisButtonLinkComponent = require('./components/button-link.js')
const ChassisSvgIconComponent = require('./components/svg-icon.js')
const ChassisLinkComponent = require('./components/link.js')
const ChassisModalComponent = require('./components/modal.js')
const ChassisOverlayComponent = require('./components/overlay.js')
const ChassisTagComponent = require('./components/tag.js')

class ChassisConstants {
	// Order is important!
	// The order specified here determines the order in which components will be
	// added to the style sheet; This must be correct for proper cascade behavior.
	static get components () {
		return [
			{
				name: 'link',
				spec: ChassisLinkComponent
			},
			{
				name: 'svg-icon',
				spec: ChassisSvgIconComponent
			},
			{
				name: 'button',
				spec: ChassisButtonComponent
			},
			{
				name: 'button-link',
				spec: ChassisButtonLinkComponent
			},
			{
				name: 'tag',
				spec: ChassisTagComponent
			},
			{
				name: 'overlay',
				spec: ChassisOverlayComponent
			},
			{
				name: 'modal',
				spec: ChassisModalComponent
			}
		]
	}

	static get layout () {
		return {
			viewport: {
				minWidth: 0,
				maxWidth: 7680, // Up to 8k displays supported
				widthIncrement: 320
			},
			mediaQueries: {
				operators: ['<', '<=', '=', '>=', '>']
			}
		}
	}
	
	static get theme () {
		return {
			defaultFilePath: '../stylesheets/default-theme.css'
		}
	}
	
	static get typography () {
		return {
			breakpoints: (() => {
				let { viewport } = this.layout
				let breakpoints = []

				for (let width = viewport.minWidth; width <= viewport.maxWidth; width += viewport.widthIncrement) {
					breakpoints.push(width)
				}

				return breakpoints
			})(),
			scale: {
				ratios: {
					'minor second': 1.067,
					'major second': 1.125,
					'minor third': 1.2,
					'major third': 1.25,
					'perfect fourth': 4 / 3,
					'tritone': 1.414,
					'perfect fifth': 1.5,
					'golden ratio': 1.61803398875
				},
				threshold: 640 // The viewport width above which font size should start to increment from base
			},
			sizeAliases: ['small', 'root', 'large', 'larger', 'largest']
		}
	}
}

module.exports = ChassisConstants
