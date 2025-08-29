self.onmessage = (e: MessageEvent<number[]>) => {
  const sorted = e.data.slice().sort((a, b) => a - b);
  (self as any).postMessage(sorted);
};
