'use strict'

const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const ChassisProject = require('./chassis.js')

module.exports = postcss.plugin('postcss-ngn-chassis', config => {
    config = config || {}

    const chassis = new ChassisProject(config)

    const coreTypography = () => {
      const ranges = chassis.getViewportWidthRanges()
      const mediaQueries = []

      ranges.forEach((range, index) => {
        let mediaQuery = postcss.atRule({
          name: 'media',
          params: '',
          nodes: []
        })

        if ( index === ranges.length - 1 ) {
          mediaQuery.params = `screen and (min-width: ${chassis.getMediaQueryValue('min', range.name)})`
        } else if ( index !== 0 ) {
          mediaQuery.params = `screen and (min-width: ${chassis.getMediaQueryValue('at-min', range.name)}) and (max-width: ${chassis.getMediaQueryValue('at-max', range.name)})`
        } else {
          return
        }

        if (!mediaQuery) {
          return
        }

        mediaQuery.nodes.push(postcss.rule({
          selector: '.chassis'
        }).append(postcss.decl({
          prop: 'font-size',
          value: `${chassis.getFontSize('root', range.upperBound)}px`
        })).append(postcss.decl({
          prop: 'line-height',
          value: `${chassis.getLineHeight('root', range.upperBound)}px`
        })))

        for (let i = 1; i <= 6; i++) {
          mediaQuery.nodes.push(headingStyles(`${i}`, range))
        }

        mediaQueries.push(mediaQuery)
      })

      return mediaQueries
    }

    const headingStyles = (level, range) => {
      return postcss.rule({
        selector: `.chassis h${level}`
      }).append(postcss.decl({
        prop: 'font-size',
        value: `${chassis.getFontSize(chassis.constants.typography.headingAliases[level], range.upperBound)}px`
      })).append(postcss.decl({
        prop: 'line-height',
        value: `${chassis.getLineHeight(chassis.constants.typography.headingAliases[level], range.upperBound)}px`
      })).append(postcss.decl({
        prop: 'margin-bottom',
        value: `${chassis.getHeadingMargin(chassis.constants.typography.headingAliases[level], range.upperBound)}px`
      }))
    }

    const constrainWidthDecls = (hasPadding = true) => {
      const decls = []

      decls.push(postcss.decl({
        prop: 'width',
        value: '100%'
      }))

      decls.push(postcss.decl({
        prop: 'min-width',
        value: `${chassis.getLayoutMinWidth()}px`
      }))

      decls.push(postcss.decl({
        prop: 'max-width',
        value: `${chassis.getLayoutMaxWidth()}px`
      }))

      decls.push(postcss.decl({
        prop: 'margin',
        value: '0 auto'
      }))

      if (hasPadding) {
        decls.push(postcss.decl({
          prop: 'padding-left',
          value: chassis.getLayoutGutter()
        }))
        decls.push(postcss.decl({
          prop: 'padding-right',
          value: chassis.getLayoutGutter()
        }))
      }

      return decls
    }

    const chassisCoreStyles = () => {
      const firstRange = chassis.getViewportWidthRanges()[0]

      const reset = postcss.parse(fs.readFileSync(path.join(__dirname, 'stylesheets', 'reset.css')))
      const helpers = postcss.parse(fs.readFileSync(path.join(__dirname, 'stylesheets', 'helpers.css')))

      const widthConstraint = postcss.rule({
        selector: '.width-constraint'
      })

      constrainWidthDecls().forEach(decl => {
        widthConstraint.append(decl)
      })

      const widthConstraintBelowMin = postcss.atRule({
        name: 'media',
        params: `screen and (max-width: ${chassis.getLayoutMinWidth()}px)`,
        nodes: [
          postcss.rule({
            selector: '.width-constraint'
          }).append(postcss.decl({
            prop: 'padding-left',
            value: `calc(${chassis.getLayoutMinWidth()}px * ${parseFloat(chassis.getLayoutGutter())} / 100)`
          })).append(postcss.decl({
            prop: 'padding-right',
            value: `calc(${chassis.getLayoutMinWidth()}px * ${parseFloat(chassis.getLayoutGutter())} / 100)`
          }))
        ]
      })

      const widthConstraintAboveMax = postcss.atRule({
        name: 'media',
        params: `screen and (min-width: ${chassis.getLayoutMaxWidth()}px)`,
        nodes: [
          postcss.rule({
            selector: '.width-constraint'
          }).append(postcss.decl({
            prop: 'padding-left',
            value: `calc(${chassis.getLayoutMaxWidth()}px * ${parseFloat(chassis.getLayoutGutter())} / 100)`
          })).append(postcss.decl({
            prop: 'padding-right',
            value: `calc(${chassis.getLayoutMaxWidth()}px * ${parseFloat(chassis.getLayoutGutter())} / 100)`
          }))
        ]
      })

      const base = postcss.rule({
        selector: '.chassis'
      }).append(postcss.decl({
        prop: 'min-width',
        value: `${chassis.getLayoutMinWidth()}px`
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
        .append(widthConstraint)
        .append(widthConstraintBelowMin)
        .append(widthConstraintAboveMax)
        .append(base)

      for (let i = 1; i <=6; i++) {
        coreStyles.append(headingStyles(`${i}`, firstRange))
      }

      coreStyles.append(formLegend)
        .append(containers)
        .append(blocks)
        .append(p)

      coreTypography().forEach(mediaQuery => {
        coreStyles.append(mediaQuery)
      })

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
