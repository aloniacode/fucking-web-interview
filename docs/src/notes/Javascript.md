# JavaScript

## 1.有几种数据类型？

基本类型：String , Number , Boolean , Symbol , BigInt , Null , Undefined 。

引用类型：Array , Object , Function , Date , RegExp 。

> 实际上引用类型只有Object，Array,Function,Date,RegExp都是特殊的对象

## 2.什么是变量提升？它导致了哪些问题？

> MDN: 变量提升（Hoisting）被认为是，Javascript 中执行上下文（特别是创建和执行阶段）工作方式的一种认识。在 ECMAScript® 2015 Language Specification 之前的 JavaScript 文档中找不到变量提升（Hoisting）这个词。不过，需要注意的是，开始时，这个概念可能比较难理解，甚至恼人。

>例如，从概念的字面意义上说，“变量提升”意味着变量和函数的声明会在物理层面移动到代码的最前面，但这么说并不准确。实际上变量和函数声明在代码里的位置是不会动的，而是在编译阶段被放入内存中。

简而言之，变量提升（Hosting）是指变量和函数的声明会在它们被执行前“提升”到当前作用域的顶部，这意味着可以在声明之前访问这些变量和函数。

**为什么会有变量提升**？ 原因是js执行一段代码需要先编译，编译的过程中会生成对应的执行上下文，变量和函数的声明会保存到其中的变量对象中，代码执行的时候会从当前执行上下文的变量对象逐层往上（词法作用域规则）寻找变量和函数，直到全局执行上下文。

导致的问题：

1. 变量的意外覆盖。如果在变量声明之前使用了同名的变量，由于变量提升，导致其他变量被覆盖，造成逻辑问题。

2. 代码可读性差。

3. 维护困难。

## 3.var、let、const之间的区别？

1. var声明的变量存在变量提升，而let和const则没有。

2. var声明的变量没有块级作用域，let和const声明的变量具有块级作用域。

3. var和let用于声明变量，而const用于声明常量,声明后不可修改（如果是引用类型，地址不可修改，但内部可修改）。

4. var声明的变量可以重复声明，不会报错，而let和const则不行。

> 优先使用const，如果变量需要修改则使用let,尽量避免使用var

## 4.什么是作用域链？

作用域链是在JavaScript中用于解析标识符（变量名、函数名等）的一种机制。在JavaScript中，每个函数都有自己的作用域，作用域链是由嵌套的作用域构成的链式结构，用于确定标识符的查找顺序。

当代码在函数内部引用一个变量时，JavaScript引擎会首先在当前函数的作用域中查找该变量。如果找不到，它会沿着作用域链向上一级作用域查找，直到找到该变量或达到全局作用域。如果在全局作用域中仍然找不到，则会抛出 ReferenceError 错误。

作用域链的形成是由函数创建时确定的，它基于函数定义时所处的位置来决定。当函数被创建时，它会“记住”自己被创建时所处的作用域链，包括它所在的函数作用域和全局作用域。

作用域链的机制保证了在JavaScript中变量的访问顺序，它使得内部函数可以访问外部函数的变量，但外部函数无法访问内部函数的变量。这种机制也是闭包（Closure）能够正常工作的基础之一。

## 5.说一下原型以及原型链？为什么它们被设计在JavaScript中？

在JavaScript中，每个对象都有一个原型（prototype），原型是一个对象，包含可供其他对象继承的属性和方法。通过原型，对象可以共享属性和方法，实现属性和方法的复用，节省内存空间。

原型链是一种对象之间的关系链，通过原型链，对象可以访问其他对象的属性和方法。原型链实现了对象之间的继承关系，使得子对象可以继承父对象的属性和方法。

它们被设计的主要原因就是**实现面向对象编程**。原型链允许动态地添加、修改原型对象的属性和方法，从而实现动态继承和多态性。


## 6.JS中如何实现继承？

有六种方式实现继承，分别是原型链继承、构造函数继承、组合继承、原型式继承、寄生式继承、寄生组合式继承。如果按照实现方式划分，这种六种可以依据是否使用`Object.create`而分为两类。

1. 原型链继承。

缺点：子类的实例共享同一个原型，存在副作用。

```js
function Parent() {
    this.name = 'Parent';
}

function Child() {
    this.age = 10;
}

Child.prototype = new Parent();

var child = new Child();
console.log(child.name); // 输出：Parent
```

2. 构造函数继承。

优缺点：父类的属性不会共享，但是父类的原型的属性和方法无法被继承。

```js
function Parent(name) {
    this.name = name;
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

var child = new Child('Child', 10);
console.log(child.name); // 输出：Child
```
3. 组合继承。

优缺点：结合原型链继承和构造函数继承，但是父类多构造了一次，造成性能开销。

```js
function Parent(name) {
    this.name = name;
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = new Parent();

var child = new Child('Child', 10);
console.log(child.name); // 输出：Child
```

4. 原型式继承。

主要是借助Object.create()，以一个现有对象作为原型，创建一个新对象。缺点很明显，`Object.create`是浅拷贝，多个实例的引用类型是共享的，存在副作用。

```js
const p = {
  name: "lee",
  age: 25,
  getName() {
    return this.name;
  },
};

const c4 = Object.create(p);
c4.name = "oliva";
console.log(c4.age) // 25
console.log(c4.getName()); // oliva
```
5. 寄生式继承。

在原型式的基础上进行增强，可以添加额外的方法，但依旧存在改变原型式继承的缺点。

```js
const p2 = {
  name: "lee",
  age: 25,
  getName() {
    return this.name;
  },
};

function clone(original) {
  const instance = Object.create(original);
  instance.getAge = function () {
    return this.age;
  };
  return instance;
}
const c5 = clone(p2);

console.log(c5.getName()); // lee
console.log(c5.getAge()); // 25
```

6. 寄生组合式继承。

借助`Object.create`方法在前面五种方法上优化，是最优的继承解决方式。

```js
function clone2(parent, child) {
  child.prototype = Object.create(parent);
  child.prototype.constructor = child;
}

function Parent6() {
  this.name = "parent6";
  this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
  return this.name;
};
function Child6() {
  Parent6.call(this);
  this.friends = "child5";
}

clone2(Parent6, Child6);

Child6.prototype.getAge = function () {
  return this.age;
};

const c6 = new Child6();
console.log(c6.play); // [1,2,3]
```
> ES6中extends关键字的实现就是寄生组合式继承

## 7.防抖和节流的区别？如何实现？应用场景有哪些？

防抖： 一段时间后执行操作，若这段时间内重复触发，则重新计时。

节流： 一段时间内频繁触发的操作，只执行一次。

**防抖函数-不立即执行**：

```js
function debounce(func, wait) {
    let timeout;
    return function () {
        let context = this; // 保存this指向
        let args = arguments; // 拿到event对象
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

**防抖函数-立即执行**：

```js
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout); // timeout 不为null
        if (immediate) {
            let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(function () {
                timeout = null;
            }, wait)
            if (callNow) {
                func.apply(context, args)
            }
        }else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
    }
}
```

**节流函数-时间戳写法**：事件会立即执行，停止触发后无法再次执行。

```js
function throttled(fn, delay = 500) {
    let oldtime = Date.now()
    return function (...args) {
        let newtime = Date.now()
        if (newtime - oldtime >= delay) {
            fn.apply(null, args)
            oldtime = Date.now()
        }
    }
}

```

**节流函数-定时器写法**：delay毫秒后第一次执行，第二次事件停止触发后依然会再一次执行。

```js
function throttled(fn, delay = 500) {
    let timer = null
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
            }, delay);
        }
    }
}
```

**使用时间戳和定时器一起实现的更加精确的节流函数**：

```js
function throttled(fn, delay) {
    let timer = null
    let starttime = Date.now()
    return function () {
        let curTime = Date.now() // 当前时间
        let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if (remaining <= 0) {
            fn.apply(context, args)
            starttime = Date.now()
        } else {
            timer = setTimeout(fn, remaining);
        }
    }
}
```

## 8.什么是闭包？它有什么作用/应用场景？

> MDN: 闭包（closure）是一个函数以及其捆绑的周边环境状态（lexical environment，词法环境）的引用的组合。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。在 JavaScript 中，闭包会随着函数的创建而被同时创建。

简单来说： 闭包就是可以访问其他作用域中变量的函数。

应用场景：

1. 闭包可以延长变量的生命周期，使其不会被垃圾回收机制回收掉。

2. 借助闭包可以模拟实现变量和方法的私有化。

3. 函数柯里化。

4. 解决循环中的作用域问题：在循环中使用闭包可以解决作用域问题，避免由于作用域链导致的变量共享问题。

```js
const funcArr = []

for(var i = 0; i < 3; i++){
  funcArr[i] = function () {
    console.log(i);
  };
}
funcArr[0]() // 3
funcArr[1]() // 3
funcArr[2]() // 3

```
这里的i是全局变量，循环结束时i=3, 根据作用域链查找，每个函数打印的i都是上层作用域中的i，这不是我们预期的结果。

有两种方法解决：：

```js
// 自执行函数+闭包

const funcArr = []

for(var i = 0; i < 3; i++){
  (function(j){
      setTimeout(funcArr[j] = function () {
        console.log(j);
      }, 0)
  })(i)
}
funcArr[0]() // 3
funcArr[1]() // 3
funcArr[2]() // 3
```
另一种是使用let替换var，let具有块级作用域，三个私有作用域互不干扰。

## 9.如何解决“回调地狱”问题？

"回调地狱"是指多层嵌套的回调函数导致代码难以维护和理解的情况。为了解决回调地狱问题，可以采用以下几种方法：

1. 使用 Promise 对象：Promise 是一种用于处理异步操作的对象，它可以更清晰地表达异步操作的状态和结果。通过使用 Promise，可以避免多层嵌套的回调函数，将异步操作串联起来，使代码更易读。

2. 使用 async/await：async/await 是 ES2017 引入的异步编程新特性，用于更简洁地处理异步操作。async 函数返回一个 Promise 对象，await 可以暂停 async 函数的执行，等待 Promise 对象的状态改变。使用 async/await 可以让异步代码看起来像同步代码，避免回调地狱。

3. 使用事件监听：将异步操作封装成事件，通过事件监听器来处理异步操作的结果，可以减少回调函数的嵌套。这种方式适用于需要处理多个异步操作结果的情况。

4. 模块化和拆分功能：将复杂的功能拆分成多个小的模块或函数，每个模块只负责一个特定的功能，避免在一个函数中处理过多的逻辑和嵌套。

5. 使用第三方库：一些第三方库如`RxJS`、`Async.js`等提供了更多的工具和方法来处理异步操作，可以帮助简化异步代码的书写。

## 10.什么是Promise?它的作用是什么？

Promise表示异步操作最终的完成（或失败）以及其结果值，它基于`Promise A+`规范实现，即一个`Promise`对象必须有`then`方法。

> MDN: 一个 Promise 是一个代理，它代表一个在创建 promise 时不一定已知的值。它允许你将处理程序与异步操作的最终成功值或失败原因关联起来。这使得异步方法可以像同步方法一样返回值：异步方法不会立即返回最终值，而是返回一个 promise，以便在将来的某个时间点提供该值。

`Promise`必然处于以下几种状态之一：

- 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。

- 已兑现（fulfilled）：意味着操作成功完成。

- 已拒绝（rejected）：意味着操作失败。

当状态发生改变时（成功或者失败），就会立即调用`then`方法。如果一个 Promise 已经被兑现或拒绝，即不再处于待定状态，那么则称之为已敲定（settled）。

作用：

1. 解决回调地狱： `Promise`可以避免回调地狱（callback hell）的问题，即多层嵌套的回调函数导致代码难以维护和理解的情况。通过使用 Promise，可以将异步操作串联起来，使代码更易读。

2. 更清晰的异步操作表示: `Promise`对象通过三种状态可以更清晰地表示异步操作的状态和结果。

3. 支持链式调用： `Promise`支持链式调用，可以在多个异步操作之间依次进行处理，使代码更加简洁和可读。

4. 统一的错误处理机制：`Promise`提供了统一的错误处理机制，通过链式调用的方式可以在一处捕获所有异步操作的错误，提高了代码的可维护性。

5. 与其他异步操作的整合：`Promise`可以与其他异步操作（如定时器、事件等）进行整合，使异步操作的处理更加灵活和统一。

总的来说，Promise 的作用是提供一种更优雅、更清晰、更可靠的方式来处理异步操作，使异步代码的编写和维护更加容易。

## 11.什么是生成器（Generator）以及它在异步编程中如何被利用？

生成器（Generator）是 ES6 中引入的一种特殊类型的函数，它可以在函数执行过程中暂停，并且可以在暂停的地方恢复执行。生成器通过使用 `function*`关键字来定义，内部使用 ` yield `关键字来暂停函数的执行并返回一个值。

在异步编程中，生成器可以与`Promise`结合使用，以实现更灵活的异步操作。通过生成器函数和`yield`关键字，可以编写更清晰、易读的异步代码，避免回调地狱和复杂的`Promise`链式调用。

生成器在异步编程中的主要优点包括：

- 简化异步代码：生成器可以让异步代码看起来像同步代码，通过`yield`关键字暂停函数执行，等待异步操作的结果，使代码更易读、易维护。

- 更灵活的控制流：生成器允许在函数执行过程中暂停和恢复，可以在需要的时候控制代码的执行流程，实现更复杂的异步操作。

- 避免回调地狱：生成器结合 Promise 可以避免回调地狱，使异步代码更加清晰和结构化。

生成器在异步编程中的典型用法是配合 Promise 使用，通过生成器函数和 yield 关键字来简化异步操作的处理。下面是一个简单的示例，演示了生成器在异步编程中的应用：

```js
function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Data fetched');
        }, 2000);
    });
}

function* asyncOperation() {
    try {
        const data = yield fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

// 执行生成器函数
const generator = asyncOperation();
const promise = generator.next().value;

promise.then(result => {
    generator.next(result);
});

```

在这个示例中，`asyncOperation`函数是一个生成器函数，通过`yield`关键字暂停函数执行，等待`Promise`返回结果。通过配合`Promise`，可以实现异步操作的控制流程。生成器在异步编程中提供了一种更清晰、更灵活的解决方案，使异步代码更易于编写和理解。

## 12.async/await关键字的作用是什么？它们和promise相比有什么优势和不同？

> MDN: async/await的目的在于简化使用基于 promise 的 API 时所需的语法。async/await 的行为就好像搭配使用了生成器和 promise。

`async/await`是`ES2017`引入的异步编程语法，用于更简洁、易读地编写异步代码。它的作用是简化异步操作的处理，使代码看起来更像同步代码，提高代码的可读性和可维护性。

`async`函数是用来定义一个返回`Promise`对象的异步函数，函数内部可以使用`await`关键字来暂停异步函数的执行，等待`Promise`对象的状态改变。当`await`后面的`Promise`对象状态变为`resolved`时，`await`表达式的值就是`Promise`的解决值，然后程序继续执行。


相比于直接使用`Promise`，`async/await`有以下优势和不同之处：

优势：

- 更清晰的代码结构：`async/await`让异步代码看起来更像同步代码，使代码结构更清晰，更易于理解和维护。

- 更容易处理错误：使用`try/catch`结构可以更容易地捕获和处理异步操作中的错误。

- 更好的错误堆栈：`async/await`可以提供更好的错误堆栈信息，帮助定位问题。

不同之处：

- 语法：`async/await`是基于语法糖的方式，相比于直接使用 Promise 更简洁。

- 执行顺序：`async/await`可以使异步代码看起来像同步代码一样顺序执行，而不需要使用回调函数或链式调用。

- 错误处理：使用`try/catch`可以更方便地处理`async/await`中的错误，而使用`Promise`需要通过`.catch()`方法来处理错误。

总的来说，`async/await`提供了更优雅、更直观的方式来处理异步操作，使代码更易读、易维护，并且在处理异步操作时更容易处理错误。

## 13.ES6中引入了解构赋值，它的本质/原理是什么？


解构赋值是通过模式匹配的方式来进行赋值操作。当进行对象或数组的解构赋值时，JavaScript 引擎会根据解构的模式和待解构的对象或数组的结构进行匹配，然后将对应的值赋给指定的变量。

> MDN: 数组解构调用右侧的迭代协议。因此，任何可迭代对象（不一定是数组）都可以解构。

对于任何可迭代对象（不一定是数组），它们之所以可以进行解构赋值，是因为 JavaScript 中的解构赋值机制是基于迭代器协议（Iterator Protocol）实现的。迭代器协议定义了一个`next()`方法，用于在对象上进行迭代，每次调用`next()`方法都会返回一个包含 value 和 done 属性的对象。value 表示当前迭代的值，done 表示迭代是否结束。

当对一个可迭代对象进行解构赋值时，JavaScript 引擎会自动调用该对象的迭代器（即 `Symbol.iterator` 方法），然后根据迭代器返回的值进行解构赋值操作。这使得除了数组外，其他实现了迭代器协议的对象（比如 Set、Map、字符串等）也可以进行解构赋值。


## 14.深拷贝和浅拷贝的区别？

- 浅拷贝：浅拷贝是指创建一个新的对象或数组，新对象的属性或元素和原对象相同，但属性值或元素的引用仍然指向原对象中的值。换句话说，浅拷贝只复制对象或数组的第一层结构，而不会复制嵌套的对象或数组。

- 深拷贝：深拷贝是指创建一个新的对象或数组，并且递归地复制原对象或数组的所有嵌套对象和数组，确保新对象与原对象完全独立，互不影响。

## 15.实现深拷贝的方法有哪些？

1. 递归实现。通过递归遍历对象或数组的所有属性，对每个属性进行复制。这种方法可以处理任意深度的嵌套结构，但需要注意处理循环引用的情况。

2. JSON 序列化与反序列化：利用 JSON.stringify 将对象序列化为 JSON 字符串，再用 JSON.parse 将 JSON 字符串反序列化为新的对象。这种方法简单易用，但无法处理特殊类型如函数、正则表达式等，同样对于循环引用的情况不适用。

3. 使用第三方库：一些第三方库如 Lodash 的 `_.cloneDeep()` 方法可以实现深拷贝，且处理了更多特殊情况，如循环引用、Symbol 类型等。

4. 使用`structuredClone` API，它是Web API之一，无法处理特殊类型如函数、正则表达式等。它不是JavaScript语言本身的特性——相反，它是浏览器和任何其他实现了`window`这样全局对象的JavaScript运行时的一个特性。

## 16.for...of和for...in的区别？

**for...in**：一般用于遍历对象的非Symbol**可枚举属性**以及**继承的可枚举属性**（来自原型链）,也就是说它会遍历原型。

**for...of**: 用于遍历**可迭代对象**，只要对象有`Symbol.iterator`属性并实现了相应的`Iterator`就能被遍历。例如内置的Array、Map、Set、String、TypedArray、函数的 arguments 对象、NodeList 对象等等。

> 因此， Set可以通过使用forEach、for...of、转为数组后遍历三种方式进行遍历。

## 17. Proxy和Object.defineProperty的区别是什么？


> MDN: Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

我们在对对象进行操作时实际上调用的都是对象内部的方法，也就是对象的基本操作。例如：

```js
const obj = {}

obj.name // [[GET]]

obj.name = "foo" // [[SET]]

Object.setPrototypeOf(obj,{age: 10}) // [[SetPrototypeOf]]

for (const key in obj) {} // [[OwnPropertyKeys]]

```
而在众多的基本操作中就包含了`[[DefineOwnProperty]]`基本操作，因此`Proxy`和`Object.defineProperty`的本质区别在于`Proxy`是用于拦截或自定义对象的基本操作，`Object.defineProperty`只是对象的一个基本操作。

**Note**: 由于`Object.defineProperty`功能性远不如`Proxy`，这也导致了Vue2中使用`Object.defineProperty`对一些操作的监听拦截是无效的，例如往数组中push元素（Vue2通过自定义数组的原型来解决）。


