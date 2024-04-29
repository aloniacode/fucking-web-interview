# Vue Questions

## 1.说说Vue的响应式原理，它和React有什么区别？

Vue2.x 是依赖Object.defineProperty()实现响应式，缺点是无法劫持属性的删除和添加，对于数组也无法监听到变化，同时深层对象的递归劫持有较大的性能损耗。

Vue3 则是借助ES6新增的Proxy API 对对象属性进行劫持从而实现响应式，同时可以监听数组的变化。

React的响应式是依赖于虚拟DOM的DIFF算法以及自顶向下的单向数据流，当组件的内部的state发生变化，通过对比前后虚拟DOM从而触发render函数进行UI的变更。

## 2.Vue3相比Vue2有哪些变化？

1. 根节点不同： Vue2必须要有根标签，而Vue3则可以没有根标签，会默认将多个根标签包裹在一个`Fragement`中，这样处理减少了内存的消耗。

2. API风格不同: Vue2中采用的是Options API,将函数和数据集中处理，各个功能的代码混合在一块，而Vue3采用Composition API，可以将同一功能的代码集中在一块，同时可以更好地组织与复用逻辑。

3. 生命周期不同：

  - 创建前：beforeCreate -> 使用setup()

  - 创建后：created -> 使用setup()

  - 挂载前：beforeMount -> onBeforeMount

  - 挂载后：mounted -> onMounted

  - 更新前：beforeUpdate -> onBeforeUpdate

  - 更新后：updated -> onUpdated

  - 销毁前：beforeDestroy -> onBeforeUnmount

  - 销毁后：destroyed -> onUnmounted

  - 异常捕获：errorCaptured -> onErrorCaptured

  - 被激活：onActivated 被包含在`<keep-alive>`中的组件，会多出两个生命周期钩子函数。被激活时执行。

  - 切换：onDeactivated 比如从 A 组件，切换到 B 组件，A 组件消失时执行

4. v-if和v-for的优先级: Vue2中v-for优先级高于v-if,两者可以一起使用，但是会带来性能上地浪费；Vue3中v-if优先级高于v-for，一起使用会报错。

5. 响应式原理不同： Vue2通过`Object.definedProperty()`的`get()`和`set()`来做数据劫持、结合和发布订阅者模式来实现，`Object.definedProperty()`会遍历每一个属性。而Vue3通过`Proxy`代理的方式实现，不需要像`Object.definedProperty()`的那样遍历每一个属性，有一定的性能提升。`Proxy`可以理解为在目标对象之前架设一层“拦截”，外界对该对象的访问都必须通过这一层拦截。这个拦截可以对外界的访问进行过滤和改写。


6. DIFF算法不同： Vue2中的DIFF算法会遍历每一个虚拟DOM并进行新旧DOM对比，并返回一个`patch`对象来记录两个节点的不同，然后用`patch`信息去更新DOM（边记录边更新）。这样的处理方式会比较每一个节点，对于没有发生更新的节点的比较是多余的，这就照成了不必要的性能浪费。Vue3中改进了DIFF算法，在初始化时会给每一个节点添加`patchFlags`标识，在DIFF过程中只会比较`patchFlags`发生变化的节点，而`patchFlags`没有变化的节点作静态标记，渲染时直接复用节点。

## 3.Vue3做了哪些优化？

1. 更好的TypeScript支持： Vue3全面采用TypeScript重写，提供了更好的类型推断和类型提示，也提供了更多的内置类型声明，使得开发时更容易发现代码错误和调试。

2. 更快的渲染性能： Vue3重写了虚拟DOM的实现，编译模板的优化，更高效的组件初始化。

3. 更小的体积： Vue3的核心运行时比Vue2更小，并且支持Tree-shaking，这意味着更小的打包体积。

4. 更灵活的组合式API： 组合式API提供了更直观、更灵活的方式来组织组件代码，使得代码更易读、易维护。

5. 更好的响应式系统：Vue3使用了`Proxy`来重写响应式系统，相比 Vue2的`Object.defineProperty`，更加直观和强大。并且可以在更深的层次上追踪响应式变量的变化，使得开发者能够更准确地监听数据变化。

## 4.Vue组件通信的方式有哪些？

1. 通过props传递数据，适用于父传子场景。

2. 通过 $emit 触发自定义事件，适用于子传父场景。

3. 使用ref获取子组件的实例，从而在父组件中获取子组件的数据。

4. EventBus： 适用于兄弟组件之间传值。具体为创建一个中央事件总线，兄弟组件通过`$emit`触发自定义事件，其他兄弟组件通过`$on`监听自定义事件。

```js
class EventBus {  
  constructor() {  
    this.callbacks = {}; 
  }  
  $on(name, fn) {  
    this.callbacks[name] = this.callbacks[name] || [];  
    this.callbacks[name].push(fn);  
  }  
  $emit(name, args) {  
    if (this.callbacks[name]) {  
      this.callbacks[name].forEach((cb) => cb(args));  
    }  
  }  
}  
  
// main.js  
Vue.prototype.$eventBus = new EventBus() // 将$eventBus挂载到vue实例的原型上  
// 另一种方式  
Vue.prototype.$eventBus = new Vue() // Vue已经实现了Bus的功能 

```

5. $parent 或$root: 通过共同祖辈$parent或者$root搭建通信桥连

```js
// 兄弟组件
this.$parent.on('add',this.add)

//另一个兄弟组件

this.$parent.emit('add')
```

6. 透传Attributes: 适用于祖先组件传递给子孙组件。“透传 attribute”指的是传递给一个组件，却没有被该组件声明为`props`或`emits`的 attribute 或者`v-on`事件监听器。最常见的例子就是 class、style 和 id。Vue3中可以使用`useAttrs()`访问所有的透传attributes。

7. Provide与Inject （依赖注入）：祖先/顶层组件通过定义`provide(key,value)`来为子孙组件提供数据，子孙组件通过`inject(key,defaultValue)`来获取。

```jsx
// 祖先组件
<script setup>
import { ref,provide } from 'vue'
const count = ref(0)

provide(/* 注入名 */ 'count', /* 值 */ count)
</script>

```

```jsx
// 子孙组件
<script setup>
import { inject } from 'vue'

const count = inject('count')
</script>
```

8. Vuex/Pinia: 适用于需要跨组件或页面共享状态的场景。

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