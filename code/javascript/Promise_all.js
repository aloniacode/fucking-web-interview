Promise.myAll = function (promises) {
  if (!promises[Symbol.iterator]) {
    return Promise.reject(new TypeError("Promises must be iterable"));
  }
  let resolve, reject;

  const p = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const results = [];
  let index = 0;
  for (const p of promises) {
    const currentIndex = index;
    index++;
    Promise.resolve(p).then((res) => {
      results[currentIndex] = res;
      index--;
      if (index === 0) resolve(results);
    }, reject);
  }
  if (index === 0) resolve(results);
  return p;
};

Promise.myAll(new Set(["a", "b",Promise.reject(),1]))
  .then((res) => console.log(res))
  .catch((err) => console.error(err)); // []
