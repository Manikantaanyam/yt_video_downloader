"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import MovieClip from "./YoutubePlayer";
import useDownloadVideo from "../hooks/useDownloadVideo";
import { TrimSliderProps } from "../types/youtube";

const SNAP_SECONDS = 1;
const HANDLE_WIDTH = 8;
const PIXELS_PER_TICK = 12;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`
    : `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

export default function TrimSlider({
  downloadType,
  url,
  videoId,
  duration,
}: TrimSliderProps) {
  const DURATION = Math.max(Number(duration), 1);

  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"left" | "right" | null>(null);

  const stateRef = useRef({ start: 0, end: DURATION });

  const [barWidth, setBarWidth] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [endSeconds, setEndSeconds] = useState(DURATION);
  const [hoverSeconds, setHoverSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setBarWidth(entries[0].contentRect.width);
    });
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    stateRef.current = { start: startSeconds, end: endSeconds };
  }, [startSeconds, endSeconds]);

  useEffect(() => {
    const onMove = (clientX: number) => {
      if (!draggingRef.current || !barRef.current || barWidth === 0) return;

      const rect = barRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, barWidth);
      let sec =
        Math.round(((x / barWidth) * DURATION) / SNAP_SECONDS) * SNAP_SECONDS;

      if (draggingRef.current === "left") {
        setStartSeconds(clamp(sec, 0, stateRef.current.end));
      } else {
        setEndSeconds(clamp(sec, stateRef.current.start, DURATION));
      }
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const onEnd = () => {
      draggingRef.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [barWidth, DURATION]);

  const totalTicks = Math.floor(barWidth / PIXELS_PER_TICK);
  const renderedTicks = useMemo(() => {
    return Array.from({ length: totalTicks }).map((_, i) => (
      <div
        key={i}
        className="absolute top-0 bottom-0 w-px bg-white/20"
        style={{ left: `${(i / totalTicks) * 100}%` }}
      />
    ));
  }, [totalTicks]);

  const startPx = (startSeconds / DURATION) * barWidth;
  const endPx = (endSeconds / DURATION) * barWidth;

  const { downloadVideo, loading } = useDownloadVideo({
    url,
    downloadType,
    startTime: startSeconds.toString(),
    endTime: endSeconds.toString(),
  });

  return (
    <div className="max-w-225 px-3 sm:px-6 mt-6 mb-3">
      <MovieClip videoId={videoId} start={startSeconds} end={endSeconds} />

      <div className="flex justify-between mt-4 text-sm sm:text-base font-mono text-black">
        <span>{formatTime(startSeconds)}</span>
        <span className="font-bold text-red-600">
          Duration: {formatTime(endSeconds - startSeconds)}
        </span>
        <span>{formatTime(endSeconds)}</span>
      </div>

      <div className="relative w-full">
        <div
          ref={barRef}
          onMouseMove={(e) => {
            const rect = barRef.current!.getBoundingClientRect();
            setHoverSeconds(
              Math.round(((e.clientX - rect.left) / barWidth) * DURATION)
            );
          }}
          onMouseLeave={() => setHoverSeconds(null)}
          className="relative w-full h-12 sm:h-14 mt-2 rounded-lg bg-linear-to-r from-[#2a0000] via-[#8b0000] to-[#2a0000] overflow-hidden cursor-pointer"
        >
          {renderedTicks}

          <div
            className="absolute top-0 h-full bg-red-500/30"
            style={{ left: startPx, width: endPx - startPx }}
          />

          <div
            className="absolute top-0 h-full bg-yellow-500 rounded-s-md cursor-ew-resize touch-none z-10"
            style={{ width: HANDLE_WIDTH, left: startPx - HANDLE_WIDTH / 2 }}
            onMouseDown={() => (draggingRef.current = "left")}
            onTouchStart={() => (draggingRef.current = "left")}
          />

          <div
            className="absolute top-0 h-full bg-yellow-500 rounded-e-sm cursor-ew-resize touch-none z-10"
            style={{ width: HANDLE_WIDTH, left: endPx - HANDLE_WIDTH / 2 }}
            onMouseDown={() => (draggingRef.current = "right")}
            onTouchStart={() => (draggingRef.current = "right")}
          />
        </div>

        {hoverSeconds !== null && (
          <div
            className="absolute -top-6 px-2 py-1 text-xs bg-black text-white rounded pointer-events-none"
            style={{
              left: `${(hoverSeconds / DURATION) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            {formatTime(hoverSeconds)}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={loading}
          onClick={downloadVideo}
          className="relative h-12 px-10 bg-red-600 hover:bg-red-800 text-white font-bold transition-all  rounded-md"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>
           save to device
          </span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
