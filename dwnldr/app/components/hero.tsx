"use client";

import { useState } from "react";
import Content from "./content";
import useYoutubeInfo from "../hooks/useYoutubeInfo";
import { DownloadType } from "../types/youtube";
import { usePathname } from "next/navigation";
import TrimSlider from "./trimContent";

export default function Hero() {
  const path = usePathname();
  const [url, setUrl] = useState("");
  const [downloadType, setDownloadType] = useState<DownloadType>("video");
  const { getInfo, loading, error, data } = useYoutubeInfo();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="w-full flex flex-col items-center mt-6 sm:mt-10 gap-6">
        <h1 className="font-bold text-lg sm:text-2xl md:text-3xl lg:text-4xl text-center leading-tight tracking-tight">
          YOUTUBE {downloadType.toUpperCase()}{" "}
          {path === "/trim" ? "TRIMMER" : "DOWNLOADER"}
        </h1>

        <div className="relative flex w-48 sm:w-56 bg-black h-10 sm:h-12 rounded-full p-1 overflow-hidden shadow-lg">
          <div
            className={`absolute bg-red-600 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full transition-all duration-300 ease-in-out ${
              downloadType === "video" ? "left-1" : "left-[calc(50%+3px)]"
            }`}
          />
          <button
            onClick={() => setDownloadType("video")}
            className={`flex-1 z-10 text-xs sm:text-sm font-bold transition-colors ${
              downloadType === "video"
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            VIDEO
          </button>
          <button
            onClick={() => setDownloadType("audio")}
            className={`flex-1 z-10 text-xs sm:text-sm font-bold transition-colors ${
              downloadType === "audio"
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            AUDIO
          </button>
        </div>

        <div className="w-full max-w-3xl">
          <div className="flex items-center w-full bg-black rounded-full h-12 sm:h-14 overflow-hidden shadow-2xl">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              placeholder="Paste YouTube link here..."
              className="flex-1 min-w-0 bg-transparent outline-none px-5 sm:px-8 text-white text-sm sm:text-base placeholder:text-white/30"
              autoComplete="off"
            />
            <button
              onClick={() => getInfo(url)}
              disabled={loading || !url}
              className="relative h-full px-6 sm:px-12 bg-red-600 hover:bg-red-500 text-white font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Search
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 sm:mt-12 w-full">
        {error && (
          <p className="text-red-500 font-medium animate-pulse">{error}</p>
        )}

        {path === "/trim" && data ? (
          <TrimSlider
            key={data.videoId}
            url={url}
            downloadType={downloadType}
            videoId={data.videoId}
            duration={data.duration}
          />
        ) : (
          data && <Content url={url} data={data} downloadType={downloadType} />
        )}
      </div>
    </section>
  );
}
