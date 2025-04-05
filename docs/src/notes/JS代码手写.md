# 常见的 JS 代码手写题

## 1.深拷贝

::: code-group

```js [递归写法]
function cloneDeep(source, map = new WeakMap()) {
  // 判断参数类型
  if (typeof source !== "object" || source === null) return source;
  // 处理循环引用，使用缓存
  if (map.has(source)) return map.get(source);
  // 创建容器
  const result = Array.isArray(source) ? [] : {};
  // 缓存容器
  map.set(source, result);
  // 使用for...of和Object.hasOwnProperty会丢失Symbol属性，使用Reflect.ownKeys更合适
  for (const key of Reflect.ownKeys(source)) {
    result[key] = cloneDeep(source[key], map);
  }
  return result;
}
```

```js [循环写法]
function cloneDeep(source) {
  // 基本类型直接返回
  if (typeof source !== "object" || source === null) return source;
  // 初始化根对象
  const root = Array.isArray(source) ? [] : {};
  // 使用栈保存待处理的对象
  const stack = [
    {
      source,
      target: root,
    },
  ];
  // 使用 WeakMap 缓存已拷贝的对象（处理循环引用）
  const map = new WeakMap();
  map.set(source, root);

  while (stack.length > 0) {
    const { source, target } = stack.pop();

    // 遍历所有自有属性（包括 Symbol 和不可枚举属性）
    for (const key of Reflect.ownKeys(source)) {
      const value = source[key];
      // 基本类型直接赋值
      if (typeof value !== "object" || value === null) {
        target[key] = value;
      } else {
        // 检查是否已缓存（处理循环引用）
        if (map.has(value)) {
          target[key] = map.get(value);
        } else {
          // 初始化新对象/数组
          const newValue = Array.isArray(value) ? [] : {};
          target[key] = newValue;
          map.set(value, newValue);
          // 加入栈，待后续处理
          stack.push({
            source: value,
            target: newValue,
          });
        }
      }
    }
  }
  return root;
}
```

:::

## 2.数组去重

::: code-group

```js [简单版]
// 适用于数组内元素是基本数据类型，但是无法处理对象去重
function uniqueArray(arr) {
  return [...new Set(arr)];
}
```

```js [进阶版]
// 可以处理元素是任何类型的数组，由于深度比较对象导致性能较差
function uniqueArray(arr) {
  const result = [];
  for (const item of arr) {
    // 检查是否已存在相同项（深度比较）
    if (!result.some((existing) => isDeepEqual(existing, item))) {
      result.push(item);
    }
  }
  return result;
}

// 深度比较两个值是否相等
function isDeepEqual(a, b) {
  // 处理基本类型 + NaN
  if (Object.is(a, b)) return true; // 包括 NaN === NaN
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => isDeepEqual(val, b[i]));
  }
  // 处理对象
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => isDeepEqual(a[key], b[key]));
}
```

:::

## 3.数组扁平化

现代项目请直接使用 ES2019 引入的`Array.flat()`方法。

::: code-group

```js [递归实现]
// 使用于数组嵌套不深的简单场景，可能会出现栈溢出
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
```

```js [循环实现]
//使用辅助栈和循环实现避免出现栈溢出，性能损耗在unshift操作上，使用于大部分场景
function flatten(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      stack.push(...current);
    } else {
      result.unshift(current); // 保持顺序
    }
  }
  return result;
}
```

:::

## 4.节流和防抖

::: code-group

```js [防抖函数]
function debounce(callback, wait, immediate = false) {
  let timeout;
  return function (...args) {
    const context = this;
    const shouldCallNow = immediate && !timeout;
    // 有定时器则重新计时
    if (timeout) clearTimeout(timeout);
    // 新建定时器，wait毫秒后重置定时器，使shouldCallNow为true而立即执行回调
    timeout = setTimeout(() => {
      if (!immediate) {
        callback.apply(context, args);
      }
      timeout = null;
    }, wait);
    // 第一次触发，立即执行
    if (shouldCallNow) {
      callback.apply(context, args);
    }
  };
}
```

```js [节流函数]
function throttle(callback, wait, immediate = false) {
  let timeout = null,
    lastTime = 0;
  return function (...args) {
    const context = this;
    const nowTime = Date.now();
    const remaining = wait - (nowTime - lastTime);

    // 清理定时器
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    // 如果需要立即执行并且第一次触发，立即执行
    if (immediate && lastTime === 0) {
      callback.apply(context, args);
      lastTime = nowTime;
    } else if (remaining <= 0) {
      // 剩余时间小于0则立即执行
      callback.apply(context, args);
      lastTime = nowTime;
    } else {
      timeout = setTimeout(() => {
        callback.apply(context, args);
        lastTime = Date.now();
        timeout = null;
      }, remaining);
    }
  };
}
```

:::

## 5.发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      // 支持异步回调
      this.events[eventName].forEach(async (callback) => {
        await callback(args);
      });
    }
  }
  off(eventName, callback) {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(callback);
      if (index > -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }
  once(eventName, callback) {
    const onceWrapper = (...args) => {
      callback(...args);
      this.off(eventName, onceWrapper);
    };
    this.on(eventName, onceWrapper);
  }
}
```

## 7.实现`getType()`方法，判断变量的数据类型，返回对应的字符串

```js
function getType(variable) {
  return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
}
```

## 8.实现一个`isEqual()`方法，判断两个对象是否相等

```js
function isEqual(a, b) {
  // 处理基本类型和NaN
  if (Object.is(a, b)) return true;
  // 处理null和undefined
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  // 处理Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  // 处理RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }
  // 处理Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    return isEqual([...a], [...b]);
  }
  // 处理Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    return isEqual([...a], [...b]);
  }
  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => isEqual(item, b[i]));
  }
  // 处理对象
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => isEqual(a[key], b[key]));
  }
}
```

## 9.分别实现`bind()`、`call()`、`apply()`方法

::: code-group

```js [call()]
// call 会以给定的this值和多个参数来立即调用函数
Function.prototype.call = function (context, ...args) {
  // 非严格模式下null和undefined会被转换成全局对象
  context = context || window;
  // 将当前函数上下文对象this作为context的一个属性，使用Symbol避免冲突
  const fn = Symbol("fn");
  context[fn] = this;
  // 调用函数
  const result = context[fn](...args);
  // 删除临时属性
  delete context[fn];
  return result;
};
```

```js [apply]
// apply和call类似，区别在于参数以数组的形式传入
Function.prototype.apply = function (context, args) {
  if (!Array.isArray(args)) {
    throw new TypeError("参数必须为数组");
  }
  // 非严格模式下null和undefined会被转换成全局对象
  context = context || window;
  // 将当前函数上下文对象this作为context的一个属性，使用Symbol避免冲突
  const fn = Symbol("fn");
  context[fn] = this;
  // 调用函数
  const result = args ? context[fn](...args) : context[fn]();
  // 删除临时属性
  delete context[fn];
  return result;
};
```

```js [bind]
// bind和call/apply不同，它不立即执行函数，而是返回一个绑定了this的新函数
// 接受一个this指向对象和多个用于插入到绑定函数的参数
Function.prototype.bind = function (context, ...args) {
  const originalFn = this;
  return function (...callArgs) {
    // 如果是作为构造函数调用，则忽略绑定的this
    if (new.target) {
      return new originalFn(...args, ...callArgs);
    }
    // 以下逻辑可以使用call代替
    // 非严格模式下null和undefined会被转换成全局对象
    context = context || window;
    // 使用绑定的this
    const fn = Symbol("fn");
    context[fn] = originalFn;
    const result = args
      ? context[fn](...args, ...callArgs)
      : context[fn](...callArgs);
    // 删除临时属性
    delete context[fn];
    return result;
  };
};
```

:::

## 10.实现 Promise，并实现它的静态方法`resolve()`、`reject()`、`all()`、`race()`、`allSettled()`、`withResolver()`

实现要点如下：

- 状态管理：Promise 有三种状态：pending、fulfilled 和 rejected，状态一旦改变就不能再变。

- 异步处理：通过 setTimeout 确保 then 回调总是异步执行。

- 链式调用：then 方法返回一个新的 Promise，实现链式调用。

- 值穿透：当 then 的参数不是函数时，实现值穿透。

- Promise 解析过程：resolvePromise 方法实现了 Promise/A+ 规范的解析过程，处理 thenable 对象和循环引用等情况。

- 静态方法：实现了 resolve、reject、all 和 race 等静态方法。

```js
class MyPromise {
  constructor(executor) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb(value));
      }
    };
    const reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullfilled, onRejected) {
    onFullfilled =
      typeof onFullfilled === "function" ? onFullfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        setTimeout(() => {
          try {
            const r = onFullfilled(this.value);
            this.resolvePromise(promise2, r, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const r = onRejected(this.reason);
            this.resolvePromise(promise2, r, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      if (this.status === "fulfilled") {
        handleFulfilled();
      } else if (this.status === "rejected") {
        handleRejected();
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise2;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }
    let called = false;
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      try {
        const then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        promises[i].then((value) => {
          result[i] = value;
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        }, reject);
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return;
      }
      promises.forEach((promise) =>
        MyPromise.resolve(promise).then(resolve, reject)
      );
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      const result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        promises[i]
          .then((value) => {
            result[i] = { status: "fulfilled", value };
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          })
          .catch((reason) => {
            result[i] = { status: "rejected", reason };
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          });
      }
    });
  }
  // ES2024（ES14）引入
  static withResolver() {
    let resolve, reject;
    const promise = new MyPromise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    return { promise, resolve, reject };
  }
}
```

## 11.实现柯里化函数`curry()`

::: code-group

```js [基础版]
// 基础版本，没有考虑占位符的情况
function baseCurry(fn) {
  return function curriedFn(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curriedFn.apply(this, args.concat(nextArgs));
    };
  };
}
```

```js [进阶版]
// 进阶版本，考虑占位符的情况
function advancedCurry(fn) {
  return function curriedFn(...args) {
    if (args.length >= fn.length && !args.includes(advancedCurry._)) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      const mergedArgs = args.map((arg) =>
        arg === advancedCurry._ && nextArgs.length ? nextArgs.shift() : arg
      );
      return curriedFn.apply(this, mergedArgs.concat(nextArgs));
    };
  };
}
// 定义占位符
advancedCurry._ = Symbol("_");
```

:::

## 12.实现`compose()`函数

compose 是函数式编程中的一个重要概念，它将多个函数组合成一个函数，从右到左执行。与 pipe 相反。

可将以下代码将`reduceRight()`替换为`reduce()`，实现从左到右执行的 pipe function。

```js
// 基础版
function compose(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduceRight(
    (acc, f) =>
      (...args) =>
        f(acc(...args))
  );
}

// 支持异步函数
function compose2(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduceRight(
    (acc, f) =>
      async (...args) =>
        await f(await acc(...args))
  );
}
```

## 13.实现 LRU 缓存算法

::: code-group

```js [仅使用Map实现]
// 依赖Map的插入顺序，无法严格保证LRU
class SimpleLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    if (this.cache.size === this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // 获取第一个键的值，即最久未用
    }
  }
}
```

```js [使用双向链表+Map实现]
class ListNode {
  constructor(key = 0, value = 0) {
    this.key = key; // 用于哈希表快速查找
    this.value = value;
    this.prev = null; // 前驱节点
    this.next = null; // 后继节点
  }
}

class LRUCache {
  constructor(capacity) {
    this.map = new Map(); // 哈希表，用于快速查找节点
    this.capacity = capacity; // 缓存容量
    this.head = new ListNode(); // 虚拟头节点
    this.tail = new ListNode(); // 虚拟尾节点
    // 初始化链表
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 获取缓存值,访问后将节点移到链表头部
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._moveToHead(node);
    return node.value;
  }
  // 设置缓存值,如果缓存已满,则淘汰最久未使用节点
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value; // 更新节点值
      this._moveToHead(node); // 移动节点到头部
    } else {
      // 判断缓存是否已满
      if (this.map.size === this.capacity) {
        this._removeTail(); // 缓存已满,淘汰最久未使用节点
      }
      const node = new ListNode(key, value); // 创建新节点
      this.map.set(key, node); // 加入哈希表
      this._addToHead(node); // 加入链表头部
    }
  }
  // 私有方法，将节点移动到链表头部
  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }
  // 私有方法，将节点从链表中移除
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  // 私有方法，将节点加入链表头部
  _addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }
  // 私有方法，移除链表尾部节点，淘汰最久未使用
  _removeTail() {
    const node = this.tail.prev;
    this._removeNode(node);
    this.map.delete(node.key);
  }
}
```

:::

## 14.实现红绿灯

```js
function red() {
  console.log("red");
}

function green() {
  console.log("green");
}

function yellow() {
  console.log("yellow");
}
function light(callback, wait) {
  return new Promise((res) => {
    setTimeout(() => {
      callback();
      res();
    }, wait);
  });
}

async function run() {
  return Promise.resolve()
    .then(() => light(red, 2000))
    .then(() => light(green, 2000))
    .then(() => light(yellow, 2000))
    .finally(() => run());
}

run();
```

## 18.实现一个方法`parseURL`处理 url 参数

::: code-group

```js [使用URL()]
// 现代浏览器环境下推荐使用该方式进行处理
function parseURL(url) {
  const urlObj = new URL(url);
  const params = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}
```

```js [手动解析]
// 如果要兼容旧环境，可以使用手动解析的方式
function parseURL(url) {
  const params = {};
  const queryString = url.split("?")[1];
  if (queryString) {
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      // 处理特殊字符
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);
      // 如果不需要支持重复键的话则可以在处理特殊字符后直接设置值
      if (params[decodedKey]) {
        if (Array.isArray(params[decodedKey])) {
          params[decodedKey].push(decodedValue);
        } else {
          params[decodedKey] = [params[decodedKey], decodedValue];
        }
      } else {
        params[decodedKey] = decodedValue;
      }
    }
  }
  return params;
}
```

:::
