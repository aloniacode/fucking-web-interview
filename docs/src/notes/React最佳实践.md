# React 最佳实践

如何在实际项目开发中写出更好的 React 代码？React 技术栈中的最佳实践有哪些？

进行 React 开发的前提是要对 React 的工作原理有一定的理解，我们不需要从源码的层面一点一点地去剖析，毕竟项目都是业务功能优先，我们之需要确保功能地实现即可，但是理解 React 的工作原理有助于我们写出更健壮更可靠的 React 代码。

## 理解 React

响应式的实现原理主要基于**虚拟 DOM**、**Fiber 架构**、**状态更新机制**和**调度系统**的协同工作。

1. 状态变化。
2. 触发重新渲染。
3. 生成新的虚拟 DOM 并通过 Diff 算法计算差异。
4. Fiber 架构和调度系统确保高效可中断的更新。
5. 最终将最小变更应用到真实 DOM。

React 是自顶向下的数据流，父组件通过`props`向子组件传递数据，子组件不能直接修改 props，需要通过回调函数修改父组件的状态来触发变更。这与 Vue 不同，Vue 中通过`v-model`实现的双向绑定，可以直接修改 props 让触发变更。

这种数据流的设计方式优点是**高可维护性**和**数据流透明**，但需要使用`Context`或者第三方状态管理库来解决深层次的状态传递问题。

## 合理的状态管理

1.不可变数据的正确使用。避免直接修改`state`，而是通过`setState`方法更新状态，对于引用类型需要确保引用发生变化。

```jsx
const [count, setCount] = useState(0);
const [books, setBooks] = useState([]);
count++; // [!code --]
setCount(count + 1); // [!code ++]

books.push(newBook); // [!code --]
setBooks(books); // [!code --]
setBooks([...books, newBook]); // [!code ++]
```

2.尽量只用 updater 函数更新状态，而不是直接修改状态。

```jsx
const [count, setCount] = useState(0);

// 点击一次，最终结果count为1
// React内部合并了多次相同的setState的调用，只执行一次setCount
const handleClick1 = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
// 点击一次，最终结果count为3
// React内部将updater函数放入updateQueue，依次执行，执行结果作为下一个updater的参数传入
// updateQueue执行完毕后得到最终的结果
const handleClick2 = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
};
```

3.避免滥用`useState`,如果数据可以从已有状态派生，直接计算使用而不是用`useState`保存。

```jsx
const formatDate = new Date().toLocaleDateString();
function App() {
  // some code...
}
```

4.使用`useMemo`缓存复杂的计算,如果依赖项频繁变化时则不考虑，应该考虑是否将计算放入`Web Worker`中处理。

```js
const expensiveValue = useMemo(() => expensiveComputation(data), [data]);
```

5.合理使用`useRef`,它不仅能保存对 DOM 元素的引用，还可以作为**组件生命周期内持久化的可变值存储容器**。修改 ref 值不会导致组件重新渲染，这在需要跨渲染周期保留数据或避免副作用依赖时很有用。

::: code-group

```jsx [存储旧值快照]
function Child({ value }) {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value; //更新value前保存旧值
  });
  return (
    <div>
      当前值: {value}, 上一次值: {valueRef.current}
    </div>
  );
}
```

```jsx [保存实例]
import * as echarts from 'echarts';
function EChartComponent() {
  const chartContainerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      if (instanceRef.current) {
        // 调用实例方法
      } else {
        // 实例化实例并保存到ref
        instanceRef.current = echarts.init(chartContainerRef.current);
      }
    }
  }, []);

  return <div ref={chartContainerRef}></div>;
}
```

```jsx [避免useEffect依赖项问题]
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count; // 同步最新值到 ref
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Latest count:", countRef.current); // 通过 ref 获取最新值
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 无需依赖 count

  return <button onClick={() => setCount((c) => c + 1)}>Increment</button>;
}
```

```jsx [控制组件是否首次渲染]
function MyComponent() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log("首次渲染");
    } else {
      console.log("非首次渲染");
    }
  });
}
```

:::

## 组件设计

1.解构`props`以减少重复代码，提高可读性。

2.区分组件类型，确保符合功能职责单一性原则。例如负责管理数据逻辑的容器组件，负责渲染数据的展示组件，负责处理用户交互的交互组件。

3.使用 Fragments 减少冗余 DOM。

## 副作用和性能优化

1.**不要过早地进行性能优化**，这是没有意义的。

2.避免滥用`useEffect`，这可能会对导致组件的不必要重新渲染，导致性能问题，还会降低组件的可读性和可维护性。派生状态优先使用`useMemo`或直接计算。

```js
// ✅ 推荐
const formattedDate = useMemo(() => formatData(rawData), [rawData]);

// ❌ 避免
const [formattedDate, setFormattedDate] = useState(0);
useEffect(() => {
  setFormattedDate(formatData(rawData));
}, [rawData]);
```

3.明确`useEffect`的依赖项，避免出现闭包问题和无限循环。

4.拆分副作用，将无关的逻辑放到不同的`useEffect`中。

```js
useEeffect(() => {
  /**初始化逻辑 */
}, []);
useEffect(() => {
  /**数据订阅 */
}, [data]);
```

5.即时清理副作用，避免内存泄露。

```js
useEffect(() => {
    const timer = setTimeout(() => {
        console.log('hello');
    }, 1000)
    })
    return () => clearTimeout(timer);
})
```

6.如果当前组件出现过多的`useEffect`,表明组件的逻辑耦合和职责过重，考虑按功能拆分自定义 Hook、依赖项相同的逻辑进行合并、抽取逻辑分离到子组件、复杂状态逻辑迁移到`useReducer`或状态管理库等方式。

7.尽量使用预定义函数，避免直接在子组件上写内联函数，这可能会导致子组件的不必要渲染。（原生 DOM 可以忽略）

```jsx
// 子组件因 onClick 引用变化而重渲染
const Child = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
));

function Parent() {
  return <Child onClick={() => console.log("Clicked")} />; // ❌ 每次渲染新建函数
}
```

8.不是所有的函数都需要`useCallback`缓存，只有函数被子组件使用（子组件使用`React.memo`优化）、函数作为依赖项、函数通过`Context`传递给深层组件时才需要缓存。**默认不使用`useCallback`，仅在性能优化时使用**。

9.合理使用`useLayoutEffect`,在它的副作用中执行耗时高开销的操作会阻塞渲染导致页面卡顿，仅在布局计算和同步 DOM 操作时使用。

## 代码组织和可维护性

1.按功能组织文件，一个组件一个文件夹，内含`index`文件、测试文件、类型定义文件、样式文件等。

2.组件采用 `PascalCase`命名方式，文件名采用 `kebab-case` 命名方式。

3.请默认使用 TypeScript，即使你不是很喜欢它。

4.使用枚举或策略模式代替复杂条件。

```jsx
const statusMap = {
  loading: <Spinner />,
  error: <ErrorPage />,
  success: <Content />,
};
return statusMap[status];
```

5.设置好错误边界以捕获错误，避免出现白屏。

6.使用`eslint`和`prettier`来统一代码风格和格式，并设置好`eslint`规则以提高代码质量。

7.不推荐使用`css-in-js`的方式来管理样式，请使用 CSS 预处理器、CSS Module 或者原子化 CSS。

8.合理使用第三方依赖，采用成熟的库来解决问题，同时避免对于的简单问题过度依赖第三方库而增加项目代码体积。

9.不要吝啬使用注释，每一个函数与变量都应该注明它的含义和用途。

10.命名要规范，不要使用拼音，尽量使用有意义的英文单词，让人容易理解。
