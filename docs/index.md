---

layout: home
layoutClass: 'm-home-layout'

hero:
  name: 文档
  text: 前端6
  tagline: 💪
  # image:
  #   src: /logo.jpeg
  #   alt: Shaw
  actions:
    - text: Start
      link: /basic/html

features:
  - title: 基础
    details: css/js/es6+/异步编程/事件循环
  - title: 进阶
    details: 浏览器/网络/TS/设计模式/数据结构&算法
  - title: 框架
    details: MVVM/React/Vue
  - title: 架构
    details: 项目优化/工程化/微前端/大前端/低代码
footer: Shaw always work hard
---

<style>
/*爱的魔力转圈圈*/
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .item:last-child .details {
  display: flex;
  justify-content: flex-end;
  align-items: end;
}
</style>