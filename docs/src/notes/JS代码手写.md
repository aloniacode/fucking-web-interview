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

## 10.实现一个 Promise

## 11.实现`Promise.all()`方法

## 12.实现`Promise.race()`方法

## 13.实现`Promise.allSettled()`方法

## 14.实现柯里化函数`curry()`

## 15.实现`compose()`函数

## 16.实现 LRU 缓存算法

## 17.实现红绿灯

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
