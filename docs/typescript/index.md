## 特点

> 拥有类型系统的javascript超集

- 类型检查
  TypeScript 在编译代码时进行严格的静态类型检查。这就意味着在编码阶段可能存在的隐患，不必把它们带到线上。
- 语言扩展
  TypeScript 会包括 ES6 和未来提案中的特性，比如异步操作和装饰器。也会从其他语言借鉴某些特点，比如接口和抽象类。
- 工具属性
  TypeScript 可以编译成标准的 Javascript。可以在任何浏览器和操作系统上运行。无需任何运行时额外开销。从这个角度讲 TypeScript 更像时一个工具。

## 便利
- 接口定义代替文档
- IDE提高开发效率，降低维护成本
- 重塑`类型思维`

## 原始数据类型

原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol 和 BigInt。

## 类型声明文件怎么写的

如果我们想在 TypeScript 中使用第三方类库如 jQuery、lodash 等，需要提供这些类库的声明文件（以.d.ts 结尾），对外暴露 API。

一般我们通过安装第三方类库的类型声明包后，即可在 TypeScript 中使用。以 jQuery 为例：

`npm install -D jquery @types/jquery`

## 泛型

> 泛型是为了提高代码的重用性和代码的通用性
>
> 设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：类的实例成员、类的方法、函数参数和函数返回值。
>
> 泛型（Generics）是允许同一个函数接受不同类型参数的一种模板。相比于使用 any，使用泛型来创建可复用的组件要更好，因为泛型会保留参数。

- 使用
  泛型其实是将一种或者多种类型提升，并且用一个自定义的标识符用来表示，比如现在要提升一个函数的参数类型，该参数类型可以是任意值，并且返回的是与其一样的类型

- 将泛型当作变量
  比如现在有一个返回该类型的一个数组，则泛型应该表示该数组所有元素的类型

- 泛型也是一个类型
  泛型也是一种类型，泛型本身也可以有接口和类

  泛型接口，就是对一类泛型的提升，比如刚刚的传入和传出值相同时场景，泛型用来表示传入和传出值的任意类型

  就能把这种抽象为一种泛型接口

- 泛型类

泛型既然也是一种类型，那也可以创建泛型类

- 泛型继承接口，实现泛型的约束

例如现在要实现一个通用类型（有 length 方法的所有）的函数，打印其的 length 值并返回其本身，由于不知道其参数类型，可以指定其为泛型

## 工具类

- Typeof：用来获取一个变量声明或对象的类型
- Keyof：用于获取某种类型的所有键，其返回类型是联合类型
- In：用来遍历枚举类型
- Infer：在条件类型语句中，可以用 infer 声明一个类型变量并且对它进行使用
- Extends：有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束

## type 和 interface 的区别

> 优先选择 interface

### 相同点

1. 对 **接口定义** 的两种不同形式，目的都是一样的，都是用来定义 **对象** 或者 **函数** 的形状

```js
    interface example {
        name: string
        age: number
    }
    interface exampleFunc {
        (name:string,age:number): void
    }


    type example = {
        name: string
        age: number
    }
    type example = (name:string,age:number) => void
```

2. 支持 **继承**，并且不是独立的，而是可以 **互相** 继承，只是具体的形式稍有差别

```js
type exampleType1 = {
  name: string,
}
interface exampleInterface1 {
  name: string;
}

type exampleType2 = exampleType1 & {
  age: number,
}
type exampleType2 = exampleInterface1 & {
  age: number,
}
interface exampleInterface2 extends exampleType1 {
  age: number;
}
interface exampleInterface2 extends exampleInterface1 {
  age: number;
}
```

对于 interface 来说，继承是通过 extends 实现的，而 type 的话是通过 & 来实现的，也可以叫做 交叉类型

### 不同点

- type

  - type可以定义 基本类型的别名，如 type myString = string
  - type可以通过 typeof 操作符来定义，如 type myType = typeof someObj
  - type可以申明 联合类型，如 type unionType = myType1 | myType2
  - type可以申明 元组类型，如 type yuanzu = [myType1, myType2]

- interface

```js
  interface可以 声明合并，示例如下
    interface test {
        name: string
    }
    interface test {
        age: number
    }
    /*
        test实际为 {
            name: string
            age: number
        }
    */
```
这种情况下，如果是type的话，就会是 覆盖 的效果，始终只有最后一个type生效

很可能忽略一个点：type 只是一个类型别名，并不会产生类型。所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似

## 函数重载

函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

要解决前面遇到的问题，方法就是为同一个函数提供多个函数类型定义来进行函数重载，编译器会根据这个列表去处理函数的调用。
