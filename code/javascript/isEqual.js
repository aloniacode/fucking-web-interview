function isEqual(a, b) {
  // 处理基本类型和NaN
  if (Object.is(a, b)) return true;
  // 处理null和undefined
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }
  // 处理Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  // 处理RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }
  // 处理Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    return isEqual([...a], [...b]);
  }
  // 处理Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    return isEqual([...a], [...b]);
  }
  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => isEqual(item, b[i]));
  }
  // 处理对象
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => isEqual(a[key], b[key]));
  }
}
