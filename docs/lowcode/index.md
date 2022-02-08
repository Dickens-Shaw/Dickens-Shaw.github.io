## JSON Schema

JSON Schema 本身就是一种数据结构，可以清晰的描述 JSON 数据的结构。是一种描述 JSON 数据的 JSON 数据。

## Amis

Schema，即组件的 JSON 配置

amis 的渲染过程是将 json 转成对应的 React 组件。先通过 json 的 type 找到对应的 Component 然后，然后把其他属性作为 props 传递过去完成渲染。

一个节点要被什么组件渲染，还需要携带上下文（context）信息，amis 中是用节点的路径（path）来作为上下文信息

根据 path 的信息就能很容易注册组件跟节点对应了

渲染过程就是根据节点 path 信息，跟组件池中的组件 test (检测) 信息做匹配，如果命中，则把当前节点转给对应组件渲染，节点中其他属性将作为目标组件的 props
（数据域、数据链、模板、数据映射、表达式、联动）

## vue-form-making

提供 表单设计器（MakingForm）和表单生成器（GenerateForm）两个组件，通过表单设计器快速设计出表单页面，生成可配置 json 和可直接运行的代码，使用表单生成器快速渲染出表单页面
里面所有的组件渲染都是 v-if 判断 type 来写的，我们的技术预演就是基于它使用 vue3+tsx 来完成的重构，使用 component：is 来完成组件渲染
