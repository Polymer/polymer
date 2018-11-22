/* @flow */

import VNode from './vnode'
import { createElement } from './create-element'
import { resolveInject } from '../instance/inject'
import { resolveSlots } from '../instance/render-helpers/resolve-slots'
import { installRenderHelpers } from '../instance/render-helpers/index'

import {
  isDef,
  isTrue,
  camelize,
  emptyObject,
  validateProp
} from '../util/index'

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  const options = Ctor.options
  this.data = data
  this.props = props
  this.children = children
  this.parent = parent
  this.listeners = data.on || emptyObject
  this.injections = resolveInject(options.inject, parent)
  this.slots = () => resolveSlots(children, parent)

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  const contextVm = Object.create(parent)
  const isCompiled = isTrue(options._compiled)
  const needNormalization = !isCompiled

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots()
    this.$scopedSlots = data.scopedSlots || emptyObject
  }

  if (options._scopeId) {
    this._c = (a, b, c, d) => {
      const vnode: ?VNode = createElement(contextVm, a, b, c, d, needNormalization)
      if (vnode) {
        vnode.functionalScopeId = options._scopeId
        vnode.functionalContext = parent
      }
      return vnode
    }
  } else {
    this._c = (a, b, c, d) => createElement(contextVm, a, b, c, d, needNormalization)
  }
}

installRenderHelpers(FunctionalRenderContext.prototype)

export function createFunctionalComponent (
  Ctor: Class<Component>,
  propsData: ?Object,
  data: VNodeData,
  contextVm: Component,
  children: ?Array<VNode>
): VNode | void {
  const options = Ctor.options
  const props = {}
  const propOptions = options.props
  if (isDef(propOptions)) {
    for (const key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject)
    }
  } else {
    if (isDef(data.attrs)) mergeProps(props, data.attrs)
    if (isDef(data.props)) mergeProps(props, data.props)
  }

  const renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  )

  const vnode = options.render.call(null, renderContext._c, renderContext)

  if (vnode instanceof VNode) {
    vnode.functionalContext = contextVm
    vnode.functionalOptions = options
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (const key in from) {
    to[camelize(key)] = from[key]
  }
}
