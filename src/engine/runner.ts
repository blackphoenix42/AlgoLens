import { useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/clamp";

export function useRunner(total: number, initialSpeed = 1) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [speed, setSpeed] = useState(initialSpeed); // steps / second
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const carry = useRef<number>(0); // fractional steps accumulator

  useEffect(() => {
    if (!playing) return;
    const loop = (t: number) => {
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      carry.current += dt * Math.max(0, speed);
      const steps = Math.floor(carry.current);
      if (steps > 0) {
        carry.current -= steps;
        setIdx((i) => {
          const next = clamp(i + direction * steps, 0, Math.max(total - 1, 0));
          if (next === 0 || next === Math.max(total - 1, 0)) setPlaying(false);
          return next;
        });
        last.current = t;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
      carry.current = 0;
    };
  }, [playing, speed, direction, total]);

  return {
    idx,
    setIdx,
    playing,
    setPlaying,
    direction,
    setDirection,
    speed,
    setSpeed,
    playForward: () => {
      setDirection(1);
      setPlaying(true);
    },
    playBackward: () => {
      setDirection(-1);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    stepNext: () => setIdx((i) => clamp(i + 1, 0, Math.max(total - 1, 0))),
    stepPrev: () => setIdx((i) => clamp(i - 1, 0, Math.max(total - 1, 0))),
    toStart: () => setIdx(0),
    toEnd: () => setIdx(Math.max(total - 1, 0)),
  };
}
