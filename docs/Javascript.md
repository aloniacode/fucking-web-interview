# JavaScript Questions

## 1.有几种数据类型？

基本类型：String,Number,Boolean,Symbol,BigInt,Null,Undefined

引用类型：Array,Object,Function,Date,RegExp

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

## 10.什么是Promise?它的作用是什么？

## 11.什么是生成器（Generator）以及它在异步编程中如何被利用？

## 12.async/await关键字的作用是什么？它们和promise相比有什么优势和不同？

## 13.ES6中引入了对象的解构，它的本质/原理是什么？

## 14.深拷贝和浅拷贝的区别？

## 15.实现深拷贝的方法有哪些？

## 16.for...of和for...in的区别？

**for...in**：一般用于遍历对象的非Symbol**可枚举属性**以及**继承的可枚举属性**（来自原型链）,也就是说它会遍历原型。

**for...of**: 用于遍历**可迭代对象**，只要对象有`Symbol.iterator`属性并实现了相应的`Iterator`就能被遍历。例如内置的Array、Map、Set、String、TypedArray、函数的 arguments 对象、NodeList 对象等等。

> 因此， Set可以通过使用forEach、for...of、转为数组后遍历三种方式进行遍历。

