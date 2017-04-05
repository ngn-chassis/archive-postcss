const util = require('../utilities')

class ChassisViewport {
  constructor (widthRanges) {
    this.widthRanges = widthRanges
    this.validQueryTypes = ['min', 'max', 'below', 'at', 'above']
  }

  get numWidthRanges () {
    return this.widthRanges.length
  }

  get _widthRangesList () {
    return `${[...this.widthRanges].slice(0, this.widthRanges.length - 1).map(range => range.name).join(', ')}, or ${this.widthRanges.pop().name}`
  }

  get _queryTypesList () {
    return `${[...this.validQueryTypes].slice(0, this.validQueryTypes.length - 1).join(', ')}, or ${this.validQueryTypes.pop()}`
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

  getMediaQuery (type, range, nodes, dimension) {
    nodes = NGN.coalesce(nodes || [])

    let mediaQuery = util.newAtRule({
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
