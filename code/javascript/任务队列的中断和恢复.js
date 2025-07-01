// Task Queue Interruption and Recovery
// 1. 依次执行一系列任务
// 2. 任务具有原子性，不可中断
// 3. 所有任务完成后才能得到所有任务的结果
// 4. 返回两个方法，start用于开始执行任务，pause用于暂停执行任务

// 思路： 数组存放任务，在Promise中执行所有任务，通过标识变量控制任务之间的执行

function processTask(tasks) {
  const runningTasks = [];

  let isRunning = false;

  let currentIndex = 0;

  function start() {
    return new Promise(async (resolve, reject) => {
      if (isRunning) return;

      isRunning = true;

      while (currentIndex < tasks.length) {
        const res = await tasks[currentIndex++]();
        runningTasks.push(res);
        if (!isRunning) break;
      }

      isRunning = false;
      resolve(runningTasks);
    });
  }

  function pause() {
    isRunning = false;
  }

  return { start, pause };
}

const tasks = [
  async () => {
    console.log("task1 start");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("task1 end");
    return "task1 result";
  },
  async () => {
    console.log("task2 start");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("task2 end");
    return "task2 result";
  },
  async () => {
    console.log("task3 start");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("task3 end");
    return "task3 result";
  },
];

const { start, pause } = processTask(tasks);
start().then((res) => {
  console.log(res);
  pause();
});
