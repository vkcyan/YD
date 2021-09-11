import { cssTopx } from '@/utils'

/**
 * json转vue代码
 * @param components
 */
function jsonToVue(components: any[], pageWidth, pageUnit) {
  console.log(components)
  let html = ''
  let css = ''

  components.map((res) => {
    let pClass = getClass()
    // 开始组装代码
    let parentHtml = ''
    // 全局样式处理
    let classItem = ''
    res.components.map((child) => {
      let cClass = getClass() // 当前class名称
      // 解析html
      parentHtml = `${parentHtml}${objToH5(child, cClass)}`
      // 解析css
      classItem = `${classItem}.${pClass} .${cClass}{${objToClass(child.cssModule, pageWidth, pageUnit)}}`
    })
    // 组件处理 id="${res.id}"
    html = html + `<div class="${pClass}">${parentHtml}</div>`
    css = css + `.${pClass}{${objToClass(res.cssModule, pageWidth, pageUnit)}}${classItem}`
  })
  html = `<template><div>${html}</div></template>`
  css = `<style>${css}</style>`

  downFile(`${html}${css}`)
}

/**
 * 获取随机class名称
 * @returns
 */
function getClass() {
  let length = 8
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
/**
 * 将对象转为css
 * @param obj
 * @returns
 */
function objToClass(obj, pageWidth, pageUnit) {
  let text = ''
  for (const key in obj) {
    if (cssTopx(key) && !String(cssTopx(key)).includes('%')) {
      text = `${text}${key}:${obj[key] * Math.round(pageWidth / 375)}${pageUnit};`
    } else {
      text = `${text}${key}:${obj[key]};`
    }
  }
  return text
}
/**
 * 根据组件生成h5标签
 * @param child 当前子组件
 * @param cClass 当前组件class名称
 * @returns
 */
function objToH5(child, cClass) {
  let label = child.name.split('-')[1] // 当前标签名称
  let { value, src, placeholder } = child.staticData
  let childHtml = ''
  let commonLabel = `class="${cClass}"` // 公共标签 id="${child.id}"
  switch (label) {
    case 'button':
      childHtml = `<${label} ${commonLabel}>${value}</${label}>`
      break
    case 'img':
      childHtml = `<${label} ${commonLabel} src="${src}"/>`
      break
    case 'p':
      childHtml = `<${label} ${commonLabel}>${value}</${label}>`
      break
    case 'input':
      childHtml = `<${label} ${commonLabel} placeholder="${placeholder}"/>`
      break
    default:
      break
  }
  return childHtml
}

/**
 * 下载代码文件
 */
function downFile(text: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'index.vue'
  document.documentElement.appendChild(a)
  a.click()
  document.documentElement.removeChild(a)
}

export { jsonToVue }