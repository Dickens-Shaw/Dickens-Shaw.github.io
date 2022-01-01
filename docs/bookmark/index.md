# 收藏夹

> 开始时间：2021-12-16

- Chrome 浏览器导出收藏夹转 Markdown

```js
// 获取根节点
const root = document.getElementsByTagName('dl')[0]
// 将真实DOM转化为虚拟DOM
let markdownText = ''
function createVirtualDOM(root) {
  const virtualDOM = []
  const children = root.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const node = {
      tag: child.tagName,
      attrs: {},
      children: [],
    }
    // 标题(文件夹)
    if (child.tagName === 'H3') {
      markdownText += `
## ${child.innerText}
`
    }
    // 链接
    if (child.tagName === 'A') {
      markdownText += `
  - [${child.innerText}](${child.href})☑️
`
    }
    if (child.attributes) {
      for (let j = 0; j < child.attributes.length; j++) {
        const attr = child.attributes[j]
        node.attrs[attr.name] = attr.value
      }
    }
    if (child.children) {
      node.children = createVirtualDOM(child)
    }
    virtualDOM.push(node)
  }
  return virtualDOM
}
const vDom = createVirtualDOM(root)
console.log(vDom)
console.log(markdownText)
```

- 掘金收藏夹转 Markdown

```js
// 获取所有Tag
const allTags = [
  ...new Set(
    [...document.querySelectorAll('.tag')].map((item) => item.innerText.trim())
  ),
]

// 获取所有文章
const listArray = [...document.querySelector('.entry-list').children]
let markDownText = ''

allTags.forEach((item) => {
  // 根据标签分类
  markDownText += `
## ${item}
`
  listArray.forEach((listItem) => {
    // 渲染文章列表
    const title = listItem.querySelector('.title').innerText // 标题
    const href =
      'https://juejin.cn/post/' +
      listItem.querySelector('.entry').getAttribute('data-entry-id') // 链接
    let tags = [...listItem.querySelector('.tag_list').children].map((tag) =>
      tag.innerText.trim()
    ) // 标签
    if (tags.length > 1)
      tags = tags.filter((tag) => tag !== '前端' && tag !== 'JavaScript') // 多标签情况过滤前端和JavaScript
    if (tags.includes(item)) {
      markDownText += `
  - [[${tags}]${title}](${href})☑️
`
    }
  })
})
console.log(markDownText)
```
