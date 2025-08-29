import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/clamp";

export function usePlayer(total: number, initialSpeed = 1) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [speed, setSpeed] = useState(initialSpeed);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const carry = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    const loop = (t: number) => {
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      carry.current += dt * Math.max(0, speed);
      let steps = Math.floor(carry.current);
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

export class Player {
  total: number;
  idx = 0;
  playing = false;
  direction: 1 | -1 = 1;
  speed = 1;
  private raf: number | null = null;
  private last = 0;
  private carry = 0;
  constructor(total: number) {
    this.total = total;
  }
  private loop = (t: number) => {
    if (!this.playing) return;
    if (!this.last) this.last = t;
    const dt = (t - this.last) / 1000;
    this.carry += dt * Math.max(0, this.speed);
    let steps = Math.floor(this.carry);
    if (steps > 0) {
      this.carry -= steps;
      this.idx = clamp(
        this.idx + this.direction * steps,
        0,
        Math.max(this.total - 1, 0)
      );
      this.last = t;
      if (this.idx === 0 || this.idx === Math.max(this.total - 1, 0)) {
        this.pause();
      }
    }
    this.raf = requestAnimationFrame(this.loop);
  };
  playForward() {
    this.direction = 1;
    this.play();
  }
  playBackward() {
    this.direction = -1;
    this.play();
  }
  play() {
    if (this.playing) return;
    this.playing = true;
    this.raf = requestAnimationFrame(this.loop);
  }
  pause() {
    this.playing = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.last = 0;
    this.carry = 0;
  }
  stepNext() {
    this.idx = clamp(this.idx + 1, 0, Math.max(this.total - 1, 0));
  }
  stepPrev() {
    this.idx = clamp(this.idx - 1, 0, Math.max(this.total - 1, 0));
  }
  toStart() {
    this.idx = 0;
  }
  toEnd() {
    this.idx = Math.max(this.total - 1, 0);
  }
  seek(v: number) {
    this.idx = clamp(v, 0, Math.max(this.total - 1, 0));
  }
  setSpeed(v: number) {
    this.speed = v;
  }
}
