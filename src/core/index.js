import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

//初始化全局API use set delete nextTick mixin  extend component directive filter 等等
initGlobalAPI(Vue)

//拦截 $isServer 是否是一个服务
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})
//拦截 $ssrContex 是否是一个ssr服务
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// 公开用于ssr运行时帮助程序安装的FunctionalRenderContext
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
