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
    <section className="w-full px-3 sm:px-6">
      <div className="w-full flex flex-col items-center mt-4 gap-4">
        <h1 className="font-semibold text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] text-center">
          YOUTUBE VIDEO / AUDIO DOWNLOADER
        </h1>

        <div className="relative flex w-44 sm:w-52 bg-black h-8 sm:h-10 rounded-full overflow-hidden">
          <div
            className={`absolute bg-red-600 w-1/2 h-full rounded-full transition-all duration-300 ${
              downloadType === "video" ? "left-0" : "left-1/2"
            }`}
          />

          <button
            onClick={() => setDownloadType("video")}
            className={`flex-1 z-10 text-xs sm:text-sm font-bold ${
              downloadType === "video" ? "text-white" : "text-white/70"
            }`}
          >
            VIDEO
          </button>

          <button
            onClick={() => setDownloadType("audio")}
            className={`flex-1 z-10 text-xs sm:text-sm font-bold ${
              downloadType === "audio" ? "text-white" : "text-white/70"
            }`}
          >
            AUDIO
          </button>
        </div>

        {/* Input Capsule */}
        <div className="w-full flex justify-center">
          <div
            className="
              flex items-center
              w-full max-w-3xl
              bg-black
              rounded-full
              h-10 sm:h-12
              overflow-hidden
            "
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              placeholder="enter the youtube video url here.."
              className="
                flex-1
                min-w-0
                bg-transparent
                outline-none
                px-4 sm:px-6
                text-white
                text-sm sm:text-base
              "
              autoComplete="off"
            />

            <button
              onClick={() => getInfo(url)}
              disabled={loading}
              className="
                relative
                h-full
                px-6 sm:px-10
                bg-red-600 hover:bg-red-500
                text-white
                font-semibold
                flex items-center justify-center
                transition-all
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-full
                shrink-0
              "
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Download
              </span>

              {loading && (
                <span className="absolute w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 w-full">
        {error && <p className="text-red-500">{error}</p>}

        {path === "/trim" && data ? (
          <TrimSlider videoId={data.videoId} duration={data.duration} />
        ) : (
          data && <Content url={url} data={data} downloadType={downloadType} />
        )}
      </div>
    </section>
  );
}
