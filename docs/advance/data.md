# 数据结构

## 栈

栈是一个线性结构`（有且仅有一个前驱、有且仅有一个后继）`，在计算机中是一个相当常见的数据结构。

栈的特点是只能在某一端添加或删除数据，遵循**先进后出**的原则

应用：Vue 中关于模板解析的代码，就有应用到匹配尖括号的内容

```js
class Stack {
  constructor() {
    this.items = [];
  }

  // 入栈
  push(element) {
    this.items.push(element);
  }

  // 出栈
  pop() {
    return this.items.pop();
  }

  // 末位
  get peek() {
    return this.items[this.items.length - 1];
  }

  // 是否为空栈
  get isEmpty() {
    return !this.items.length;
  }

  // 长度
  get size() {
    return this.items.length;
  }

  // 清空栈
  clear() {
    this.items = [];
  }
}

// 实例化一个栈
const stack = new Stack();
console.log(stack.isEmpty); // true

// 添加元素
stack.push(5);
stack.push(8);

// 读取属性再添加
console.log(stack.peek); // 8
stack.push(11);
console.log(stack.size); // 3
console.log(stack.isEmpty); // false
```

## 队列

队列是一个线性结构，特点是在某一端添加数据，在另一端删除数据，遵循**先进先出**的原则

```js
class Queue {
  constructor(items) {
    this.items = items || [];
  }

  // 入队
  enqueue(element) {
    this.items.push(element);
  }

  // 出队
  dequeue() {
    return this.items.shift();
  }

  // 返回队列第一个元素
  front() {
    return this.items[0];
  }

  // 清空队列
  clear() {
    this.items = [];
  }

  // 返回队列长度
  get size() {
    return this.items.length;
  }

  // 判断队列是否为空
  get isEmpty() {
    return !this.items.length;
  }

  // 打印队列
  print() {
    console.log(this.items.toString());
  }
}

const queue = new Queue();
console.log(queue.isEmpty); // true

queue.enqueue('John');
queue.enqueue('Jack');
queue.enqueue('Jason');
console.log(queue.size); // 3
console.log(queue.isEmpty); // false
queue.dequeue();
queue.dequeue();
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

```js
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

// 链表
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  // 追加元素
  append(element) {
    const node = new Node(element);
    let current = null;
    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
  }

  // 任意位置插入元素
  insert(position, element) {
    if (position >= 0 && position <= this.length) {
      const node = new Node(element);
      let current = this.head;
      let previous = null;
      let index = 0;
      if (position === 0) {
        this.head = node;
        node.next = current;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        node.next = current;
        previous.next = node;
      }
      this.length++;
      return true;
    }
    return false;
  }

  // 移除指定位置元素
  removeAt(position) {
    // 检查越界值
    if (position > -1 && position < this.length) {
      let current = this.head;
      let previous = null;
      let index = 0;
      if (position === 0) {
        this.head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      this.length--;
      return current.element;
    }
    return null;
  }

  // 寻找元素下标
  findIndex(element) {
    let current = this.head;
    let index = -1;
    while (current) {
      if (element === current.element) {
        return index + 1;
      }
      index++;
      current = current.next;
    }
    return -1;
  }

  // 删除指定文档
  remove(element) {
    const index = this.findIndex(element);
    return this.removeAt(index);
  }

  isEmpty() {
    return !this.length;
  }

  size() {
    return this.length;
  }

  // 转为字符串
  toString() {
    let current = this.head;
    let string = '';
    while (current) {
      string += ` ${current.element}`;
      current = current.next;
    }
    return string;
  }
}
const linkedList = new LinkedList();

console.log(linkedList);
linkedList.append(2);
linkedList.append(6);
linkedList.append(24);
linkedList.append(152);

linkedList.insert(3, 18);
console.log(linkedList);
console.log(linkedList.findIndex(24));
```

### 反转单向链表

思路：使用三个变量分别表示当前节点和当前节点的前后节点

```js
function reverseList(head) {
  if (!head || !head.next) return head; // 如果链表为空或只有一个节点，直接返回
  // 初始设置为空，因为第一个节点反转后就是尾部，尾部节点指向 null
  let prev = null;
  let current = head;
  let next = null;
  // 判断当前节点是否为空
  // 不为空就先获取当前节点的下一节点
  // 然后把当前节点的 next 设为上一个节点
  // 然后把  current 设为下一个节点，prev设为当前节点
  while (current) {
    next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
```

## 字典

字典：类似对象，以 key，value 存贮值

```js
class Dictionary {
  constructor() {
    this.items = {};
  }
  set(key, value) {
    this.items[key] = value;
  }

  get(key) {
    return this.items[key];
  }

  remove(key) {
    delete this.items[key];
  }

  get keys() {
    return Object.keys(this.items);
  }

  get values() {
    /*
    也可以使用ES7中的values方法
    return Object.values(this.items)
    */

    // 在这里我们通过循环生成一个数组并输出
    return Object.keys(this.items).reduce((r, c, i) => {
      r.push(this.items[c]);
      return r;
    }, []);
  }
}
const dictionary = new Dictionary();
dictionary.set('Gandalf', 'gandalf@email.com');
dictionary.set('John', 'johnsnow@email.com');
dictionary.set('Tyrion', 'tyrion@email.com');

console.log(dictionary);
console.log(dictionary.keys);
console.log(dictionary.values);
console.log(dictionary.items);
```

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
  this.val = val;
  this.left = null;
  this.right = null;
}
function traversal(root) {
  if (!root) return;
  // 先序
  console.log(root.val);
  traversal(root.left);
  // 中序
  // console.log(root)
  traversal(root.right);
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
  if (!root) return [];
  let stack = [];
  let result = [];
  stack.push(root); // 先将根节点放入栈中
  while (stack.length) {
    // 判断栈中是否为空
    root = stack.pop(); // 取出栈顶元素
    console.log(root); // 访问根节点
    result.push(top.val);
    // 因为先序遍历是先左后右，栈是先进后出结构
    // 所以先 push 右边再 push 左边
    if (root.right) {
      stack.push(root.right);
    }
    if (root.left) {
      stack.push(root.left);
    }
  }
  return result;
}
```

- 中序

思路：初始化一个栈和结果数组，将根节点放入栈中，当栈不为空时，重复下面的步骤：

1. 将根节点和所有的左子节点放入栈中，直到没有左子节点
2. 栈顶元素出栈，存入结果数组，将出栈的元素作为根节点
3. 查看该根节点右子节点是否有左子节点，若有就入栈，否则继续出栈

```js
function inOrder(root) {
  if (!root) return [];
  let stack = [];
  let result = [];
  while (stack.length || root) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop();
      console.log(root);
      result.push(root);
      root = root.right;
    }
  }
  return result;
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
  if (!root) return [];
  let stack = [];
  let result = [];
  stack.push(root);
  while (stack.length) {
    root = stack.pop();
    result.push(root);
    if (root.left) {
      stack.push(root.left);
    }
    if (root.right) {
      stack.push(root.right);
    }
  }
  return result;
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
  if (!root) return 0;
  return Math.max(getDepth(root.left), getDepth(root.right)) + 1;
}
```

## 堆

堆通常是一个可以被看做一棵树的数组对象。

堆的实现通过构造二叉堆，实为二叉树的一种。这种数据结构具有以下性质。

- 任意节点小于（或大于）它的所有子节点
- 堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层从左到右填入。
  将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆
