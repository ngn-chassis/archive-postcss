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
          const {selector} = rule.parent
          
          input.insertAfter(rule.parent, postcss.atRule({
            name: 'media',
            params: `screen and (max-width: ${chassis.layout.minWidth()}px)`,
            nodes: [
              postcss.rule({
                selector
              }).append(postcss.decl({
                prop: 'padding-left',
                // TODO: check for percentage or vw/vh unit before parseFloat;
                // this will not work the same way when using px, ems, or rems
                // for Layout Gutter value
                value: `calc(${chassis.layout.minWidth()}px * ${parseFloat(chassis.layout.gutter())} / 100)`
              })).append(postcss.decl({
                prop: 'padding-right',
                // TODO: check for percentage or vw/vh unit before parseFloat;
                // this will not work the same way when using px, ems, or rems
                // for Layout Gutter value
                value: `calc(${chassis.layout.minWidth()}px * ${parseFloat(chassis.layout.gutter())} / 100)`
              }))
            ]
          }))
          
          input.insertAfter(rule.parent, postcss.atRule({
            name: 'media',
            params: `screen and (min-width: ${chassis.layout.maxWidth()}px)`,
            nodes: [
              postcss.rule({
                selector
              }).append(postcss.decl({
                prop: 'padding-left',
                // TODO: check for percentage or vw/vh unit before parseFloat;
                // this will not work the same way when using px, ems, or rems
                // for Layout Gutter value
                value: `calc(${chassis.layout.maxWidth()}px * ${parseFloat(chassis.layout.gutter())} / 100)`
              })).append(postcss.decl({
                prop: 'padding-right',
                // TODO: check for percentage or vw/vh unit before parseFloat;
                // this will not work the same way when using px, ems, or rems
                // for Layout Gutter value
                value: `calc(${chassis.layout.maxWidth()}px * ${parseFloat(chassis.layout.gutter())} / 100)`
              }))
            ]
          }))
          
          rule.replaceWith(chassis.mixins.constrainWidth())
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
