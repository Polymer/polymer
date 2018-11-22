/* @flow */

import { genStaticKeys } from 'shared/util'
import { createCompiler } from 'compiler/index'

import modules from './modules/index'
import directives from './directives/index'

import {
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  canBeLeftOpenTag,
  getTagNamespace
} from '../util/index'

export const baseOptions: CompilerOptions = {
  modules,
  directives,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  preserveWhitespace: false,
  staticKeys: genStaticKeys(modules)
}

const { compile, compileToFunctions } = createCompiler(baseOptions)
export { compile, compileToFunctions }
