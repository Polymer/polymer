/* @flow */

import { cached, camelize } from 'shared/util'
import { parseText } from 'compiler/parser/text-parser'
import {
  getAndRemoveAttr,
  getBindingAttr,
  baseWarn
} from 'compiler/helpers'

type StaticStyleResult = {
  dynamic: boolean,
  styleResult: string
};

const normalize = cached(camelize)

function transformNode (el: ASTElement, options: CompilerOptions) {
  const warn = options.warn || baseWarn
  const staticStyle = getAndRemoveAttr(el, 'style')
  const { dynamic, styleResult } = parseStaticStyle(staticStyle, options)
  if (process.env.NODE_ENV !== 'production' && dynamic) {
    warn(
      `style="${String(staticStyle)}": ` +
      'Interpolation inside attributes has been deprecated. ' +
      'Use v-bind or the colon shorthand instead.'
    )
  }
  if (!dynamic && styleResult) {
    el.staticStyle = styleResult
  }
  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */)
  if (styleBinding) {
    el.styleBinding = styleBinding
  } else if (dynamic) {
    el.styleBinding = styleResult
  }
}

function genData (el: ASTElement): string {
  let data = ''
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`
  }
  if (el.styleBinding) {
    data += `style:${el.styleBinding},`
  }
  return data
}

function parseStaticStyle (staticStyle: ?string, options: CompilerOptions): StaticStyleResult {
  // "width: 200px; height: 200px;" -> {width: 200, height: 200}
  // "width: 200px; height: {{y}}" -> {width: 200, height: y}
  let dynamic = false
  let styleResult = ''
  if (staticStyle) {
    const styleList = staticStyle.trim().split(';').map(style => {
      const result = style.trim().split(':')
      if (result.length !== 2) {
        return
      }
      const key = normalize(result[0].trim())
      const value = result[1].trim()
      const dynamicValue = parseText(value, options.delimiters)
      if (dynamicValue) {
        dynamic = true
        return key + ':' + dynamicValue
      }
      return key + ':' + JSON.stringify(value)
    }).filter(result => result)
    if (styleList.length) {
      styleResult = '{' + styleList.join(',') + '}'
    }
  }
  return { dynamic, styleResult }
}

export default {
  staticKeys: ['staticStyle'],
  transformNode,
  genData
}
