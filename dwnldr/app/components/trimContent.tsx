"use client";
import { useEffect, useRef, useState } from "react";

export default function TrimContent() {
  const DURATION = 600;
  const SNAP_SECONDS = 1;
  const TICK = 10;
  const [barWidth, setBarWidth] = useState(0);
  const [startSeconds, setStartSeconds] = useState(10);
  const [endSeconds, setEndSeconds] = useState(DURATION - 10);
  const [hoverSeconds, setHoverSeconds] = useState(null);
  const pixelsPerSecond = barWidth / DURATION;
  const totalLines = DURATION / TICK;

  const barRef = useRef(null);
  const draggingRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    setBarWidth(barRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    function onMouseMove(e) {
      if (!draggingRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let sec = x / pixelsPerSecond;
      sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;

      if (draggingRef.current === "left") {
        setStartSeconds(Math.max(0, Math.min(sec, endSeconds)));
      }

      if (draggingRef.current === "right") {
        setEndSeconds(Math.min(DURATION, Math.max(sec, startSeconds)));
      }
    }

    function onMouseUp() {
      draggingRef.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [startSeconds, endSeconds, pixelsPerSecond]);

  function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }

  function onBarClick(e) {
    const rect = barRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let sec = x / pixelsPerSecond;
    sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;

    const distanceStart = Math.abs(sec - startSeconds);
    const distanceEnd = Math.abs(sec - endSeconds);

    if (distanceStart < distanceEnd) {
      setStartSeconds(Math.min(sec, endSeconds));
    } else {
      setEndSeconds(Math.max(sec, startSeconds));
    }
  }

  function onBarMouseMove(e) {
    const rect = barRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let sec = x / pixelsPerSecond;
    sec = Math.round(sec / SNAP_SECONDS) * SNAP_SECONDS;
    setHoverSeconds(sec);
  }
  function onBarMouseLeave() {
    setHoverSeconds(null);
  }

  const startPx = startSeconds * pixelsPerSecond;
  const endPx = endSeconds * pixelsPerSecond;

  return (
    <div className="max-w-[600px] select-none mt-40 ml-90">
      <div className="flex justify-between mb-2 text-black font-mono">
        <span>{formatTime(startSeconds)}</span>
        <span>{formatTime(endSeconds)}</span>
      </div>
      <div
        onClick={onBarClick}
        ref={barRef}
        onMouseMove={onBarMouseMove}
        onMouseLeave={onBarMouseLeave}
        className="w-full h-14 rounded-md relative overflow-visible bg-linear-to-r from-[#2a0000] via-[#8b0000] to-[#2a0000]"
      >
        {Array.from({ length: totalLines }).map((_, i) => (
          <div
            className="absolute w-[1px] bg-white/20 top-0 bottom-0 h-full"
            style={{ left: `${i * TICK * pixelsPerSecond}px` }}
          />
        ))}

        <div
          className="absolute top-0 h-full bg-red-500/30"
          style={{ left: startPx, width: endPx - startPx }}
        />

        <div
          className="absolute w-1 h-full bg-white top-0 bottom-0 cursor-ew-resize"
          style={{ left: `${startSeconds * pixelsPerSecond}px` }}
          onMouseDown={() => (draggingRef.current = "left")}
        />

        <div
          className="absolute w-1 h-full bg-white top-0 bottom-0 cursor-ew-resize"
          style={{ left: `${endSeconds * pixelsPerSecond}px` }}
          onMouseDown={() => (draggingRef.current = "right")}
        />
        {hoverSeconds !== null && (
          <div>
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-yellow-400"
              style={{ left: `${hoverSeconds * pixelsPerSecond}px` }}
            />
            <div
              className="absolute -top-8 px-2 py-1 text-xs bg-black text-white rounded"
              style={{
                left: hoverSeconds * pixelsPerSecond,
                transform: "translateX(-50%)",
              }}
            >
              {formatTime(hoverSeconds)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
