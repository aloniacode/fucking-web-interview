// 递归实现
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// 使用辅助栈，循环实现
function flatten2(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      stack.push(...current);
    } else {
      result.unshift(current); // 保持顺序
    }
  }
  return result;
}

console.log(flatten2([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
