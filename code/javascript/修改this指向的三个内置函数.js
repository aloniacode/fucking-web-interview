// call 会以给定的this值和多个参数来立即调用函数
Function.prototype.call = function (context, ...args) {
  // 非严格模式下null和undefined会被转换成全局对象
  context = context || window;
  // 将当前函数上下文对象this作为context的一个属性，使用Symbol避免冲突
  const fn = Symbol("fn");
  context[fn] = this;
  // 调用函数
  const result = context[fn](...args);
  // 删除临时属性
  delete context[fn];
  return result;
};
// apply和call类似，区别在于参数以数组的形式传入
Function.prototype.apply = function (context, args) {
    if (!Array.isArray(args)) {
        throw new TypeError("参数必须为数组");
    }
    // 非严格模式下null和undefined会被转换成全局对象
    context = context || window;
    // 将当前函数上下文对象this作为context的一个属性，使用Symbol避免冲突
    const fn = Symbol("fn");
    context[fn] = this;
    // 调用函数
    const result = args ? context[fn](...args) : context[fn]();
    // 删除临时属性
    delete context[fn];
    return result;
}
// bind和call/apply不同，它不立即执行函数，而是返回一个绑定了this的新函数
// 接受一个this指向对象和多个用于插入到绑定函数的参数
Function.prototype.bind = function (context, ...args) {
  const originalFn = this;
  return function (...callArgs) {
    // 如果是作为构造函数调用，则忽略绑定的this
    if(new.target){
        return new originalFn(...args,...callArgs);
    }
    // 以下逻辑可以使用call代替
    // 非严格模式下null和undefined会被转换成全局对象
    context = context || window;
    // 使用绑定的this
    const fn = Symbol("fn");
    context[fn] = originalFn;
    const result = args ? context[fn](...args,...callArgs) : context[fn](...callArgs);
    // 删除临时属性
    delete context[fn];
    return result;
  };
};