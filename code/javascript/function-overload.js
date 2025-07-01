// JS中默认不支持函数重载，后定义的函数会直接覆盖已经定义的同名函数
// 我们可以通过自定义方法来简单实现函数重载

class FnOverload {
  fnMap = new Map();

  addImplement(paramsType, callback) {
    const key = paramsType.join(",");

    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }
    this.fnMap.set(key, callback);
  }

  exe(...args) {
    const key = args.map(arg => typeof arg).join(",");
    const fn = this.fnMap.get(key);

    if (!fn) {
      throw new Error("function is not found");
    }
    return fn.apply(this, args);
  }
}

const overload = new FnOverload();

overload.addImplement(["number"], (number) => {
  console.log(number);
});

overload.addImplement(["string", "string"], (str1, str2) => {
  console.log(str1, str2);
});

overload.exe(1)
overload.exe("hello","world")
