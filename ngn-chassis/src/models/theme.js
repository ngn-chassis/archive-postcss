const defaultTheme = require('../config/default-theme.js')

class ChassisThemeModel {
  constructor (chassis) {
    let typographyModel = new NGN.DATA.Model({
			fields: {
				'font-family': {
					type: String,
					default: defaultTheme.typography['font-family'],
					validate: function (value) {
						return true
					}
				},
        'font-weight': {
					type: String,
					default: defaultTheme.typography['font-weight'],
					validate: function (value) {
						return true
					}
				},
        'font-style': {
					type: String,
					default: defaultTheme.typography['font-style'],
					validate: function (value) {
						return true
					}
				},
        'font-variant': {
					type: String,
					default: defaultTheme.typography['font-variant'],
					validate: function (value) {
						return true
					}
				},
        'color': {
					type: String,
					default: defaultTheme.typography['color'],
					validate: function (value) {
						return true
					}
				}
			}
		})
    
    let linkModel = new NGN.DATA.Model({
      relationships: {
        hover: new NGN.DATA.Model({
          fields: {
            'font-family': {
    					type: String,
    					default: defaultTheme.links.hover['font-family'],
    					validate: function (value) {
    						return true
    					}
    				},
            'font-weight': {
    					type: String,
    					default: defaultTheme.links.hover['font-weight'],
    					validate: function (value) {
    						return true
    					}
    				},
            'font-style': {
    					type: String,
    					default: defaultTheme.links.hover['font-style'],
    					validate: function (value) {
    						return true
    					}
    				},
            'font-variant': {
    					type: String,
    					default: defaultTheme.links.hover['font-variant'],
    					validate: function (value) {
    						return true
    					}
    				},
            'color': {
    					type: String,
    					default: defaultTheme.links.hover['color'],
    					validate: function (value) {
    						return true
    					}
    				},
            'text-decoration': {
    					type: String,
    					default: defaultTheme.links.hover['text-decoration'],
    					validate: function (value) {
    						return true
    					}
    				},
            'text-transform': {
    					type: String,
    					default: defaultTheme.links.hover['text-transform'],
    					validate: function (value) {
    						return true
    					}
    				}
          }
        })
      },
      
      fields: {
        'font-family': {
					type: String,
					default: defaultTheme.links['font-family'],
					validate: function (value) {
						return true
					}
				},
        'font-weight': {
					type: String,
					default: defaultTheme.links['font-weight'],
					validate: function (value) {
						return true
					}
				},
        'font-style': {
					type: String,
					default: defaultTheme.links['font-style'],
					validate: function (value) {
						return true
					}
				},
        'font-variant': {
					type: String,
					default: defaultTheme.links['font-variant'],
					validate: function (value) {
						return true
					}
				},
        'color': {
					type: String,
					default: defaultTheme.links['color'],
					validate: function (value) {
						return true
					}
				},
        'text-decoration': {
					type: String,
					default: defaultTheme.links['text-decoration'],
					validate: function (value) {
						return true
					}
				},
        'text-transform': {
					type: String,
					default: defaultTheme.links['text-transform'],
					validate: function (value) {
						return true
					}
				}
      }
    })

    return new NGN.DATA.Model({
			relationships: {
				typography: typographyModel,
        links: linkModel
			}
		})
  }
}

module.exports = ChassisThemeModel
