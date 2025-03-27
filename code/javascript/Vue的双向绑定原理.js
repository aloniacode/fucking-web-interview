// Vue的双向绑定是通过数据劫持配合发布-订阅模式来实现的
// 1. 首先对响应式对象进行数据劫持，也就是劫持对象的基本操作，Vue2和Vue3在这方面的实现有所不同
// 2. 对象的每个属性都会有一个依赖收集器，它的目的是在对应属性更新时通知所有的订阅者从而实现视图更新

/**
 * Vue2版本的简易实现
 * @param {*} obj
 */
function observe(target) {
  if (!target) return;
  // 基础类型包装到一个对象中
  if (typeof obj !== "object" || obj !== null) {
    target = { value: target };
  }
  // 这里仅针对对象，不作对数组的处理，Vue2中重写了数组方法以支持数组类型的操作劫持
  Object.keys(target).forEach((key) => {
    const value = target[key];
    const dep = new Dep();

    Object.defineProperty(target, key, {
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return value;
      },
      set(newValue) {
        if (newValue === value) return;
        target[key] = newValue;
        dep.notify();
      },
    });
    observe(value);
  });
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}

// 观察者
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get(); //触发getter,添加自己到依赖
  }
  get() {
    Dep.target = this; //缓存自己
    // 触发getter
    const value = this.vm.data[this.exp]; // 触发getter
    Dep.target = null; // 清空缓存
    return value;
  }
  update() {
    const newValue = this.vm.data[this.exp];
    if (newValue !== this.value) {
      this.value = newValue;
      this.cb.call(this.vm, newValue);
    }
  }
}

// 双向绑定的实现就是v-model指令，它是v-bind和v-on指令组合的语法糖
// 简化版 v-model 实现
function compile(node, vm) {
  if (node.nodeType === 1) {
    // 元素节点
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].nodeName === "v-model") {
        const exp = attrs[i].nodeValue;
        node.value = vm.data[exp]; // 初始化值

        new Watcher(vm, exp, (value) => {
          node.value = value;
        });

        node.addEventListener("input", (e) => {
          vm.data[exp] = e.target.value;
        });
      }
    }
  }
}

/**
 * Vue3版本的实现借助Proxy更加强大，且不需要对数组类型进行特殊处理
 */
function reactive(data) {
  return new Proxy(data, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key); // 依赖收集
      return typeof res === "object" ? reactive(res) : res; // 深层代理
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 触发更新
      return res;
    },
  });
}
