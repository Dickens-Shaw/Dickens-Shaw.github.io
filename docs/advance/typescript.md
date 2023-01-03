# TS

## 特点

> 拥有类型系统的 javascript 超集

- 类型检查
  TypeScript 在编译代码时进行严格的静态类型检查。这就意味着在编码阶段可能存在的隐患，不必把它们带到线上。
- 语言扩展
  TypeScript 会包括 ES6 和未来提案中的特性，比如异步操作和装饰器。也会从其他语言借鉴某些特点，比如接口和抽象类。
- 工具属性
  TypeScript 可以编译成标准的 Javascript。可以在任何浏览器和操作系统上运行。无需任何运行时额外开销。从这个角度讲 TypeScript 更像时一个工具。

## 使用

- 接口定义代替文档
- IDE 提高开发效率，降低维护成本
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

```ts
interface example {
  name: string;
  age: number;
}
interface exampleFunc {
  (name: string, age: number): void;
}

type example = {
  name: string;
  age: number;
};
type example = (name: string, age: number) => void;
```

2. 支持 **继承**，并且不是独立的，而是可以 **互相** 继承，只是具体的形式稍有差别

```ts
type exampleType1 = {
  name: string;
};
interface exampleInterface1 {
  name: string;
}

type exampleType2 = exampleType1 & {
  age: number;
};
type exampleType2 = exampleInterface1 & {
  age: number;
};
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

  - type 可以定义 基本类型的别名，如 type myString = string
  - type 可以通过 typeof 操作符来定义，如 type myType = typeof someObj
  - type 可以申明 联合类型，如 type unionType = myType1 | myType2
  - type 可以申明 元组类型，如 type yuanzu = [myType1, myType2]

- interface

```ts
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

这种情况下，如果是 type 的话，就会是 覆盖 的效果，始终只有最后一个 type 生效

很可能忽略一个点：type 只是一个类型别名，并不会产生类型。所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似

## 函数重载

函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

要解决前面遇到的问题，方法就是为同一个函数提供多个函数类型定义来进行函数重载，编译器会根据这个列表去处理函数的调用。

## const 和 readonly 的区别：

- const 是一个编译期常量， readonly 是一个运行时常量
- const 只能声明基元类型，枚举类型，字符串类型。readonly 则无限制
- const 天生为静态数据，无需再添加 static 标识
- readonly 是运行时变量，只能赋值一次。特例是可以定义时赋值一次，构造函数中再赋值一次

## 枚举和常量枚举的区别：

- 常量枚举通过在枚举上使用 const 修饰符来定义，常量枚举不同于常规的枚举，他们会在编译阶段被删除。
- 常量枚举成员在使用的地方会被内联进来，之所以可以这么做是因为，常量枚举不允许包含计算成员
- 常量枚举会带来一个对性能的提升。

## TypeScript 中 any、never、unknown 和 void 的区别

- any 顾名思义就是任意类型。
- never 表示永不存在的值的类型。
- unknown 表示未知类型，即写代码的时候还不清楚会得到怎样的数据类型，它能被赋值为任何类型，但不能被赋值给除了 any 和 unknown 之外的其他类型，同时，不允许执行 unknown 类型变量的方法（any 可以）。
- void 表示无任何类型，正好与 any 相反，没有类型，如果是函数则应没有返回值或者返回 undefined

## interface 能否声明 Function / Array / Class（Indexable）

- interface 能够描述 JavaScript 对象的任何形式，包括函数。
- interface 也可以被 class 类 implements，这里相当于声明了一个 interface 包含了各种属性，需要 class 去实现，注意给类本身声明类型，其实就是给构造器进行类型声明，不能添加其他属性。、

## 联合类型

表示取值可以为多种类型中的一种，当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法（交集）

## TypeScript 模块的加载机制

TypeScript 的模块机制与 es6 的模块基本类似，也提供了转换为 amd，es6，umd，commonjs，system 的转换。

typescript 的按需加载，也叫动态加载，编译器会检测是否每个模块都会在生成的 JavaScript 中用到。 如果一个模块标识符只在类型注解部分使用，并且完全没有在表达式中使用时，就不会生成 require 这个模块的代码。 省略掉没有用到的引用对性能提升是很有益的，并同时提供了选择性加载模块的能力。这种模式的核心是`import id = require("...")`语句可以让我们访问模块导出的类型。 模块加载器会被动态调用（通过 require）。

模块加载的最佳实践

1. 尽可能地在顶层导出

用户应该更容易地使用你模块导出的内容。 嵌套层次过多会变得难以处理，因此仔细考虑一下如何组织你的代码。

2. 模块里避免使用命名空间

模块中使用命名空间是不必要的，在模块中导出的东西肯定不能重名，而导入时使用者肯定会为其命名或者直接使用，也不存在重名，使用命名空间是多余的。

3. 如果仅导出单个  class  或  function，使用  export default。如刚才所说，default 是比较好的实践。
4. 如果要导出多个对象，把它们放在顶层里导出
5. 导入时明确地列出导入的名字
6. 导入大量模块时使用命名空间
7. 使用重新导出进行扩展

## TypeScript 类型兼容性

TypeScript 里的类型兼容性是基于结构子类型的。 结构类型是一种只使用其成员来描述类型的方式。 它正好与名）类型形成对比。TypeScript 的结构性子类型是根据 JavaScript 代码的典型写法来设计的。 因为 JavaScript 里广泛地使用匿名对象，例如函数表达式和对象字面量，所以使用结构类型系统来描述这些类型比使用名义类型系统更好。

## 抗变、双变、协变和逆变

- 协变 (Covariant) ：协变表示 Comp`<T>`类型兼容和 T 的一致。
- 逆变 (Contravariant) ：逆变表示 Comp`<T>`类型兼容和 T 相反。
- 双向协变 (Covariant) ：双向协变表示 Comp`<T>`类型双向兼容。
- 不变 (Bivariant) ：不变表示 Comp`<T>`双向都不兼容

## TypeScript 中对象展开会有什么副作用吗？

展开操作符正与解构相反。 它允许你将一个数组展开为另一个数组，或将一个对象展开为另一个对象。

对象的展开比数组的展开要复杂的多。 像数组展开一样，它是从左至右进行处理，但结果仍为对象。 这就意味着出现在展开对象后面的属性会覆盖前面的属性。

对象展开还有其它一些意想不到的限制。 首先，它仅包含对象   自身的可枚举属性。 大体上是说当你展开一个对象实例时，你会丢失其方法.

## interface、type、enum 声明有作用域的功能吗

有，叫类作用域，类变量 也可以称为 字段。类变量 声明在一个类里头，但在类的方法外面，可以通过类的实例化对象来访问。静态变量 静态的类变量，静态的变量可以通过类名直接访问

## tsconfig.json 配置项信息

```json
{
  "files": [
    // 指定需要编译文件，相对配置文件所在
    "***.ts",
    "***.tsx",
    "***.d.ts"
  ],
  "exclude": [
    // 指定不需要编译文件
    "node_modules",
    "**/*.d.ts"
  ],
  "include": [
    // 指定需要编译文件; 不配置files,include，默认除了exclude的所有.ts,.d.ts,.tsx
    "src/**/*"
  ],
  // 指定基础配置文件路径 大部分配置 compilerOptions, files, include, and exclude。切忌循环引用。
  "extends": "./configs/base",
  "compilerOptions": {
    // 告知TypeScript 编译器怎么编译
    "baseUrl": "./",
    "paths": {
      // 相对于baseUrl配置, 模块导入的路径别名
      "jquery": ["node_modules/jquery/dist/jquery"],
      "*": ["*", "generated/*"]
    },
    "rootDirs": [
      // 找平路径配置依赖
      "src/views",
      "generated/templates/views"
    ],
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true, // 移除代码注解
    "preserveConstEnums": true,
    "sourceMap": true,
    "types": [], // 不会自动导入@types定义的包
    "noResolve": true, // 不会自动导入import 依赖, 编译会报错
    "downlevelIteration": true, // 进行js 语法降级 for..of
    "module": "esnext",
    "moduleResolution": "node",
    "strictNullChecks": true, // 开启null，检测
    "target": "ES5",
    "strictBindCallApply": true,
    "skipLibCheck": true
  },
  // 以上属性，为常用配置属性
  "compileOnSave": false, // 整个工程而言，需要编译器支持，譬如Visual Studio 2015 with TypeScript 1.8.4+
  "typeAcquisition": {
    // 整个工程的类型定义.d.ts
    "enable": false, // 默认值 false
    "include": ["jquery", "lodash"],
    "exclude": ["jquery", "lodash"]
  },
  "references": [
    {
      // 引用的工程
      "path": "xxxx"
    }
  ]
}
```
