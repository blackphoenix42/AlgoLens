export type WorkerFactory = () => Worker;

export class WorkerPool {
  private workers: Worker[] = [];
  constructor(private size: number, private factory: WorkerFactory) {
    for (let i = 0; i < size; i++) this.workers.push(factory());
  }

  run<T, R>(input: T): Promise<R> {
    const worker = this.workers.pop() || this.factory();
    return new Promise((resolve) => {
      worker.onmessage = (e) => {
        this.workers.push(worker);
        resolve(e.data as R);
      };
      worker.postMessage(input as any);
    });
  }
}
