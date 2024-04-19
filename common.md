## 1.vue 和 react 的响应式

Vue2.x 是依赖Object.defineProperty()实现响应式，缺点是无法劫持属性的删除和添加，对于数组也无法监听到变化，同时深层对象的递归劫持有较大的性能损耗。

Vue3 则是借助ES6新增的Proxy API 对对象属性进行劫持从而实现响应式，同时可以监听数组的变化。

React的响应式是依赖于虚拟DOM的DIFF算法以及自顶向下的单向数据流，当组件的内部的state发生变化，通过对比前后虚拟DOM从而触发render函数进行UI的变更。

## 2.window load 和 document ready的区别

window.load事件是再整个页面以及所有依赖资源例如样式表和图片等都加载完时触发。

Jquery中的document ready事件是在DOM树加载完时触发，不必等待其他依赖资源的加载。
