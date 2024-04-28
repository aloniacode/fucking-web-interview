# Vue Questions

## 1.说说Vue的响应式原理，它和React有什么区别？

Vue2.x 是依赖Object.defineProperty()实现响应式，缺点是无法劫持属性的删除和添加，对于数组也无法监听到变化，同时深层对象的递归劫持有较大的性能损耗。

Vue3 则是借助ES6新增的Proxy API 对对象属性进行劫持从而实现响应式，同时可以监听数组的变化。

React的响应式是依赖于虚拟DOM的DIFF算法以及自顶向下的单向数据流，当组件的内部的state发生变化，通过对比前后虚拟DOM从而触发render函数进行UI的变更。

## 2.Vue3相比Vue2有哪些变化？

## 3.Vue3做了哪些优化？

## 4.Vue组件通信的方式有哪些？

## 5.Vue中数据的双向绑定是如何实现的？原理是什么？

简单的说，Vue的数据双向绑定是通过**数据劫持**配合**发布-订阅模式**实现的。

> 数据劫持是指在访问或修改对象属性时，通过拦截的方式进行额外的处理。

1. 数据劫持：当创建Vue实例时，Vue会遍历传入的数据对象并进行响应化处理，通过设置一个`Observer`来监听所有属性。Vue2通过Object.defineProperty()设置对象setter和gettter方法来拦截对数据的读取和修改操作，而Vue3中则通过Proxy实现对对象的代理，从而实现基本操作的拦截和自定义。Proxy是深层次的监听，而不仅仅是某个属性。

2. 编译模板： 初始化时，同时使用指令解析器`Compile`对每个节点元素扫描解析，找到动态绑定的指令并替换成数据。同时初始化一个订阅者`Watcher`并添加指令绑定的相应更新函数，将来数据变化时`Watcher`可以执行更新函数从而更新视图。

3. 依赖收集： 由于订阅者会出现多个，所以需要一个消息订阅器`Dep`来专门收集这些订阅者，统一管理。

4. 更新：如果某个数据发生更新，会先找到消息订阅器`Dep`，通知所有的订阅者`Watcher`执行更新函数。

总的来说，Vue数据双向绑定的核心是通过`Watcher`实现数据与视图的同步。当数据变化时，通过`Watcher`检测到并通知相关视图更新；当用户与视图交互时，通过`Watcher`更新相关的数据。这样就实现了数据和视图的双向绑定。

## 6.Vue中$nextTick/nextTick的原理是什么？它有哪些用途？

`nextTick`存在的原因： Vue采用的是**异步更新策略**，当监听到数据发生变化后不会立即更新DOM，而是开启一个任务队列，将同一事件循环中的数据变更加入队列中，等循环结束后在下一轮事件循环中遍历队列一次性更新。这个机制基于浏览器的事件循环，这样做的好处在于可以将多次的数据更新合并到一次，减少操作DOM的次数，提高性能。

原理：将传入的回调函数包装成异步任务（分为微任务和宏任务），为了尽快执行所以默认优先包装成微任务，然后加入异步队列（微任务队列，等在下一次事件循环时调用。

> `nextTick`提供了Promise.then、MutationObserver、setImmediate、setTimeout(fn,0)四种方法用于处理传入的回调函数，优先级从左到右依次降低，如果当前环境不支持某个方法就降级处理。

源码实现原理：

1. 使用callbacks数组存放需要在下一个事件循环中执行的回调函数，并使用pending标志标识当前是否已经向队列中添加了任务，如果添加了则置为true，当任务被执行时设置为false。

2. 如果`nextTick`没有传入回调函数并且当前环境支持Promise就会的返回一个Promise，该Promise的then中可以获取到最新的DOM。

3. 使用`flushCallbacks`方法用于执行`callbacks`数组中的回调，它首先会将pending设置为false并拷贝`callbacks`后清空`callbacks`（用于处理`nextTick中嵌套`nextTick`的情况）,然后会遍历拷贝`callbacks`数组并依次执行回调。


应用场景：如果数据变化后需要立即使用到最新的DOM，就在nextTick的回调中处理，亦或者不传入回调并使用`await`等待`nextTick`，这样后续的代码就能获取到最新的DOM。

```vue
<script setup>
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++

  // DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0

  await nextTick()
  // DOM 此时已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
</script>

<template>
  <button id="counter" @click="increment">{{ count }}</button>
</template>

```


## 7.说说Vue中虚拟DOM Diff的原理？

## 8.Vue中key的作用是什么？为什么需要绑定key？

## 9.为什么不建议在Vue中使用index作为key？

## 10.说说Pinia的工作原理？他如何管理和维护状态？