require('ngn')
require('ngn-data')

class DetailerPlugin {
  /**
   * @method init
   * Initialize ChassisPostCss plugin and process at-rules
   */
  init () {
    return (root, result) => {
      root.walkAtRules('detailer', (atRule) => {
				let params = atRule.params.split(' ')
				let mixin = params[0]
				let args = params.length > 1 ? params.slice(1) : null
		    let nodes = NGN.coalesce(atRule.nodes, [])

				let css

				switch (mixin) {
					case 'generate':
						console.log('Generate Detailer stylesheet');
						break;
					default:

				}
      })
    }
  }
}

module.exports = DetailerPlugin
