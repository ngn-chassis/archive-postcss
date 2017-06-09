class ChassisLayout {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	calculateMarginBottom (lineHeight, type = null) {
		switch (type) {
      case 'outer':
        return lineHeight * this.chassis.settings.typography.typeScaleRatio
        break

      case 'inner':
        return lineHeight
        break

      default:
        return '1em'
    }
	}
}

module.exports = ChassisLayout
