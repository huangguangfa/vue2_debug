/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };

function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}
// - 判断配置和当前组件名称是否匹配
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },
  // 删除所有的缓存
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    //监听配置、重置缓存信息
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  //执行页面render
  render () {
    console.log('渲染')
    const slot = this.$slots.default
    //获取kepp-alive组件下的第一个子组件vndoe
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // 获取组件名称
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this;
      //判断是否是需要缓存、不需要直接走这if
      if (
        // 有include和没有获取到name值 或者 include是否包含name值
        (include && (!name || !matches(include, name))) ||
        // 是否是白名单、直接过滤
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      //需要缓存逻辑
      const { cache, keys } = this
      //判断是否有key、如果没有vue会自动给他加上key
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      //当前是否已经有缓存下来的组件数据、有直接取缓存的
      if (cache[key]) {
        //赋值缓存的vnode
        vnode.componentInstance = cache[key].componentInstance
        // 保存最新的key
        remove(keys, key)
        keys.push(key)
      } else {
        //保存缓存vnode数据
        cache[key] = vnode
        //添加key
        keys.push(key)
        // 判断是否超过最大缓存值
        if (this.max && keys.length > parseInt(this.max)) {
          //超过就删除第一个保存的vnode
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      //添加keepAlive = true标记
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
