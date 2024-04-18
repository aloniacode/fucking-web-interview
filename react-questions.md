# React questions

## React合成事件和原生事件的区别？

1. 名称不同：原生事件名称都是小写，合成事件的名称是驼峰式的。
2. 使用方式不同：原生直接使用字符串绑定，合成事件使用大括号绑定。
3. 阻止浏览器默认行为： 原生的事件函数返回false ，合成事件使用preventDefault()。

为什么React要使用合成事件？

配合VDOM模拟原生事件 实现跨平台 所有事件都放在一个数组中。

## 为什么使用hooks？

1. 复杂组件的逻辑便于抽离。
2. 复用逻辑。
3. class组件的this不易理解，给使用者造成额外的心智负担。

## useEffect 和 useLayoutEffect 的执行区别

```js

useEffect(() => console.log('组件更新时执行')) // 类似于componentDidUpdate

useEffect(() => {
    console.log('组件挂载时执行'); // 类似于componentWillMount
    return () => {
        console.log('组件卸载时执行') // 类似于componentWillUnmount
    }
},[])

useEffect(() => {
      console.log('组件挂载时或者依赖变更时执行'); // 类似于componentWillMount加上componentDidUpdate
    return () => {
        console.log('组件卸载时或者依赖变更时执行') // 依赖变化时会先使用旧的state和props执行该函数，然后再执行setup回调函数
    }
},[deps])

```

useLayoutEffect的用法和useEffect一样，但是它们的setup回调执行的时机不同：

VDOM更新 -> DOM更新 -> useEffect
VDOM更新 -> useLayoutEffect -> DOM更新


## setState的原理和机制？它为什么是异步的？

React18中setState默认是**异步/批量**的，18版本以前在原生DOM事件回调中和setTimeout/promise回调中setState是同步执行的，可以在执行setState后立即拿到最新值，而在React合成事件和生命周期中是异步执行的。

异步：setState后面代码无法在setState后立即拿到最新的state，它表现得像异步执行，实际上不是传统意义上的异步执行（setTimeout/Promise）。

批量：连续多次调用setState会合并成一个更新操作，UI只会重新渲染一次。

![自动批处理](./images/react18_automatic_batching.png)

原理：

- fiber架构之前： 执行setState -> 合并状态数据到组件的状态队列中，不立即执行 -> 根据新的状态数据生成一个新的虚拟DOM树，表示预期的输出结果 -> 比较新旧虚拟DOM树确定需要进行的实际DOM更新 -> 计算两棵树的差异，这些差异代表对实际DOM进行的最小更改 -> 批处理更新实际的DOM

- fiber架构之后：执行setState -> 将更新请求放入队列中，不立即执行，继续后续的任务 -> 进入调度阶段，生成新的fiber树（workInprogress树），用于描述预期的输出 -> 比较workInprogress fiber树和当前渲染使用的fiber树，确定需要的实际DOM更新 -> 计算两个fiber树的差异，这些差异代表对实际DOM进行的最小更改 -> 将计算出的差异转换为更新队列，队列包含需要更新的组件和DOM节点 -> 优先级调度，确保重要的任务优先执行 -> 按照优先级顺序执行更新队列中的任务来批量处理更新实际DOM

设计成异步的理由：

1. 提升性能，避免每次调用setState都重新渲染组件。（性能损耗一般在虚拟DOM树diff过程）
2. 避免state和props无法同步。如果setState是同步执行的，那么就会立即更新组件内部的state，但是render函数中传递的props还是旧值，这就导致了state和props的不一致。



## useRef的原理和机制？为什么它不会导致UI重新渲染？/为什么它的值在组件的生命周期中是不变的？


