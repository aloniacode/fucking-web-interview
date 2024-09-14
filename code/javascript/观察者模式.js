class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    this.observers = this.observers.filter((item) => item !== observer);
  }
  notifyObservers(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  update(data) {
    console.log(`${this.name}收到消息：${data}`);
  }
}
const subject = new Subject();
const observer1 = new Observer("observer1");
const observer2 = new Observer("observer2");
subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notifyObservers("hello"); // observer1收到消息：hello observer2收到消息：hello
