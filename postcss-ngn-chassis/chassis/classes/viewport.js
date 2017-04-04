const util = require('../utilities')

class ChassisViewport {
  constructor (widthRanges) {
    this.widthRanges = widthRanges
  }

  get numWidthRanges () {
    return this.widthRanges.length
  }

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

  getMediaQuery (type, range, nodes) {
    nodes = nodes || []

    let mediaQuery = util.newAtRule({
      name: 'media',
      params: '',
      nodes
    })

    let value = this.getBound(type, range)

    if (type === 'below' || type === 'max') {
      mediaQuery.params = `screen and (max-width: ${value})`
    } else if (type === 'at') {
      mediaQuery.params = `screen and (min-width: ${this.getBound('at-min', range)}) and (max-width: ${this.getBound('at-max', range)})`
    } else {
      mediaQuery.params = `screen and (min-width: ${value})`
    }

    return mediaQuery
  }
}

module.exports = ChassisViewport
