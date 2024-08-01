// 实现继承的几种方式

// 1. 原型链继承 缺点：子类的实例共享同一个原型，存在副作用

function Parent(name, age) {
  this.name = name;
  this.age = age;
}

function Child(gender) {
  this.gender = gender;
}
Child.prototype = new Parent();

const c1 = new Child();

console.log(c1);

// 2.构造函数继承 优缺点：父类的属性不会共享，但是父类的原型的属性和方法无法被继承

function Parent2(name) {
  this.name = name;
}
Parent2.prototype.getName = function () {
  return this.name;
};
function Child2(gender) {
  Parent2.call(this);
  this.gender = gender;
}
const c2 = new Child2();
console.log(c2);
console.log(c2.getName());

// 3. 组合继承 优缺点：结合原型链继承和构造函数继承，但是父类多构造了一次，造成性能开销

function Parent3(name) {
  this.name = name;
}
Parent3.prototype.getName = function () {
  return this.name;
};
function Child3(gender) {
  Parent3.call(this);
  this.gender = gender;
}

Child3.prototype = new Parent3();

Child3.prototype.constructor = Child3;

// 4.原型式继承 主要是借助Object.create()，以一个现有对象作为原型，创建一个新对象
//MDN文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// 缺点很明显： Object.create()是浅拷贝，多个实例的引用类型是共享的，存在副作用
const p = {
  name: "lee",
  age: 25,
  getName() {
    return this.name;
  },
};

const c4 = Object.create(p);
c4.name = "oliva";
console.log(c4.age);
console.log(c4.getName());

// 5. 寄生式继承 在原型式的基础上进行增强 可以添加额外的方法 但依旧存在改变原型式继承的缺点

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

console.log(c5.getName());
console.log(c5.getAge());

// 6. 寄生组合式继承 借助Object.create()方法在前面五种方法上优化 是最优的继承解决方式
// ES6中extends关键字的实现就是寄生组合式继承

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

console.log(c6);

// new 操作符
// 1.先创建一个空对象obj
// 2.将obj的原型设置为构造函数的原型
// 3.将构造函数的this设置为obj并执行构造函数
// 4.如果构造函数有返回值且返回值不是基本类型，则将返回值返回，否则返回obj
function A(name) {
  this.name = name;
  return 1;
}

const a = new A(123);
console.log(a);
