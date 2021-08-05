/* @flow */
//$mount先执行这个文件

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

//保存runtime/index.js下的Vue.prototype.$mount
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  console.log('entry-tuntime')
  el = el && query(el)
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
  const options = this.$options
  //解析模板/ el并转换为渲染功能
  if (!options.render) {
    let template = options.template
    //是否是template形式
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      //获取节点模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      //template -> AST树  AST -> render函数 -> _c _v _s
      //导出的render函数就是根据el生成vnode方法、执行render方法就能得到vnode

      //vue编译比较复杂、第一步会通过一些配置文件进行初始化编译方法其中包括合并一些选项、比如comments、delimiters、然后会利用闭包维护一个cache对象、保存每次编译的结果、方便下次render返回结果、然后拿到这些选项配置对象去执行compile方法、方法里面还是做一些校验和合并其他选项比如directives..最后才开始核心部分调用baseCompile方法、baseCompile方法开始核心的第一步执行parse方法进行ast树的生成
      //编译部分第一步parse，取字符串template内容和初始化好的配置对象、方法里面主要还是做一些公共操作方法的封装、比如删除节点方法、定义一些判断方法、设置parseHTML方法需要的方法和参数、
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      //添加 render
      options.render = render
      options.staticRenderFns = staticRenderFns
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
