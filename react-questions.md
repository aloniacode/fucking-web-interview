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


