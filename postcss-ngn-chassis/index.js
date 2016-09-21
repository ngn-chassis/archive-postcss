'use strict'

const postcss = require('postcss')
const ChassisProject = require('./chassis.js')

module.exports = postcss.plugin('postcss-ngn-chassis', config => {
    config = config || {}

    const chassis = new ChassisProject(config, postcss)

    return (input, output) => {
      input.walkAtRules('chassis', (rule, index) => {
        let mixin = rule.params

        if (mixin === 'init') {
          rule.replaceWith(chassis.coreStyles())
          return
        }

        if (mixin === 'constrain-width') {
          const {selector} = rule.parent
          let parsedGutterValue = chassis.layout.parsedGutter()
          
          input.insertAfter(rule.parent, postcss.atRule({
            name: 'media',
            params: `screen and (max-width: ${chassis.layout.minWidth()}px)`,
            nodes: [
              postcss.rule({
                selector
              }).append(postcss.decl({
                prop: 'padding-left',
                value: chassis.layout.parsedGutter(chassis.layout.minWidth())
              })).append(postcss.decl({
                prop: 'padding-right',
                value: chassis.layout.parsedGutter(chassis.layout.minWidth())
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
                value: chassis.layout.parsedGutter(chassis.layout.maxWidth())
              })).append(postcss.decl({
                prop: 'padding-right',
                value: chassis.layout.parsedGutter(chassis.layout.maxWidth())
              }))
            ]
          }))
          
          rule.replaceWith(chassis.mixins.constrainWidth())
          return
        }

        if (mixin.indexOf('viewport-width') >= 0) {
          let viewport = mixin.split(' ')[1]
          let type = mixin.substring(0, mixin.indexOf('-'))

          rule.replaceWith(chassis.mediaQueries.generate(type, viewport, rule.nodes))
          return
        }
        
        if (mixin === 'block-layout') {
          console.log('apply block layout rules')
        }
        
        if (mixin === 'inline-layout') {
          console.log('apply inline layout rules')
        }
        
        if (mixin === 'hide') {
          console.log('hide element');
        }
        
        if (mixin === 'show') {
          console.log('show element');
        }
        
        if (mixin === 'ellipsis') {
          console.log('apply ellipsis');
        }
        
        if (mixin === 'z-index') {
          console.log('apply calculated z-index');
        }
      })

    }
})
