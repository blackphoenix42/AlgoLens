type Listener<T> = (payload: T) => void;

export class EventBus<Events extends Record<string, any>> {
  private map: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    this.map[event] = this.map[event] || [];
    this.map[event]!.push(fn);
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    this.map[event] = (this.map[event] || []).filter((f) => f !== fn);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    for (const fn of this.map[event] || []) fn(payload);
  }
}
