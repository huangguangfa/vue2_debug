/* @flow */

import { inBrowser } from 'core/util/index'

// check whether current browser encodes a char inside attribute values
let div
function getShouldDecode (href: boolean): boolean {
  div = div || document.createElement('div')
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't 在属性值中编码换行符，而其他浏览器则不
export const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
// #6828: chrome encodes content in a[href] chrome对a [href]中的内容进行编码
export const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
