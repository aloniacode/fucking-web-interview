// 扁平化数组
function flattenArray(arr) {
  if (!Array.isArray(arr)) return;
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result.push(...flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// 扁平化对象，对于数组不做处理
function flattenObject(obj, prefix = "") {
  if (Object.prototype.toString.call(obj) !== "[object Object]") return;
  const result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (Object.prototype.toString.call(value) === "[object Object]") {
        Object.assign(result, flattenObject(value, prefix + key + "."));
      } else {
        result[prefix + key] = value;
      }
    }
  }
  return result;
}
console.log(
  flattenObject({ a: 1, b: { c: 2, d: { e: 3 } }, f: [4, 5, { g: 6 }] })
);
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3, f: [ 4, 5, { g: 6 } ] }
