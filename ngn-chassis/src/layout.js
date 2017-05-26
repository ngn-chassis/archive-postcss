class ChassisLayout {
	constructor (chassis) {
		this.chassis = chassis
		
		this.gutter = chassis.settings.layout.gutter
		this.maxWidth = chassis.settings.layout.maxWidth
		this.minWidth = chassis.settings.layout.minWidth
	}
	
	/**
   * @property maxGutterWidth
   * Gutter width, in pixels, at max viewport width range.
   */
  get maxGutterWidth () {
		return this.getGutterLimit(this.maxWidth)
  }
	
	/**
   * @property minGutterWidth
   * Gutter width, in pixels, at min viewport width range.
   */
  get minGutterWidth () {
		return this.getGutterLimit(this.minWidth)
  }
	
	/**
   * @method getGutterLimit
   * Get a pixel-value for gutter width at min or max viewport width ranges
   * This prevents gutters from shrinking or enlarging when the window has
   * shrunk below the minimum or grown larger than the maximum layout width
   * @param {number} width in px
   * Width of layout at current viewport size
   * Only applicable at min or max
   */
	getGutterLimit (width) {
		let { utils } = this.chassis
		let { typography } = this.chassis.settings
		
		let unit = utils.getUnit(this.gutter)

    switch (unit) {
      case 'vw':
        return `calc(${width}px * ${parseFloat(this.gutter)} / 100)`
        break
		
      case '%':
        return `calc(${width}px * ${parseFloat(this.gutter)} / 100)`
        break
		
      case 'px':
        return this.gutter
        break
		
      case 'em':
        return this.gutter
        break
		
      case 'rem':
        return `${parseFloat(this.gutter) * (typography.baseFontSize * typography.globalMultiplier)}px`
        break
		
      default:
        console.error(`"${unit}" units cannot be used for Layout Gutter. Please use vw, %, px or rem instead.`)
    }
	}
	
	/**
   * @method getMargin
   * Get calculated GR-Typography margin-bottom value
   * @param {string} fontSizeAlias
   * font size alias to use as a base for calculation
   * Accepts root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @param {string} type
   * container type: "outer", "inner" or null
   * @return {number} in ems
   */
  getMargin (fontSizeAlias, upperBound, type = null) {
    let { typography } = this.chassis
    
    switch (type) {
      case 'outer':
        return typography.getLineHeight(fontSizeAlias, upperBound) * typography.typeScaleRatio
        break

      case 'inner':
        return typography.getLineHeight(fontSizeAlias, upperBound)
        break

      default:
        return typography.getFontSize(fontSizeAlias, upperBound, true)
    }
  }
}

module.exports = ChassisLayout
