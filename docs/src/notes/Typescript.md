# TypeScript

## 1.TypeScript的数据类型有哪些？

- boolean

- string

- number

- array

- object

- tuple ： 元组，表示已知元素数量和类型的数组，其中各个元素类型不必相同。赋值时要确保个数，位置和对应的类型都一致。

```ts
const a : [string,number,boolean];

a = ['a',1,true] // OK

a = [1,1,false] // Error

```

- enum ： 枚举： 对JavaScript基础数据类型的补充，使用枚举我们可以定义一些带名字的常量以及可以清晰地表达意图或创建一组有区别的用例。支持数字的和基于字符串的枚举。

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