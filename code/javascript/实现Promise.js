class MyPromise {
  constructor(executor) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb(value));
      }
    };
    const reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullfilled, onRejected) {
    onFullfilled =
      typeof onFullfilled === "function" ? onFullfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        setTimeout(() => {
          try {
            const r = onFullfilled(this.value);
            this.resolvePromise(promise2, r, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const r = onRejected(this.reason);
            this.resolvePromise(promise2, r, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      if (this.status === "fulfilled") {
        handleFulfilled();
      } else if (this.status === "rejected") {
        handleRejected();
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise2;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }
    let called = false;
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      try {
        const then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        promises[i].then((value) => {
          result[i] = value;
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        }, reject);
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return;
      }
      promises.forEach((promise) =>
        MyPromise.resolve(promise).then(resolve, reject)
      );
    });
  }
}

const p1 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});
p1.then((res) => console.log(res)).then(8);
