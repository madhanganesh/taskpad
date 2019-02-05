class EventEmitter {
  subscribers = {};

  subscribe(event, subscriber) {
    if (this.subscribe[event] === undefined) {
      this.subscribe[event] = [];
    }
    this.subscribes[event].push(subscriber);
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(
        s => s !== subscriber
      );
    };
  }

  notify(event, payload) {
    const subscribers = this.subscribers[event];
    subscribers.forEach(s => s(payload));
  }
}

// Singleton
const eventEmitter = new EventEmitter();
export default eventEmitter;
