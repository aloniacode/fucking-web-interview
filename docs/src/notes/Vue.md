# Vue

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

原理：将传入的回调函数包装成异步任务（分为微任务和宏任务），为了尽快执行所以默认优先包装成微任务，然后加入异步队列（微任务队列），等在下一次事件循环时调用。

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
## 7.说说Vue中虚拟DOM diff的原理？

和React diff类似，Vue diff算法也遵循以下三个原则：

- 同级比较

- 新旧节点类型不同时直接删除再创建

- 用key作为新老节点的标识符 

同级比较分为以下两种情况：

- 单节点diff: 基于上述原则，先比较key是否相同，如果相同再查看类型是否相同，都相同则复用，否者直接删除老节点再创建新节点。

- 多节点diff：vue2中采用**双端diff**算法（类似于双指针），而vue3中则使用**快速diff**算法。

**双端diff**:

![vue_diff](../assets/vue_diff.png)

第一轮遍历：对于新旧节点分别设置四个指针：`startIndex`指向未处理的第一个节点,`endIndex`指向未处理的最后一个节点。每一次遍历都会进行最多四次的比较，也就是新旧的`startIndex`和`endIndex`两两比较:

- new `startIndex`对比 old `startIndex`

- new `endIndex`对比 old `endIndex`

- new `startIndex`对比 old `endIndex`

- new `endIndex`对比 old `startIndex`

如果其中一种匹配成功则移动相应的指针，指针**由两边向中间移动**。

> Vue再diff过程中进行节点的更新、创建、删除和移动

如果以上四种情况都没有匹配成功，则循环遍历旧节点，找到Key值相同的旧节点(为了避免重复遍历，使用`Map`进行缓存)：

- 如果Key值相同，但`vnode`类型不一致，则创建新的节点置于old startIndex之前。

- 如果Key值相同，`vnode`类型一致，则直接将旧节点插入old startIndex之前。

- 如果Key值没有再老节点出现过，则认为是新创建节点，置于old startIndex之前。

这一轮遍历结束后，节点的移动都会被处理，对应的双指针只剩下两种情况。

第二轮遍历： 

- old `startIndex` > old `endIndex`：说明旧节点之前就走完了，新节点还有尚未处理的DOM节点，需要批量创建。

- new `startIndex` > new `endIndex`: 说明新节点处理完了，旧节点还存在多余的DOM节点，需要批量删除。


**快速diff**：

Vue3的快速diff算法在双端diff的基础上借鉴了字符串diff时双端对比的思路。

1. 处理前置节点。

2. 处理后置节点。

3. 新节点有剩余则创建剩余的新节点。

4. 旧节点有剩余则删除剩余的旧节点。

5. 如果新旧节点都有剩余，则构建**最长递增子序列**。

6. 如果节点在最长递增子序列中则不需要移动，否则就移动该节点。

例如：

旧节点key序列： `ABCD`

新节点key序列： `DABC`

- 首先处理前置节点：A和D，发现key值不同，不能复用，退出前置节点处理逻辑。

- 处理后置节点： D和C，发现key值不同，不能复用，退出后置节点处理逻辑。

- 进入乱序情况处理，创建新旧节点下标映射并根据映射构造最长递增子序列`ABC`。

- `A`、`B`、`C`都在最长递增子序列中，不需要移动，那么只需要将`D`移动到最前面。

- diff结束。

## 8.Vue中key的作用是什么？为什么需要绑定key？

`key`这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode,以便在进行列表渲染时，能够尽可能高效地复用和更新已有的元素，而不是销毁和重新创建。当Vue更新列表时，它会尽量保留相同key的元素，从而减少DOM操作，提高性能。

需要绑定key的原因是确保在列表渲染时，每个元素都有一个唯一且稳定的标识符。如果不绑定key，Vue会使用元素的索引作为默认标识符，但这样可能会导致一些意外的问题，特别是在列表发生变化时。通过绑定key，Vue能够更准确地追踪每个元素的变化，确保列表的更新和渲染是准确的。如果`key`值重复也会导致渲染异常。

## 9.为什么不建议在Vue中使用index作为key？

> 官方文档： Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。

> 默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况。

其实如果是静态列表（无增删移动操作），完全可以使用index作为`key`,例如分页场景下，每页显示10条数据，每个元素使用index作为`key`而不是数据项中的唯一标识（例如id），当切换页码的时候无需替换当前页面的列表项，只需要更新相应的数据就行。

当然，在非静态列表的场景中还是尽可能避免使用index作为`key`,当数据更新或DOM出现新增删除或移动时可能会导致index发生变化，从而导致Vue认为某些节点发生变化而重现渲染，甚至会出现意外的BUG。index作为`key`不能保证唯一性和稳定性，故而不建议使用。

## 10.说说Pinia的工作原理？他如何管理和维护状态？

基本原理： 

- `createPinia`: `createPinia`方法创建了一个pinia对象并添加了`_s`属性，这个`_s`属性是一个`Map`对象，用来保存后续使用`defineStore`创建的store,由于pinia也是vue的一个插件，因此pinia对象也定义了一个install方法用于将创建的pinia对象通过`provide`注入到每一个组件中，这样在任意组件中可以通过`inject`获取到pinia对象。

```js
export function createPinia(){
    const pinia = {
        _s: new Map(),
        install(app){
            app.provide(symbolKey,pinia) // symbolKey是一个symbol类型
        }
    }
    return pinia
}

```

- `defineStore`: 和`Vuex`不同的是`Pinia`定义的每一个store是相互独立不影响的。`defineStore`方法会创建一个使用`reactive`包裹的对象，这就是为什么store数据具有响应式。然后将通过参数传递进来的state,getters,actions进行处理合并到store对象上，最后将store对象挂载到pinia对象的`_s`属性上，id为key值，store为value值。由此可见，` Pinia`可以跨组件状态共享就是因为每个store都是单例模式。

```js
export function defineStore (
    id,
    {
        state,
        getters,
        actions
    }
){
    const store = reactive({})
    // 将state设置到store上
    if(state && typeof state === 'function'){
        const _state = state()
        for (let key in _state){
            store[key] = _state[key]
        }
    }
    //为什么是computed请看官网https://pinia.vuejs.org/zh/core-concepts/#setup-stores
    // 将getters设置到store上
    if(getters && Object.keys(getters).length > 0){
        for (let getter in getters){
            store[getter] = computed(getters[getter].bind(store,store))
        }
    }
    function wrapAction(methodName){
        return function(){
            actions[methodName].apply(store,arguments)
        }
    }

    // 将actions设置到store上
    if(actions && Object.keys(actions).length > 0){
        for(let methodName in actions){
            store[methodName] = wrapAction(methodName)
        }
    }
    return ()=>{
        const pinia = inject(symbolKey);
        if(!pinia._s.has(id)){
            pinia._s.set(id,store)
        }
        const _store = pinia._s.get(id)
        return _store
    }
}

```