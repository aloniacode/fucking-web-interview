class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      // 支持异步回调
      this.events[eventName].forEach(async (callback) => {
        await callback(args);
      });
    }
  }
  off(eventName, callback) {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(callback);
      if (index > -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }
  once(eventName, callback) {
    const onceWrapper = (...args) => {
      callback(...args);
      this.off(eventName, onceWrapper);
    };
    this.on(eventName, onceWrapper);
  }
}

const eventEmitter = new EventEmitter();

function callback1(data) {
  console.log("callback1", data[0]);
}
function callback2(data) {
  console.log("callback2", data[0]);
}
function callback3(data) {
  console.log("callback3", data[0]);
}

eventEmitter.on("event", callback1);
eventEmitter.on("event", callback2);
eventEmitter.once("event", callback3);

eventEmitter.emit("event", "hello"); // callback1 hello callback2 hello

eventEmitter.off("event", callback1);

eventEmitter.emit("event", "world"); // callback2 world
