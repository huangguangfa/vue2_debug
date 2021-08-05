import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  //在初始化initMixin函数的时候在vue原型挂载了_init
  this._init(options)
}

//往vue原型挂载方法 _init
initMixin(Vue)
//往实例原型 "挂载" 在一些vue的APi比如 $set 、$delete、$watch等
stateMixin(Vue)
//往实例原型 "挂载" 全局的event bus方法 $on $once $off
eventsMixin(Vue)
//往实例原型 "挂载" 一些生命周期的方法比如 " _update "  " $destroy "  " $forceUpdate "
lifecycleMixin(Vue)
//往实例原型 "挂载" $nextTick、_render渲染函数
renderMixin(Vue)

export default Vue
