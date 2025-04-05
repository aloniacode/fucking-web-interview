// compose function 从右向左执行，与pipe function相反
// 基础版
function compose(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduceRight(
    (acc, f) =>
      (...args) =>
        f(acc(...args))
  );
}

// 支持异步函数
function compose2(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduceRight(
    (acc, f) =>
      async (...args) =>
        await f(await acc(...args))
  );
}

// test
const add = (x) => x + 1;
const multiply = (x) => x * 2;
const addAndMultiply = compose(multiply, add);
console.log(addAndMultiply(2)); // 6
