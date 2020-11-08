class Event {
  constructor(callback, isOnce) {
    this.isOnce = isOnce || false;
    this.callback = callback;
  }
}

export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
      // code here
      if(!this.events[eventName]) {
        this.events[eventName] = [];
      }

      this.events[eventName].push(new Event(callback));
  }

  off(eventName, callback) {
      // code here
      this.events[eventName] = this.events[eventName]
        .filter(fn => fn === callback);
  }

  once(eventName, callback) {
      // code here
      if(!this.events[eventName]) {
        this.events[eventName] = [];
      }

      this.events[eventName].push(new Event(callback, true));
  }

  emit(eventName, ...args) {
      // code here
      let handlers = this.events[eventName];
      if(!handlers) return;

      handlers.forEach(event => {
        event.callback(...args);
      });

      this.events[eventName] = handlers.filter(event => {
        return !event.isOnce;
      });
  }
}