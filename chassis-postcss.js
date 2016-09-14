'use strict'

class ChassisProject {
	constructor(properties) {
		const me = this
		
		this.config = {
			layout: {
				uiGutter: '6.18vw'
			},
			breakpoints: {
				uiMinWidth: '320px',
				uiMaxWidth: '1440px',
				
				viewportWidthRanges: {
					tiny: {
						lower: '',
						upper: '512px' 
					},
					small: {
						lower: '512px',
						upper: '768px'
					},
					medium: {
						lower: '768px',
						upper: '1024px'
					},
					large: {
						lower: '1024px',
						upper: '1200px'
					},
					huge: {
						lower: '1200px',
						upper: ''
					}
				}
			}
		}
		
		console.log(me);
	}
}

module.exports = ChassisProject

