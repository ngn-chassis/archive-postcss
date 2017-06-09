class ChassisViewport {
	constructor (chassis) {
		this.chassis = chassis
		this.queryTypes = ['min', 'max', 'below', 'at', 'above']
	}
	
	/**
   * @getter firstWidthRanges
   * @return {object}
   */
  get firstWidthRange () {
    return this.chassis.settings.viewportWidthRanges.data[0]
  }
	
	/**
   * @getter numWidthRanges
   * @return {number}
   */
  get numWidthRanges () {
    return this.chassis.settings.viewportWidthRanges.data.length
  }
	
	get widthRanges () {
		return this.chassis.settings.viewportWidthRanges.data
	}
	
	/**
   * @method getBound
   * Get a boundary, in pixels, for use in a media query
   * @param {string} type
   * Type of boundary to return values for
   * Accepts 'min', 'max', 'below', 'at', or 'above'
   * @param {string} rangeName
   * Viewport Width Range name
   * @return {string}
   */
  getBound (type, rangeName) {
    let range = this.widthRanges.find((vwr, i) => rangeName === vwr.name)

    if (!range) {
      console.warn(`Viewport Width Range ${rangeName} does not exist.`)
      return ''
    }
    
    let rangeIsMax = this.widthRanges.indexOf(range) === this.widthRanges.length - 1

    switch (type) {
      case 'below':
        return `${range.lowerBound - 1}px`
        break

      case 'max':
        return `${range.upperBound - 1}px`
        break

      case 'at-min':
        return `${range.lowerBound}px`
        break

      case 'at-max':
        return rangeIsMax ? `${range.upperBound}px` : `${range.upperBound - 1}px`
        break

      case 'min':
        return `${range.lowerBound}px`
        break

      case 'above':
        return `${range.upperBound + 1}px`
        break
    }
  }
	
	/**
   * @method getMediaQuery
   * Get a postcss Media Query at-rule
   * @param {string} type
   * Type of boundary to return values for
   * Accepts 'min', 'max', 'below', 'at', or 'above'
   * @param {string} rangeName
   * Viewport Width Range name
   * @return {at-rule}
   */
  getMediaQuery (type, range, nodes, dimension = 'width') {
    nodes = NGN.coalesce(nodes || [])
		
		let { utils } = this.chassis

    let mediaQuery = utils.newAtRule({
      name: 'media',
      params: '',
      nodes
    })

    if (type === 'below' || type === 'max') {
      mediaQuery.params = `screen and (max-width: ${this.getBound(type, range)})`
    } else if (type === 'at') {
      mediaQuery.params = `screen and (min-width: ${this.getBound('at-min', range)}) and (max-width: ${this.getBound('at-max', range)})`
    } else {
      mediaQuery.params = `screen and (min-width: ${this.getBound(type, range)})`
    }

    return mediaQuery
  }
}

module.exports = ChassisViewport
