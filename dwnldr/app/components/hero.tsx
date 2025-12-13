"use client";

import { useState } from "react";
import Content from "./content";
import useYoutubeInfo from "../hooks/useYoutubeInfo";
import { DownloadType } from "../types/youtube";

export default function Hero() {
  const [tag, setTag] = useState(true);
  const [url, setUrl] = useState("");
  const [downloadType, setDownloadType] = useState<DownloadType>("video");

  const { getInfo, loading, error, data } = useYoutubeInfo();

  return (
    <section>
      <div className="w-full flex flex-col justify-center items-center mt-3 gap-4">
        <div>
          <h1 className="font-semibold text-[14px] md:text-[22px] lg:text-[26px]">
            YOUTUBE VIDEO / AUDIO DOWNLOADER
          </h1>
        </div>

        <div className="relative flex w-47 md:w-55 bg-black h-7.5 sm:h-10 rounded-full ">
          <div
            className={`absolute bg-red-600 w-1/2 h-full rounded-full transition-all duration-300 ${
              downloadType === "video" ? "left-0" : "left-1/2"
            }`}
          ></div>

          <button
            onClick={() => {
              setDownloadType("video");
            }}
            className={` flex-1 z-10 text-[12px] md:text-[16px] font-bold text-center ${
              downloadType === "video" ? "text-white" : "text-white/70"
            }`}
          >
            VIDEO
          </button>

          <button
            onClick={() => setDownloadType("audio")}
            className={` flex-1 z-10 text-[12px] md:text-[16px] font-bold text-center ${
              downloadType === "audio" ? "text-white" : "text-white/70"
            }`}
          >
            AUDIO
          </button>
        </div>

        <div className="input-bar-1 flex flex-col items-center">
          <div className="flex items-center justify-center text-white w-full">
            <div className="flex w-[320px] sm:w-159 lg:w-258 bg-black rounded-full h-10 md:h-12.5 gap-3">
              <input
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none pl-6"
                id="yt"
                type="text"
                placeholder="enter the youtube video url here.."
              />

              <button
                onClick={() => getInfo(url)}
                disabled={loading}
                type="submit"
                className={`
                 relative
                 bg-red-600 hover:bg-red-500
                 rounded-full
                 px-6 md:px-10
                 h-10 md:h-12.5
                 min-w-30 md:min-w-40
                 font-semibold
                 flex items-center justify-center
                 transition-all
                 ${loading ? "cursor-not-allowed" : ""}
                `}
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
      </div>
      <div className="flex justify-center">
        {error && <p>{error}</p>}
        {data && <Content url={url} data={data} downloadType={downloadType} />}
      </div>
    </section>
  );
}
