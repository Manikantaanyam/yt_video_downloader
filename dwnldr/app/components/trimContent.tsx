"use client";

import { useEffect, useRef, useState } from "react";
import MovieClip from "./YoutubePlayer";

interface TrimSliderProps {
  videoId: string;
  duration: number; // seconds
}

const SNAP_SECONDS = 1;
const HANDLE_WIDTH = 10;
const PIXELS_PER_TICK = 12;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function TrimSlider({ videoId, duration }: TrimSliderProps) {
  const DURATION = Math.max(duration, 1);

  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"left" | "right" | null>(null);

  const [barWidth, setBarWidth] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [endSeconds, setEndSeconds] = useState(DURATION);
  const [hoverSeconds, setHoverSeconds] = useState<number | null>(null);

  /* ---------------- Resize Observer ---------------- */
  useEffect(() => {
    if (!barRef.current) return;

    const observer = new ResizeObserver(() => {
      if (barRef.current) setBarWidth(barRef.current.offsetWidth);
    });

    observer.observe(barRef.current);
    setBarWidth(barRef.current.offsetWidth);

    return () => observer.disconnect();
  }, []);

  /* ---------------- Drag Logic (Mouse + Touch) ---------------- */
  useEffect(() => {
    const onMove = (clientX: number) => {
      if (!draggingRef.current || !barRef.current || barWidth === 0) return;

      const rect = barRef.current.getBoundingClientRect();
      let x = clamp(clientX - rect.left, 0, barWidth);

      let sec = (x / barWidth) * DURATION;
      sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;

      if (draggingRef.current === "left") {
        setStartSeconds(clamp(sec, 0, endSeconds));
      } else {
        setEndSeconds(clamp(sec, startSeconds, DURATION));
      }
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const onEnd = () => (draggingRef.current = null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [barWidth, startSeconds, endSeconds, DURATION]);

  /* ---------------- Helpers ---------------- */
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

  const startPx = (startSeconds / DURATION) * barWidth;
  const endPx = (endSeconds / DURATION) * barWidth;

  /* ---------------- Bar Events ---------------- */
  const onBarClick = (e: React.MouseEvent) => {
    if (!barRef.current || barWidth === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    let x = clamp(e.clientX - rect.left, 0, barWidth);

    let sec = (x / barWidth) * DURATION;
    sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;

    if (Math.abs(sec - startSeconds) < Math.abs(sec - endSeconds)) {
      setStartSeconds(clamp(sec, 0, endSeconds));
    } else {
      setEndSeconds(clamp(sec, startSeconds, DURATION));
    }
  };

  const onBarMove = (e: React.MouseEvent) => {
    if (!barRef.current || barWidth === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    let x = clamp(e.clientX - rect.left, 0, barWidth);

    let sec = (x / barWidth) * DURATION;
    sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;
    setHoverSeconds(sec);
  };

  /* ---------------- Ticks ---------------- */
  const totalTicks = Math.floor(barWidth / PIXELS_PER_TICK);

  return (
    <div className=" max-w-[900px] px-3 sm:px-6 mt-6">
      <MovieClip videoId={videoId} start={startSeconds} end={endSeconds} />

      {/* Time Labels */}
      <div className="flex justify-between mt-4 text-sm sm:text-base font-mono text-black">
        <span>{formatTime(startSeconds)}</span>
        <span>{formatTime(endSeconds)}</span>
      </div>

      {/* Slider */}
      <div
        ref={barRef}
        onClick={onBarClick}
        onMouseMove={onBarMove}
        onMouseLeave={() => setHoverSeconds(null)}
        className="
          relative w-full h-12 sm:h-14 mt-2 rounded-lg
          bg-linear-to-r from-[#2a0000] via-[#8b0000] to-[#2a0000]
          overflow-hidden
        "
      >
        {/* Ticks */}
        {Array.from({ length: totalTicks }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-[1px] bg-white/20"
            style={{ left: `${(i / totalTicks) * barWidth}px` }}
          />
        ))}

        {/* Selected Range */}
        <div
          className="absolute top-0 h-full bg-red-500/30"
          style={{ left: startPx, width: endPx - startPx }}
        />

        {/* Handles */}
        <div
          className="absolute top-0 h-full bg-white cursor-ew-resize touch-none"
          style={{
            width: HANDLE_WIDTH,
            left: startPx - HANDLE_WIDTH / 2,
          }}
          onMouseDown={() => (draggingRef.current = "left")}
          onTouchStart={() => (draggingRef.current = "left")}
        />

        <div
          className="absolute top-0 h-full bg-white cursor-ew-resize touch-none"
          style={{
            width: HANDLE_WIDTH,
            left: endPx - HANDLE_WIDTH / 2,
          }}
          onMouseDown={() => (draggingRef.current = "right")}
          onTouchStart={() => (draggingRef.current = "right")}
        />

        {/* Hover Indicator */}
        {hoverSeconds !== null && (
          <>
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-yellow-400"
              style={{
                left: `${(hoverSeconds / DURATION) * barWidth}px`,
              }}
            />
            <div
              className="
                absolute -top-7 px-2 py-1 text-xs
                bg-black text-white rounded
                pointer-events-none
              "
              style={{
                left: `${(hoverSeconds / DURATION) * barWidth}px`,
                transform: "translateX(-50%)",
              }}
            >
              {formatTime(hoverSeconds)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
