## 时间复杂度

通常使用最差的时间复杂度来衡量一个算法的好坏

对于一个算法来说，可能会计算出操作次数为 aN + 1，N 代表数据量。那么该算法的时间复杂度就是 O(N)。因为我们在计算时间复杂度的时候，数据量通常是非常大的，这时候低阶项和常数项可以忽略不计

当然可能会出现两个算法都是 O(N) 的时间复杂度，那么对比两个算法的好坏就要通过对比低阶项和常数项了

## 栈

栈是一个线性结构，在计算机中是一个相当常见的数据结构。

栈的特点是只能在某一端添加或删除数据，遵循**先进后出**的原则

应用：Vue 中关于模板解析的代码，就有应用到匹配尖括号的内容

```js
class Stack {
  constructor() {
    this.items = []
  }

  // 入栈
  push(element) {
    this.items.push(element)
  }

  // 出栈
  pop() {
    return this.items.pop()
  }

  // 末位
  get peek() {
    return this.items[this.items.length - 1]
  }

  // 是否为空栈
  get isEmpty() {
    return !this.items.length
  }

  // 长度
  get size() {
    return this.items.length
  }

  // 清空栈
  clear() {
    this.items = []
  }
}

// 实例化一个栈
const stack = new Stack()
console.log(stack.isEmpty) // true

// 添加元素
stack.push(5)
stack.push(8)

// 读取属性再添加
console.log(stack.peek) // 8
stack.push(11)
console.log(stack.size) // 3
console.log(stack.isEmpty) // false
```

## 队列

队列是一个线性结构，特点是在某一端添加数据，在另一端删除数据，遵循**先进先出**的原则

```js
class Queue {
  constructor(items) {
    this.items = items || []
  }

  // 入队
  enqueue(element) {
    this.items.push(element)
  }

  // 出队
  dequeue() {
    return this.items.shift()
  }

  // 返回队列第一个元素
  front() { 
    return this.items[0]
  }

  // 清空队列
  clear() { 
    this.items = []
  }

  // 返回队列长度
  get size() { 
    return this.items.length
  }

  // 判断队列是否为空
  get isEmpty() { 
    return !this.items.length
  }

  // 打印队列
  print() { 
    console.log(this.items.toString())
  }
}

const queue = new Queue()
console.log(queue.isEmpty) // true

queue.enqueue('John')
queue.enqueue('Jack')
queue.enqueue('Jason')
console.log(queue.size) // 3
console.log(queue.isEmpty) // false
queue.dequeue()
queue.dequeue()
```

## 链表

链表是一个线性结构，同时也是一个天然的递归结构。

链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了结点的指针域，空间开销比较大

由于其非连续内存的特性导致链表非常适用于频繁插入、删除的场景，而不见长于读取场景

- 单向链表：
  单向链表的节点通常由两个部分构成,一个是节点储存的值 val,另一个就是节点的指针 next
- 双向链表：
  双向链表多了一个新的指针 prev 指向节点的前一个节点,当然由于多了一个指针,所以双向链表要更占内存
- 循环链表：
  将单向链表的尾部指针指向了链表头节点

### 反转单向链表

思路：使用三个变量分别表示当前节点和当前节点的前后节点

```js
function reverseList(head) {
  if (!head || !head.next) return head // 如果链表为空或只有一个节点，直接返回
  // 初始设置为空，因为第一个节点反转后就是尾部，尾部节点指向 null
  let prev = null
  let current = head
  let next = null
  // 判断当前节点是否为空
  // 不为空就先获取当前节点的下一节点
  // 然后把当前节点的 next 设为上一个节点
  // 然后把  current 设为下一个节点，prev设为当前节点
  while (current) {
    next = current.next
    current.next = prev
    prev = current
    current = next
  }
  return prev
}
```

## 堆

堆通常是一个可以被看做一棵树的数组对象。

堆的实现通过构造二叉堆，实为二叉树的一种。这种数据结构具有以下性质。

- 任意节点小于（或大于）它的所有子节点
- 堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层从左到右填入。
  将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆

## 树

- 二叉树
  二叉树是树中最常用的结构，同时也是一个天然的递归结构。

二叉树拥有一个根节点，每个节点至多拥有两个子节点，分别为：左节点和右节点。树的最底部节点称之为叶节点，当一颗树的叶数量数量为满时，该树可以称之为满二叉树

- 二分搜索树
  也是二叉树，拥有二叉树的特性。但是区别在于二分搜索树每个节点的值都比他的左子树的值大，比右子树的值小

- 二分搜索算法：
  - 计算数组中间点的位置，取到中间点的值
  - 根据中间点的值与查找值的大小关系，确定往数组的左半部分或者右半部分查找
  - 重复上面两步，直到查找到所需的值，或者查找完整个数组， 确认值不存在

### 遍历树

- 二叉树的先序，中序，后序遍历
  - 先序遍历：根节点->左子树->右子树
  - 中序遍历：左子树->根节点->右子树
  - 后序遍历：左子树->右子树->根节点

#### 递归

```js
// 递归遍历树
function treeNode(val) {
  this.val = val
  this.left = null
  this.right = null
}
function traversal(root) {
  if (!root) return
  // 先序
  console.log(root.val)
  traversal(root.left)
  // 中序
  // console.log(root)
  traversal(root.right)
  // 后序
  // console.log(root)
}
```

#### 非递归

非递归实现使用了栈的结构，通过栈的先进后出模拟递归实现

- 先序

思路：初始化一个栈和结果数组，将根节点放入栈中，当栈不为空时，重复下面的步骤：

1. 取出栈顶元素 top，访问 top
2. 若 top 的右子节点不为空，将 top 的右子节点放入栈中
3. 若 top 的左子节点不为空，将 top 的左子节点放入栈中
4. 将取出的栈顶元素 top 放入结果数组

```js
function preOrder(root) {
  if (!root) return []
  let stack = []
  let result = []
  stack.push(root) // 先将根节点放入栈中
  while (stack.length) {
    // 判断栈中是否为空
    root = stack.pop() // 取出栈顶元素
    console.log(root) // 访问根节点
    result.push(top.val)
    // 因为先序遍历是先左后右，栈是先进后出结构
    // 所以先 push 右边再 push 左边
    if (root.right) {
      stack.push(root.right)
    }
    if (root.left) {
      stack.push(root.left)
    }
  }
  return result
}
```

- 中序

思路：初始化一个栈和结果数组，将根节点放入栈中，当栈不为空时，重复下面的步骤：

1. 将根节点和所有的左子节点放入栈中，直到没有左子节点
2. 栈顶元素出栈，存入结果数组，将出栈的元素作为根节点
3. 查看该根节点右子节点是否有左子节点，若有就入栈，否则继续出栈

```js
function inOrder(root) {
  if (!root) return []
  let stack = []
  let result = []
  while (stack.length || root) {
    if (root) {
      stack.push(root)
      root = root.left
    } else {
      root = stack.pop()
      console.log(root)
      result.push(root)
      root = root.right
    }
  }
  return result
}
```

- 后序

思路：初始化一个栈和结果数组，将根节点放入栈中，当栈不为空时，重复下面的步骤：

1. 取出栈顶元素 top，访问 top
2. 将取出的栈顶元素 top 放入结果数组的最开始
3. 若 top 的左子节点不为空，将 top 的左子节点放入栈中
4. 若 top 的右子节点不为空，将 top 的右子节点放入栈中

```js
function postOrder(root) {
  if (!root) return []
  let stack = []
  let result = []
  stack.push(root)
  while (stack.length) {
    root = stack.pop()
    result.push(root)
    if (root.left) {
      stack.push(root.left)
    }
    if (root.right) {
      stack.push(root.right)
    }
  }
  return result
}
```

### 深度优先

> 深度优先遍历（Depth-First-Search），DFS 就是从一个节点开始追溯，直到最后一个节点，然后回溯，继续追溯下一条路径，直到到达所有的节点，如此往复，直到没有路径为止。

DFS 可以产生相应图的拓扑排序表，利用拓扑排序表可以解决很多问题，例如最大路径问题。一般用堆数据结构来辅助实现 DFS 算法。

- 步骤：
  1. 访问顶点 v
  2. 依次从 v 的未被访问的邻接点出发，对图进行深度优先遍历；直至图中和 v 有路径相通的顶点都被访问
  3. 若此时途中尚有顶点未被访问，则从一个未被访问的顶点出发，重新进行深度优先遍历，直到所有顶点均被访问过为止

### 广度优先

> 广度优先遍历（Breadth-First-Search）是从根节点开始，沿着图的宽度遍历节点，如果所有节点均被访问过，则算法终止，BFS 同样属于盲目搜索，一般用队列数据结构来辅助实现 BFS

BFS 从一个节点开始，尝试访问尽可能靠近它的目标节点。本质上这种遍历在图上是逐层移动的，首先检查最靠近第一个节点的层，再逐渐向下移动到离起始节点最远的层

- 步骤：
  1. 创建一个队列，并将开始节点放入队列中
  2. 若队列非空，则从队列中取出第一个节点，并检测它是否为目标节点
  3. 若是目标节点，则结束搜寻，并返回结果
  4. 若不是，则将它所有没有被检测过的字节点都加入队列中
  5. 若队列为空，表示图中并没有目标节点，则结束遍历

### 获取树深度

递归函数理解：一旦没有找到节点就会返回 0，每弹出一次递归函数就会加一，树有三层就会得到 3

```js
function getDepth(root) {
  if (!root) return 0
  return Math.max(getDepth(root.left), getDepth(root.right)) + 1
}
```

## 动态规划

本质：

1. 自底向上分解子问题：将一个问题拆分为子问题，一般来说这些子问题都是非常相似的，那么我们可以通过只解决一次每个子问题来达到减少计算量的目的。
2. 通过变量存储已经计算过的解：一旦得出每个子问题的解，就存储该结果以便下次使用

### 非波拉契数列

- 递归

```js
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}
```

- 动态规划
  - 思路：
    1. 斐波那契数列从 0 和 1 开始，那么这就是这个子问题的最底层
    2. 通过数组来存储每一位所对应的斐波那契数列的值

```js
function fib(n) {
  if (n <= 1) return n
  let arr = [0, 1]
  for (let i = 2; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2]
  }
  return arr[n]
}
```

### 最长公共子串

### 背包问题

## 贪心算法

贪心算法总是会选择当下最优解，通过一系列最优选择带来整体的最优选择。

### 找零问题

> 假设货币面额有 1,2,5,10,20,50,100，每种数量都无限多，现在给出金额 n(1<=n<=100000)，求出最少的货币数量。

```js
// 找零问题
function coinChange(n) {
  //首先尝试最大面额找零，之后尝试次大面额找零，直到完全找零
  let coins = []
  if (n % 100 < n) {
    coins.push(parseInt(n / 100))
    n %= 100
  }
  if (n % 50 < n) {
    coins.push(parseInt(n / 50))
    n %= 50
  }
  if (n % 20 < n) {
    coins.push(parseInt(n / 20))
    n %= 20
  }
  if (n % 10 < n) {
    coins.push(parseInt(n / 10))
    n %= 10
  }
  if (n % 5 < n) {
    coins.push(parseInt(n / 5))
    n %= 5
  }
  if (n % 2 < n) {
    coins.push(parseInt(n / 2))
    n %= 2
  }
  if (n % 1 < n) {
    coins.push(n / 1)
  }
  return coins
}
```

## 排序算法

> V8 的 `Array.sort()` ：当 n<=10 时, 采用插入排序, 当 n>10 时，采用三路快排的排序策略

### 冒泡排序

- 冒泡排序思想：让数组中的当前项和后一项比较，如果当前项比后一项大，则交换位置

- 优化：增加一个 flag，判断排序是否在中途就已经完成

```js
function bubble(array) {
  let flag = true
  for (let i = 0; i < array.length; i++) {
    if (!flag) break
    flag = false
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
        flag = true
      }
    }
  }
  return array
}
```

该算法的操作次数是一个等差数列 n + (n - 1) + (n - 2) + 1 ，去掉常数项以后得出时间复杂度是 O(n \* n)

### 插入排序

插入排序思想：

- 创建一个新数组用来存放插入的内容
- 每次插入和新数组中每一项比较如果比某一项小就放在这一项前面

### 快速排序

快速排序思路：

- 每次找到一个基准值，把值从数组中拿出
- 把数组剩下的元素按照基准值大小放入左右两个数组中
- 用递归的方法把左右两个数组继续按照当前逻辑遍历下去
- 返回 左边数组+基准值+右边数组

优化：大量重复数据时采用三路快排，增加与基准值相等区域

### 选择排序

原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕

表现最稳定的排序算法之一，无论什么数据进去都是 O(n²)的时间复杂度

### 归并排序

归并排序和快排的思路类似，都是递归分治，区别在于快排边分区边排序，而归并在分区完成后才会排序，递归的将数组两两分开直到最多包含两个元素，然后将数组排序合并，最终合并为排序好的数组

表达式 2T(N / 2) + T(N) （T 代表时间，N 代表数据量）。根据该表达式可以套用 该公式 得出时间复杂度为 O(N \* logN)

### 堆排序

堆是一棵特殊的树, 只要满足这棵树是完全二叉树和堆中每一个节点的值都大于或小于其左右孩子节点这两个条件, 那么就是一个堆, 根据堆中每一个节点的值都大于或小于其左右孩子节点, 又分为大根堆和小根堆

1. 初始化大(小)根堆，此时根节点为最大(小)值，将根节点与最后一个节点(数组最后一个元素)交换
2. 除开最后一个节点，重新调整大(小)根堆，使根节点为最大(小)值
3. 重复步骤二，直到堆中元素剩一个，排序完成

该算法的复杂度是 O(logN)

### 希尔排序

核心：在于间隔序列的设定。既可以提前设定好间隔序列，也可以动态的定义间隔序列。

第一个突破 O(n^2)的排序算法；是简单插入排序的改进版；它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序

### 计数排序

核心：将输入的数据值转化为键存储在额外开辟的数组空间中。 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

思路：使用一个额外的数组 C，其中第 i 个元素是待排序数组 A 中值等于 i 的元素的个数。然后根据数组 C 来将 A 中的元素排到正确的位置。它只能对整数进行排序。

### 桶排序

计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排

### 基数排序

思路：是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。基数排序基于分别排序，分别收集，所以是稳定的
