# 算法

## 动态规划

本质：

1. 自底向上分解子问题：将一个问题拆分为子问题，一般来说这些子问题都是非常相似的，那么我们可以通过只解决一次每个子问题来达到减少计算量的目的。
2. 通过变量存储已经计算过的解：一旦得出每个子问题的解，就存储该结果以便下次使用

### 斐波拉契数列

- 递归

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

- 动态规划
  - 思路：
    1. 斐波那契数列从 0 和 1 开始，那么这就是这个子问题的最底层
    2. 通过数组来存储每一位所对应的斐波那契数列的值

```js
function fib(n) {
  if (n <= 1) return n;
  let arr = [0, 1];
  for (let i = 2; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr[n];
}
```

### 最长公共子串

### 背包问题

## 贪心算法

贪心算法总是会选择当下最优解，通过一系列最优选择带来整体的最优选择。

### 找零问题

```js
/**
 * 给定不同面额的硬币 coins 和一个总金额 amount。
 * 编写一个函数来计算可以凑成总金额所需的最少的硬币个数。
 * 如果没有任何一种硬币组合能组成总金额，返回 -1
 * 示例1：
 * 输入: coins = [1, 2, 5], amount = 11
 * 输出: 3
 * 解释: 11 = 5 + 5 + 1
 *
 * 示例2：
 * 输入: coins = [2], amount = 3
 * 输出: -1
 */

const coinChange = function (coins, amount) {
  // 用于保存每个目标总额对应的最小硬币个数
  const f = [];
  // 提前定义已知情况
  f[0] = 0;
  // 遍历 [1, amount] 这个区间的硬币总额
  for (let i = 1; i <= amount; i++) {
    // 求的是最小值，因此我们预设为无穷大，确保它一定会被更小的数更新
    f[i] = Infinity;
    // 循环遍历每个可用硬币的面额
    for (let j = 0; j < coins.length; j++) {
      // 若硬币面额小于目标总额，则问题成立
      if (i - coins[j] >= 0) {
        // 状态转移方程
        f[i] = Math.min(f[i], f[i - coins[j]] + 1);
      }
    }
  }
  // 若目标总额对应的解为无穷大，则意味着没有一个符合条件的硬币总数来更新它，本题无解，返回-1
  if (f[amount] === Infinity) {
    return -1;
  }
  // 若有解，直接返回解的内容
  return f[amount];
};
```

## 排序算法

> V8 的 `Array.sort()` ：当 n<=10 时, 采用插入排序, 当 n>10 时，采用三路快排的排序策略

### 冒泡排序 O(n^2)

- 冒泡排序思想：让数组中的当前项和后一项比较，如果当前项比后一项大，则交换位置

- 优化：增加一个 flag，判断排序是否在中途就已经完成

```js
function bubble(array) {
  let flag = true;
  const len = array.length;
  for (let i = 0; i < len; i++) {
    if (!flag) break;
    flag = false;
    for (let j = 0; j < len - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        flag = true;
      }
    }
  }
  return array;
}
```

该算法的操作次数是一个等差数列 n + (n - 1) + (n - 2) + 1 ，去掉常数项以后得出时间复杂度是 O(n^2)

### 插入排序 O(n^2)

- 创建一个新数组用来存放插入的内容
- 每次插入和新数组中每一项比较如果比某一项小就放在这一项前面

```js
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    let target = arr[j];
    while (j > 0 && arr[j - 1] > target) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = target;
  }
  return arr;
}
```

### 快速排序 O(nlogn)

- 每次找到一个基准值，把值从数组中拿出
- 把数组剩下的元素按照基准值大小放入左右两个数组中
- 用递归的方法把左右两个数组继续按照当前逻辑遍历下去
- 返回 左边数组+基准值+右边数组

优化：大量重复数据时采用三路快排，增加与基准值相等区域

```js
// filter
// 遍历整个数组，将小于等于当前元素的值放入左侧数组，将大于当前元素的值放入右侧数组。创建两个新数组，并在每次递归调用时进行过滤操作。
// 代码量相对较少，易于理解和维护，每次递归调用时都会创建新的数组，可能会造成一些额外的内存开销
function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const cur = arr[arr.length - 1];
  const left = arr.filter((v, i) => v <= cur && i !== arr.length - 1);
  const right = arr.filter((v) => v > cur);
  return [...quickSort(left), cur, ...quickSort(right)];
}

// splice
// 选择数组的中间元素作为基准值（pivot），然后将小于基准值的元素放入左侧数组，大于等于基准值的元素放入右侧数组。
// 直接修改原始数组（存在一些潜在的副作用），减少了内存分配和垃圾回收的开销，处理大规模数据时可能会更高效一些
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}
```

### 选择排序 O(n^2)

原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕

```js
function selectSort(arr) {
  // 缓存数组长度
  const len = arr.length;
  // 定义 minIndex，缓存当前区间最小值的索引，注意是索引
  let minIndex;
  // i 是当前排序区间的起点
  for (let i = 0; i < len - 1; i++) {
    // 初始化 minIndex 为当前区间第一个元素
    minIndex = i;
    // i、j分别定义当前区间的上下界，i是左边界，j是右边界
    for (let j = i; j < len; j++) {
      // 若 j 处的数据项比当前最小值还要小，则更新最小值索引为 j
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 如果 minIndex 对应元素不是目前的头部元素，则交换两者
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
```

表现最稳定的排序算法之一，无论什么数据进去都是 O(n²)的时间复杂度

### 归并排序 O(nlogn)

归并排序和快排的思路类似，都是递归分治，区别在于快排边分区边排序，而归并在分区完成后才会排序，递归的将数组两两分开直到最多包含两个元素，然后将数组排序合并，最终合并为排序好的数组

```js
function merge(left, right) {
  let res = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      res.push(left[i]);
      i++;
    } else {
      res.push(right[j]);
      j++;
    }
  }
  if (i < left.length) {
    res.push(...left.slice(i));
  } else {
    res.push(...right.slice(j));
  }
  return res;
}

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
```

### 堆排序 O(nlogn)

堆是一棵特殊的树, 只要满足这棵树是完全二叉树和堆中每一个节点的值都大于或小于其左右孩子节点这两个条件, 那么就是一个堆, 根据堆中每一个节点的值都大于或小于其左右孩子节点, 又分为大根堆和小根堆

1. 初始化大(小)根堆，此时根节点为最大(小)值，将根节点与最后一个节点(数组最后一个元素)交换
2. 除开最后一个节点，重新调整大(小)根堆，使根节点为最大(小)值
3. 重复步骤二，直到堆中元素剩一个，排序完成

```js
function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) {
    largest = l;
  }
  if (r < n && arr[r] > arr[largest]) {
    largest = r;
  }
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
```

### 希尔排序 O(nlogn)

核心：在于间隔序列的设定。既可以提前设定好间隔序列，也可以动态的定义间隔序列。

第一个突破 O(n^2)的排序算法；是简单插入排序的改进版；它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序

```js
function shellSort(arr) {
  let len = arr.length;
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      let j = i;
      let current = arr[i];
      while (j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap];
        j = j - gap;
      }
      arr[j] = current;
    }
  }
  return arr;
}
```

### 计数排序 O(n+k)

核心：将输入的数据值转化为键存储在额外开辟的数组空间中。 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

思路：使用一个额外的数组 C，其中第 i 个元素是待排序数组 A 中值等于 i 的元素的个数。然后根据数组 C 来将 A 中的元素排到正确的位置。它只能对整数进行排序。

```js
function countingSort(arr) {
  let maxValue = Math.max(...arr);
  let bucket = new Array(maxValue + 1).fill(0);
  let sortedIndex = 0;
  let arrLen = arr.length;
  let bucketLen = maxValue + 1;
  for (let i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }
  for (let j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }
  return arr;
}
```

### 桶排序 O(n+k)

计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排

```js
function bucketSort(arr, bucketSize) {
  if (arr.length === 0) {
    return arr;
  }
  let i;
  let minValue = arr[0];
  let maxValue = arr[0];
  for (i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
    } else if (arr[i] > maxValue) {
      maxValue = arr[i];
    }
  }
  let DEFAULT_BUCKET_SIZE = 5;
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
  let bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  let buckets = new Array(bucketCount);
  for (i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }
  for (i = 0; i < arr.length; i++) {
    buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
  }
  arr.length = 0;
  for (i = 0; i < buckets.length; i++) {
    insertSort(buckets[i]);
    for (let j = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j]);
    }
  }
  return arr;
}
```

### 基数排序 O(n\*k)

思路：是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。基数排序基于分别排序，分别收集，所以是稳定的

```js
function radixSort(arr, maxDigit) {
  let mod = 10;
  let dev = 1;
  let counter = [];
  for (let i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < arr.length; j++) {
      let bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      let value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
}
```

## 其它

### LRU 缓存

```js
// 运用你所掌握的数据结构，设计和实现—个 LRU(最近最少使用)缓存机制。它应该支持以下操作：获取数据get 和写入数据put
// 获取数据
// get (key) - 如果密钥 (key)存在于缓存中，则获取密钥的值（总是正数），否则返回-1。
// 写入数据 out (key, value) - 如果密钥己经存在，则变更其数据值;如果密钥不存在，则插入该组「密钥/数据值」。
// 当缓存容量达到上限时，它应该在写入新数据之前删除最久末使用的数据值，从而为新的数据值留出空间。
// 进阶：
// 你是否可以在 O(1) 时间复杂度内完成这两种操作？

// 一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
  constructor(capacity) {
    this.secretKey = new Map();
    this.capacity = capacity;
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempValue = this.secretKey.get(key);
      this.secretKey.delete(key);
      this.secretKey.set(key, tempValue);
      return tempValue;
    } else return -1;
  }
  put(key, value) {
    // key存在，仅修改值
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key);
      this.secretKey.set(key, value);
    }
    // key不存在，cache未满
    else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value);
    }
    // 添加新key，删除旧key
    else {
      this.secretKey.set(key, value);
      // 删除map的第一个元素，即为最长未使用的
      this.secretKey.delete(this.secretKey.keys().next().value);
    }
  }
}

// LRUCache cache = new LRuCache （ 2 /* 缓存容量*/)；
// cache.put (1, 1);
// cache.put (2, 2) ;
// cache.get (1); // 返回1
// cache.put (3, 3); // 该操作会使得密钥 2作废
// cache.get (2); // 返回 -1未找到
// cache.put (4, 4); // 该操作会使得密钥 1作废
// cache.get (1); // 返回 -1（末找到）
// cache.get (3); // 返回3
// cache.get (4); // 返回4
```


## 算法思想

- 分治法：将一个问题分解为相同的子问题，然后递归的解决这些子问题，最后合并这些子问题的解
- 动态规划：将一个问题分解为相同的子问题，然后递归的解决这些子问题，但是不同的是，动态规划会存储这些子问题的解，避免重复计算
- 贪心算法：总是会选择当下最优解，通过一系列最优选择带来整体的最优选择
- 回溯法：通过不断的尝试，找到问题的解
- 分支限界法：通过不断的尝试，找到问题的解，但是会通过一些条件来限制尝试的次数
