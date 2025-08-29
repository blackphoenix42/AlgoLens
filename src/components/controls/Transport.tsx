type Props = {
  playing: boolean;
  direction: 1 | -1;
  onPlayForward: () => void;
  onPlayBackward: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToStart: () => void;
  onToEnd: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  idx: number;
  total: number;
  onSeek: (v: number) => void;
};

export default function Transport(p: Props) {
  const {
    playing,
    onPlayForward,
    onPlayBackward,
    onPause,
    onPrev,
    onNext,
    onToStart,
    onToEnd,
    speed,
    onSpeedChange,
    idx,
    total,
    onSeek,
  } = p;

  return (
    <div className="card flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 rounded border" onClick={onToStart}>
          |⟨
        </button>
        <button className="px-3 py-1 rounded border" onClick={onPrev}>
          ⟨
        </button>
        {playing ? (
          <button
            className="px-3 py-1 rounded bg-indigo-600 text-white"
            onClick={onPause}
          >
            Pause
          </button>
        ) : (
          <>
            <button
              className="px-3 py-1 rounded border"
              onClick={onPlayBackward}
            >
              ⏪
            </button>
            <button
              className="px-3 py-1 rounded bg-indigo-600 text-white"
              onClick={onPlayForward}
            >
              Play ▷
            </button>
          </>
        )}
        <button className="px-3 py-1 rounded border" onClick={onNext}>
          ⟩
        </button>
        <button className="px-3 py-1 rounded border" onClick={onToEnd}>
          ⟩|
        </button>
      </div>

      <div className="flex items-center gap-2 grow">
        <input
          className="w-full"
          type="range"
          min={0}
          max={Math.max(total - 1, 0)}
          value={idx}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        <div className="text-sm text-gray-600">
          {idx + 1}/{Math.max(total, 1)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Speed</label>
        <input
          type="range"
          min={0.1}
          max={10}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
        <input
          type="number"
          min={0.1}
          max={10}
          step={0.1}
          value={Number(speed).toFixed(1)}
          onChange={(e) =>
            onSpeedChange(Math.max(0.1, Math.min(10, Number(e.target.value))))
          }
          className="w-16 border rounded px-1 py-0.5 text-right"
          title="Steps per second (0.1–10)"
        />
        <div className="text-sm">×</div>
      </div>
    </div>
  );
}
