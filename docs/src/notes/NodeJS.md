# NodeJS

## CommonJS 的本质是什么？

CommonJS 是 JavaScript 的模块化规范，它定义了模块的概念，通过模块可以将代码划分为多个逻辑单元，并通过 `require()` 和 `exports` 来导入和导出模块。

分析下面代码，使用`require()`导入这个文件后的结果是什么？

```js
// test.js
this.a = 1;
exports.b = 2;
exports = { c: 3 };
module.exports = {
  d: 4,
};
exports.e = 5;
this.f = 6;
```

理解 CommonJS 的本质主要是理解`require()`函数是如何工作的，它是 node 内部提供的函数，工作原理如下(使用 JS 代码模拟)：

1. 首先根据传入的模块路径获取模块完整的**绝对路径**作为模块的 id。

```js
const moduleId = getModuleId(modulePath);
```

2. 根据模块 id 判断是否有缓存，如果有缓存，则直接返回缓存的模块对象。

```js
if (moduleCache[moduleId]) {
  return moduleCache[moduleId];
}
```

3. 如果没有缓存，则运行模块，也就是将模块中的代码放到一个函数中执行。首先需要定义这个执行函数，`exports`参数初始化为一个空对象，`require`参数也就是当前这个`require`函数，`module`参数初始化为一个对象，它只有一个`exports`属性，`__filename`参数初始化为模块的绝对路径，`__dirname`参数初始化为模块所在的目录。这也就是为什么我们可以在模块中使用这些参（可以在模块中使用`arguments`对象来查看这些参数）。

```js
function _require(exports, require, module, __filename, __dirname) {
  // 用户书写的代码
}
```

4. 准备参数并运行执行函数。

```js
const module = {
  exports: {},
};
const exports = module.exports;
const __filename = moduleId;
const __dirname = getDirname(__filename);

_require.call(exports, exports, _require, module, __filename, __dirname);
```

5. 执行后缓存模块并返回`module.exports`对象。

```js
moduleCache[moduleId] = module.exports;

reutrn module.exports;
```

从流程和实现上来看，实际上`exports`、`this`，`module.exports`都是引用同一个对象,而导入模块是使用`module.exports`对象。因此，上文的代码分析结果就显而易见了。

```js
const test = require("./test.js");

console.log(test); // { d:4 }
```
