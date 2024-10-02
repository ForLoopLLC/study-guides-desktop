declare module 'run-queue' {
    class RunQueue {
      constructor(options?: { maxConcurrency?: number });
      add(priority: number, task: () => Promise<void>): void;
      run(): Promise<void>;
    }
    export default RunQueue;
  }
  