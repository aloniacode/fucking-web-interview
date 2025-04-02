function cloneDeep(source, map = new WeakMap()) {
  // 判断参数类型
  if (typeof source !== "object" || source === null) return source;
  // 处理循环引用，使用缓存
  if (map.has(source)) return map.get(source);
  const result = Array.isArray(source) ? [] : {};
  map.set(source, result);
  // 使用for...of和Object.hasOwnProperty会丢失Symbol属性，使用Reflect.ownKeys更合适
  for (const key of Reflect.ownKeys(source)) {
    result[key] = cloneDeep(source[key], map);
  }
  return result;
}

// 优化版,适用循环避免栈溢出
function cloneDeep2(source) {
  // 基本类型直接返回
  if (typeof source !== "object" || source === null) return source;
  // 初始化根对象
  const root = Array.isArray(source) ? [] : {};
  // 使用栈保存待处理的对象
  const stack = [
    {
      source,
      target: root,
    },
  ];
  // 使用 WeakMap 缓存已拷贝的对象（处理循环引用）
  const map = new WeakMap();
  map.set(source, root);

  while (stack.length > 0) {
    const { source, target } = stack.pop();

    // 遍历所有自有属性（包括 Symbol 和不可枚举属性）
    for (const key of Reflect.ownKeys(source)) {
      const value = source[key];
      // 基本类型直接赋值
      if (typeof value !== "object" || value === null) {
        target[key] = value;
      } else {
        // 检查是否已缓存（处理循环引用）
        if (map.has(value)) {
          target[key] = map.get(value);
        } else {
          // 初始化新对象/数组
          const newValue = Array.isArray(value) ? [] : {};
          target[key] = newValue;
          map.set(value, newValue);
          // 加入栈，待后续处理
          stack.push({
            source: value,
            target: newValue,
          });
        }
      }
    }
  }
  return root;
}

const obj = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4, 5],
  },
  e: null,
  g: Symbol("hello"),
};
obj.f = obj;

const o2 = [
  {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, 5],
    },
  },
];

console.log(cloneDeep2(obj));
