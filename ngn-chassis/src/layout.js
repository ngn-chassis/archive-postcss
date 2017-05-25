class ChassisLayout {
	constructor (chassis) {
		this.chassis = chassis
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
		let { layout, typography } = this.chassis.settings
		
		let unit = utils.getUnit(layout.gutter)

    switch (unit) {
      case 'vw':
        return `calc(${width}px * ${parseFloat(layout.gutter)} / 100)`
        break
		
      case '%':
        return `calc(${width}px * ${parseFloat(layout.gutter)} / 100)`
        break
		
      case 'px':
        return layout.gutter
        break
		
      case 'em':
        return layout.gutter
        break
		
      case 'rem':
        return `${parseFloat(layout.gutter) * (typography.baseFontSize * typography.globalMultiplier)}px`
        break
		
      default:
        console.error(`"${unit}" units cannot be used for Layout Gutter. Please use vw, %, px or rem instead.`)
    }
	}
	
	/**
   * @property maxGutterWidth
   * Gutter width, in pixels, at max viewport width range.
   */
  get maxGutterWidth () {
		return this.getGutterLimit(this.chassis.settings.layout.maxWidth)
  }
	
	/**
   * @property minGutterWidth
   * Gutter width, in pixels, at min viewport width range.
   */
  get minGutterWidth () {
		return this.getGutterLimit(this.chassis.settings.layout.minWidth)
  }
}

module.exports = ChassisLayout
