// 基础版本，没有考虑占位符的情况
function baseCurry(fn) {
  return function curriedFn(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curriedFn.apply(this, args.concat(nextArgs));
    };
  };
}

// 进阶版本，考虑占位符的情况

// 定义占位符
advancedCurry._ = Symbol("_");

function advancedCurry(fn) {
  return function curriedFn(...args) {
    if (args.length >= fn.length && !args.includes(advancedCurry._)) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      const mergedArgs = args.map((arg) =>
        arg === advancedCurry._ && nextArgs.length ? nextArgs.shift() : arg
      );
      return curriedFn.apply(this, mergedArgs.concat(nextArgs));
    };
  };
}

function add(a, b, c) {
    return a + b + c;
}
const newAdd = advancedCurry(add);
console.log(newAdd(1)(2)(3));
console.log(newAdd(1,advancedCurry._)(1)(3));
