// event loop

// 1
// 2
// A
// 7
// 4
// B
// 8
// C
// 5
// 3
// 6

/**
 * 注意：
 * 整个js文件的同步代码的执行就是一个宏任务
 * 首先打印1
 * new Promise的回调是同步的，打印2
 * setTimeout是宏任务，100毫秒后将回调加入宏任务队列
 * resolve后，Promise.then()是微任务，将回调加入微任务队列
 * 函数声明不执行
 * 然后又是宏任务，50毫秒后将回调加入宏任务队列
 * 接着又是宏任务，200毫秒后将回调加入宏任务队列
 * 执行test函数 test函数是异步函数,await会阻塞下方的代码执行
 * 先打印A resolve后有Promise.then()，加入微任务队列
 * await实际上就是将后面的代码加入到微任务队列,test函数执行完毕
 * 遇见Promise.then()加入微任务队列
 * 宏任务结束 执行微任务队列
 * 由于先进先出 先打印4 再打印B 接着打印8 C
 * 微任务队列执行完毕 再查看宏任务
 * 根据加入宏任务队列的时间，打印 5 3 6
 */

console.log("1");

new Promise((resolve) => {
  console.log("2");
  setTimeout(() => {
    console.log("3");
  }, 100);
  resolve();
}).then(() => {
  console.log("4");
});

async function test() {
  await new Promise((resolve) => {
    console.log("A");
    resolve();
  }).then(() => console.log("B"));
  console.log("C");
}

// async/await 是语法糖 test函数等价于
// async function test() {
//   Promise.resolve(
//     Promise.resolve(console.log("A")).then(() => console.log("B"))
//   ).then(() => console.log("C"));
// }

setTimeout(() => {
  console.log("5");
}, 50);

setTimeout(() => {
  console.log("6");
}, 200);

test();
console.log("7");

Promise.resolve().then(() => {
  console.log("8");
});
