# TypeScript

## TypeScript 的数据类型有哪些？

- boolean

- string

- number

- array

- object

- tuple ： 元组，表示已知元素数量和类型的数组，其中各个元素类型不必相同。赋值时要确保个数，位置和对应的类型都一致。

```ts
const a: [string, number, boolean];

a = ["a", 1, true]; // OK

a = [1, 1, false]; // Error
```

- enum ： 枚举： 对 JavaScript 基础数据类型的补充，使用枚举我们可以定义一些带名字的常量以及可以清晰地表达意图或创建一组有区别的用例。支持数字的和基于字符串的枚举。

```ts
// 初始化，后续成员自动递增；如果不初始化，默认从0开始递增
enum Colors = { Red = 1,Blue,Green }

const colorA = Colors.Red // 1
const colorB = Colors.Blue // 2

// 字符串枚举，由于没有自增，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。
enum Fruits = { Apple = 'apple', Banana = 'banana', Orange = 'orange'}

```

- null 和 undefined : 默认情况下它们是其他所有类型的子类型，也就是说可以将`null`或`undefined`赋值给其他类型的变量。

- void ： 用于标识方法返回值的类型，表示该方法没有返回值。

- never ： `never`是其他类型（包括`null`和`undefined`）的子类型，可以赋值给任何类型，代表从不会出现的值。但是没有类型是 `never`的子类型，这意味着声明`never`的变量只能被`never`类型所赋值。`never`类型一般用来指定那些总是会抛出异常、无限循环。

- any ：可以指定任何类型的值，在编程阶段还不清楚类型的变量指定一个类型，不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查，这时候可以使用`any`类型。

## Typescript 中的工具类型有哪些？它们有什么作用？

1. `Partial<T>`: 将类型 `T` 的所有属性变为可选。

2. `Required<T>`: 将类型 `T` 的所有属性变为必选。

3. `Readonly<T>`: 将类型 `T` 的所有属性变为只读。

4. `Record<K, T>`: 创建⼀个具有指定键类型 `K` 和值类型 `T` 的新对象类型。

5. `Pick<T, K>`: 从类型 `T` 中选择指定属性 `K` 形成新类型。

6. `Omit<T, K>`: 从类型 `T` 中排除指定属性 `K` 形成新类型。

7. `Exclude<T, U>`: 从类型 `T` 中排除可以赋值给类型 `U` 的类型。

8. `Extract<T, U>`: 从类型 `T` 中提取可以赋值给类型 `U` 的类型。

9. `NonNullable<T>`: 从类型 `T` 中排除 `null` 和 `undefined` 类型。

10. `ReturnType<T>`: 获取函数类型 `T` 的返回类型。

11. `Parameters<T>`: 获取函数类型 `T` 的参数类型组成的元组类型。

## 说说 TypeScript 中的类以及它的应用场景？

类（class）是 OOP 中实现信息封装的基础，传统的面向对象语言基本都是基于类的，而 JavaScript 基于原型的方式让开发者多了一些理解成本。在 ES6 之后，JavaScript 也引入了`class`关键字，虽然本质上还是构造函数，但在语法层面上更加贴近面向对象编程的思想。

JavaScript 虽然引入了类，但依然还有一些特性没有实现，例如修饰符和抽象类等，TypeScript 则弥补了这些不足，提供了完整的类特性支持。

- 继承：通过`extends`关键字实现类的继承。

- 修饰符：

  - public：默认修饰符，对外可见。
  - private：对外不可见，只能在类的内部访问。
  - protected：对外可见，但只能在类和其子类中访问。
  - readonly：只读属性，只能在声明时或构造函数中初始化。

- 静态属性：通过`static`关键字声明静态属性，这些属性存在于类本身，而不是类的实例上。访问这些属性需要通过`类名.属性名`的方式。我们知道在 JavaScript 中，类本质是一个构造函数，而函数本身就是一个对象，`static`声明的属性是直接挂载到函数对象之上，而类中其他的属性则是挂载到构造函数的原型对象上，因此实例可以访问到非静态属性，而静态属性只能通过类名来访问。例如 JavaScript 中的`Number.MAX_VALUE`。

```ts
class Student {
  static count = 0;
  constructor() {
    Student.count++;
  }
}
const s1 = new Student();
Student.count; // 1
```

- 抽象类：通过`abstract`关键字声明抽象类，抽象类不能被实例化，只能被继承。抽象类可以包含抽象方法，抽象方法不能有具体实现，需要由子类实现。抽象类可以包含属性和方法，属性和方法的具体实现由子类提供。

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earth...');
    }
}
}

class Dog extends Animal {
    makeSound(): void {
        console.log('woof woof!');
    }
}
```

**应用场景**： 虽然前端开发中函数式编程已经成为主流，但在一些场景下，类可以让我们更好地组织代码，提高代码的可维护性。例如前端中常见的几种设计模式：单例模式和发布-订阅模式等，使用类来实现更加简单直观，结构上也更加清晰。另外，亦可以使用类来编写组件，例如 React 中的类组件，不过现在更加推荐使用函数式组件。

## TypeScript 中装饰器是什么？它有什么应用场景？

装饰器是一种特殊类型的声明，它可以被附加到类，方法，访问符，属性或参数上，是一种在不改变原类和使用继承的情况下动态扩展对象的功能。本质上，它其实是`Object.defineProperty()`的语法糖。

::: tip 提示
要使用装饰器，需要在配置文件中开启：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators ": true
  }
}
```

:::

- 对类使用装饰器,实际就是将构造函数传入装饰器函数，然后对构造函数进行修改。

```ts
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}
@addAge
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const a = new Person("mike");
console.log(a.age); // 18
```

- 对方法/属性使用装饰器，此时装饰器函数接收三个参数，`target`是对象原型，`propertyKey`是方法/属性名，`descriptor`是属性描述符，它们实际上就是`Object.defineProperty()`的三个参数。

```ts
function property(target: any, propertyKey: string) {
  console.log(target, propertyKey);
}

function method(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(target, propertyKey, descriptor);
  descriptor.writable = false;
}

class Person {
  @property
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  @method
  sayHello() {
    console.log(`hello, ${this.name}`);
  }
}
```

- 对参数使用装饰器，此时装饰器函数接收三个参数，`target`是对象原型，`propertyKey`是参数名，`index`是参数索引。

```ts
function logger(target: any, propertyKey: string, index: number) {
  console.log(target, propertyKey, index);
}

class Person {
  say(@logger words: string) {
    console.log(words);
  }
}
```

- 装饰器工厂，可以接收参数，返回一个装饰器函数。

```ts
function addAge(age: number) {
  return function (constructor: Function) {
    constructor.prototype.age = age;
  };
}
@addAge(18)
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const a = new Person("mike");
console.log(a.age); // 18
```

当多个装饰器应用于一个声明上，将由上至下依次对装饰器表达式求值，求值结果会被当作函数（入栈），由下至上依次调用（出栈）。

```ts
function f() {
 console.log("f(): evaluated");
 return function (target, propertyKey: string, descriptor: PropertyDesc
riptor) {
 console.log("f(): called");
 }
}
function g() {
 console.log("g(): evaluated");
 return function (target, propertyKey: string, descriptor: PropertyDesc
riptor) {
 console.log("g(): called");
 }
}
class Person {
 @f()
 @g()
 sayHello() {}
}
// 输出：
// f(): evaluated
// g(): evaluated
// g(): called
// f(): called
```

应用场景：利用装饰器在不改变原有代码的前提下对类进行扩展的特性，可以便捷实现诸如日志记录，缓存，权限校验等功能，在提高重用性得同时也提高了代码的可读性和可维护性。
