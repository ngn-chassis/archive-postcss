class ChassisBrowserMixins {
  constructor (chassis) {
    this.chassis = chassis
  }

  /**
	 * @mixin ieOnly
	 */
	ieOnly () {
		let { utils } = this.chassis
    let { atRule, nodes } = arguments[0]

    let params = 'all and (-ms-high-contrast: none)'
    let mediaQuery = utils.css.newMediaQuery(params, nodes)
    
    if (atRule) {
      atRule.replaceWith(mediaQuery)
    }
    
    return mediaQuery
	}
}

module.exports = ChassisBrowserMixins
