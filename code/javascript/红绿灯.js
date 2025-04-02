function red() {
  console.log("red");
}

function green() {
  console.log("green");
}

function yellow() {
  console.log("yellow");
}
function light(callback, wait) {
  return new Promise((res) => {
    setTimeout(() => {
      callback();
      res();
    }, wait);
  });
}

async function run() {
  return Promise.resolve()
    .then(() => light(red, 2000))
    .then(() => light(green, 2000))
    .then(() => light(yellow, 2000))
    .finally(() => run());
}

run();
