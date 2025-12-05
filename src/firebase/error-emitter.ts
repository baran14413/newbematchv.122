type EventMap = {
  'permission-error': (error: Error) => void;
};

class ErrorEmitter {
  private listeners: {
    [K in keyof EventMap]?: Array<EventMap[K]>;
  } = {};

  on<K extends keyof EventMap>(event: K, listener: EventMap[K]): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return () => {
      this.off(event, listener);
    };
  }

  off<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    const index = this.listeners[event]!.indexOf(listener);
    if (index > -1) {
      this.listeners[event]!.splice(index, 1);
    }
  }

  emit<K extends keyof EventMap>(
    event: K,
    ...args: Parameters<EventMap[K]>
  ): void {
    if (!this.listeners[event]) {
      return;
    }
    // @ts-ignore
    this.listeners[event]!.forEach((listener) => listener(...args));
  }
}

export const errorEmitter = new ErrorEmitter();
