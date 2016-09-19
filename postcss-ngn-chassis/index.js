'use strict'

const postcss = require('postcss')
const ChassisProject = require('./chassis.js')

module.exports = postcss.plugin('postcss-ngn-chassis', config => {
    config = config || {}

    const chassis = new ChassisProject(config, postcss)

    return (input, output) => {
      input.walkAtRules('chassis', (rule, index) => {
        let method = rule.params

        if (method === 'init') {
          rule.replaceWith(chassis.coreStyles())
          return
        }

        if (method === 'constrain-width') {
          console.log('apply width-constraint')
          return
        }

        if (method.indexOf('viewport-width') >= 0) {
          let viewport = method.split(' ')[1]
          let type = method.substring(0, method.indexOf('-'))

          rule.replaceWith(chassis.mediaQueries.generate(type, viewport, rule.nodes))
          return
        }
      })

    }
})
