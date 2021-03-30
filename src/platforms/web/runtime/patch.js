/* @flow */
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied
const modules = platformModules.concat(baseModules)
//得到createPatchFunction函数返回的vnode对比patch方法 nodeOps 一些dom原生方法 创建节点... document.createTextNode
export const patch: Function = createPatchFunction({ nodeOps, modules })
