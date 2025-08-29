export type Task = () => void;

export function raf(task: Task): () => void {
  let id = requestAnimationFrame(function loop() {
    task();
    id = requestAnimationFrame(loop);
  });
  return () => cancelAnimationFrame(id);
}

export function interval(task: Task, ms: number): () => void {
  const id = setInterval(task, ms);
  return () => clearInterval(id);
}
