const ChassisUtils = require('../utilities')

class ChassisViewport {
  constructor (widthRanges) {
    this.widthRanges = widthRanges
    this.validQueryTypes = ['min', 'max', 'below', 'at', 'above']
  }

  /**
   * @getter numWidthRanges
   * @return {number}
   */
  get numWidthRanges () {
    return this.widthRanges.length
  }

  /**
   * @getter _widthRangesList
   * Get a comma-separated human-readable list of viewport width ranges
   * @return {string}
   * @private
   */
  get _widthRangesList () {
    return `${[...this.widthRanges].slice(0, this.widthRanges.length - 1).map(range => range.name).join(', ')}, or ${this.widthRanges.pop().name}`
  }

  /**
   * @getter _queryTypesList
   * Get a comma-separated human-readable list of media query types
   * @return {string}
   * @private
   */
  get _queryTypesList () {
    return `${[...this.validQueryTypes].slice(0, this.validQueryTypes.length - 1).join(', ')}, or ${this.validQueryTypes.pop()}`
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
    let index = 0

    let range = this.widthRanges.find((vwr, i) => {
      index = i
      return rangeName === vwr.name
    })

    if (!range) {
      console.warn(`Viewport Width Range ${rangeName} does not exist.`)
      return ''
    }

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
        return index === this.widthRanges.length ? `${range.upperBound}px` : `${range.upperBound - 1}px`
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
  getMediaQuery (type, range, nodes, dimension) {
    nodes = NGN.coalesce(nodes || [])
    dimension = NGN.coalesce(dimension, 'width')

    let mediaQuery = ChassisUtils.newAtRule({
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

  /**
   * @method validateMediaQuery
   * Validate a user media query mixin ie '@chassis media-query at small width'
   * @param {object} line
   * line the the user's CSS where the media query mixin is called
   * Shape: {line: {number}, column: {number}}
   * @param {string} type
   * Type of media query
   * Accepts 'min', 'max', 'below', 'at', or 'above'
   * @param {string} viewport
   * Viewport Width Range name
   */
  validateMediaQuery (line, type, viewport) {
    if (!type || !this.validQueryTypes.includes(type)) {
      console.error(`[ERROR] ${line}: Invalid Media Query type. Please specify ${this._queryTypesList}`)
      return false
    }

    if (!viewport || !this.widthRanges.some(range => range.name === viewport)) {
      console.error(`[ERROR] ${line}: Invalid Viewport. Please specify ${this._widthRangesList}`)
      return false
    }

    return true
  }
}

module.exports = ChassisViewport
