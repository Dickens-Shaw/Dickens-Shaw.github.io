---

layout: home
layoutClass: 'm-home-layout'

hero:
  name: 文档
  text: Frontend
  tagline: 💪
  image:
    src: /logo.jpeg
    alt: Shaw
  actions:
    - text: Start
      link: /basic/html

features:
  - title: 基础
    details: css/js/es6+/异步编程/事件循环
    link: /basic/html
    linkText: 前端基础
  - title: 进阶
    details: 浏览器/网络/TS/设计模式/数据结构&算法
    link: /advance/browser
    linkText: 前端进阶
  - title: 框架
    details: MVVM/React/Vue
    link: /frame/react
    linkText: 前端框架
  - title: 架构
    details: 项目优化/工程化/微前端/大前端/低代码
    link: /architecture/optimize
    linkText: 前端架构
footer: Shaw always work hard
---

<script>
  console.log('window------', window)
  console.log('ethereum------', window.ethereum)
  console.log('userAgent------', navigator.userAgent)
  console.log('vendor------', navigator.vendor)
</script>

<style lang="scss">
  .VPImage{
    border-radius: 50%;
  }

  .VPFeature.link{
    &:link,
    &:visited{
      color: var(--vp-c-brand);

      .title{
        color: var(--vp-c-brand);
      }

      &:hover{
        border: 1px solid var(--vp-c-brand);
      }
    }
  }
</style>