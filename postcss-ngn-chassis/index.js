'use strict'

const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const ChassisProject = require('./chassis.js')

module.exports = postcss.plugin('postcss-ngn-chassis', config => {
    config = config || {}
    
    const chassis = new ChassisProject(config)
    const firstRange = chassis.getViewportWidthRanges()[0]
    
    const headingStyles = level => {
      return postcss.rule({
        selector: `.chassis h${level}`
      }).append(postcss.decl({
        prop: 'font-size',
        value: `${chassis.getFontSize(chassis.constants.typography.headingAliases[level], firstRange.upperBound)}px`
      })).append(postcss.decl({
        prop: 'line-height',
        value: `${chassis.getLineHeight(chassis.constants.typography.headingAliases[level], firstRange.upperBound)}px`
      })).append(postcss.decl({
        prop: 'margin-bottom',
        value: `${chassis.getHeadingMargin(chassis.constants.typography.headingAliases[level], firstRange.upperBound)}px`
      }))
    }
    
    const chassisCoreStyles = () => {
      const reset = postcss.parse(fs.readFileSync(path.join(__dirname, 'stylesheets', 'reset.css')))
      const helpers = postcss.parse(fs.readFileSync(path.join(__dirname, 'stylesheets', 'helpers.css')))
      
      const base = postcss.rule({
        selector: '.chassis'
      }).append(postcss.decl({
        prop: 'min-width',
        value: chassis.getLayoutMinWidth()
      })).append(postcss.decl({
        prop: 'margin',
        value: '0'
      })).append(postcss.decl({
        prop: 'padding',
        value: '0'
      })).append(postcss.decl({
        prop: 'font-size',
        value: `${chassis.getFontSize('root', firstRange.upperBound)}px`
      })).append(postcss.decl({
        prop: 'line-height',
        value: `${chassis.getLineHeight('root', firstRange.upperBound)}px`
      }))
      
      const h1 = headingStyles('1')
      const h2 = headingStyles('2')
      const h3 = headingStyles('3')
      const h4 = headingStyles('4')
      const h5 = headingStyles('5')
      const h6 = headingStyles('6')
      
      const formLegend = postcss.rule({
        selector: '.chassis legend'
      }).append(postcss.decl({
        prop: 'font-size',
        value: `${chassis.getFontSize(chassis.constants.typography.formLegendAlias, firstRange.upperBound)}px`
      })).append(postcss.decl({
        prop: 'line-height',
        value: `${chassis.getLineHeight(chassis.constants.typography.formLegendAlias, firstRange.upperBound)}px`
      })).append(postcss.decl({
        prop: 'margin-bottom',
        value: `${chassis.getHeadingMargin(chassis.constants.typography.formLegendAlias, firstRange.upperBound)}px`
      }))
      
      const containers = postcss.rule({
        selector: '.chassis section, .chassis nav, .chassis form'
      }).append(postcss.decl({
        prop: 'margin-bottom',
        value: `${chassis.getContainerMargin('root', firstRange.upperBound)}px`
      }))
      
      const blocks = postcss.rule({
        selector: '.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed'
      }).append(postcss.decl({
        prop: 'margin-bottom',
        value: `${chassis.getBlockMargin('root', firstRange.upperBound)}px`
      }))
      
      const p = postcss.rule({
        selector: '.chassis p'
      }).append(postcss.decl({
        prop: 'margin-bottom',
        value: '1em'
      }))
      
      const coreStyles = reset
        .append(helpers)
        .append(base)
        .append(h1)
        .append(h2)
        .append(h3)
        .append(h4)
        .append(h5)
        .append(h6)
        .append(formLegend)
        .append(containers)
        .append(blocks)
        .append(p)
      
      return coreStyles
    }

    return (input, output) => {
      input.walkAtRules('chassis', (rule, index) => {
        switch (rule.params) {
          case 'init':
            rule.replaceWith(chassisCoreStyles())
            break
          
          case 'constrain-width':
            console.log('constrain width')
            break
            
        }
      })
      
    }
})
