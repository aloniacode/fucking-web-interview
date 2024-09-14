class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => {
                listener(args);
            });
        }
    }
    off(event, listener) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(listener);
            if (index > -1) {
                this.events[event].splice(index, 1);
            }
        }
    }
}

const eventEmitter = new EventEmitter();

function listener1(data) {
    console.log('listener1', data[0]);
}
function listener2(data) {
    console.log('listener2', data[0]);
}

eventEmitter.on('event', listener1);
eventEmitter.on('event', listener2);

eventEmitter.emit('event', 'hello'); // listener1 hello listener2 hello

eventEmitter.off('event', listener1);

eventEmitter.emit('event', 'world'); // listener2 world