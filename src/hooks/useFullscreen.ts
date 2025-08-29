import { useCallback, useEffect, useState } from "react";

export function useFullscreen<T extends HTMLElement>() {
  const [isFullscreen, setFS] = useState<boolean>(!!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const enter = useCallback((el: T | null) => {
    if (!el) return;
    if (document.fullscreenElement) return;
    el.requestFullscreen?.().catch(() => {});
  }, []);

  const exit = useCallback(() => {
    if (!document.fullscreenElement) return;
    document.exitFullscreen?.().catch(() => {});
  }, []);

  return { isFullscreen, enter, exit };
}
