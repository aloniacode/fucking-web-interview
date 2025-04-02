function uniqueArray(arr) {
  return [...new Set(arr)];
}
// 优化版，可以处理元素是任何类型的数组
function uniqueArray2(arr) {
  const result = [];
  for (const item of arr) {
    // 检查是否已存在相同项（深度比较）
    if (!result.some((existing) => isDeepEqual(existing, item))) {
      result.push(item);
    }
  }
  return result;
}

// 深度比较两个值是否相等
function isDeepEqual(a, b) {
  // 处理基本类型 + NaN
  if (Object.is(a, b)) return true; // 包括 NaN === NaN
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => isDeepEqual(val, b[i]));
  }
  // 处理对象
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => isDeepEqual(a[key], b[key]));
}

// 测试
const arr = [
  1,
  2,
  2,
  { a: 1 },
  { a: 1 }, // 应该去重
  { a: 1, b: 2 },
  [3, 4],
  [3, 4], // 应该去重
  NaN,
  NaN, // 应该去重
];

console.log(uniqueArray2(arr));
