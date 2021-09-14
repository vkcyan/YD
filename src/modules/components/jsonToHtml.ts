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
    html = html + `<div class="${pClass}">${parentHtml}</div>`
    css = css + `.${pClass}{${objToClass(res.cssModule, pageWidth, pageUnit)}}${classItem}`
  })
  html = `<div>${html}</div>`
  css = `<style>${css}</style>`
  let downHtml = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        body,html {
          margin:0;
          padding:0
        }
      </style>
    </head>
    <body>
    ${html}
    </body>
    ${css}
  </html>`
  downFile(downHtml, 'index.html')
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
    if (cssTopx(key) && !String(obj[key]).includes('%')) {
      text = `${text}${key}:${Math.round(obj[key] * (pageWidth / 375))}${pageUnit};`
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
  let { value, src, placeholder, dataList } = child.staticData
  let childHtml = ''
  let common = `class="${cClass}"` // 公共标签 id="${child.id}"
  switch (label) {
    case 'button':
      childHtml = `<${label} ${common}>${value}</${label}>`
      break
    case 'img':
      childHtml = `<${label} ${common} src="${src}"/>`
      break
    case 'p':
      childHtml = `<${label} ${common}>${value}</${label}>`
      break
    case 'input':
      childHtml = `<${label} ${common} placeholder="${placeholder}"/>`
      break
    // case 'grid':
    //   childHtml = `<div ${common}>

    //   </div>`
    //   break
    default:
      break
  }
  return childHtml
}


/**
 * 下载代码文件
 */
function downFile(text: string, downName) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = downName
  document.documentElement.appendChild(a)
  a.click()
  document.documentElement.removeChild(a)
}

export { jsonToVue }
