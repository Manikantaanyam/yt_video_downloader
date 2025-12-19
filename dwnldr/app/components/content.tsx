import useDownloadVideo from "@/app/hooks/useDownloadVideo";
import { DownloadType, YoutubeResult } from "../types/youtube";

export default function Content({
  url,
  data,
  downloadType,
}: {
  url: string;
  data: YoutubeResult;
  downloadType: DownloadType;
}) {
  const { downloadVideo, loading, error } = useDownloadVideo({
    url,
    downloadType,
  });

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
  return (
    <section className="w-full flex flex-col items-center justify-center lg:flex-row mt-4">
      {error && <p>{error}</p>}
      <div className="h-full">
        <img
          className="min-w-80 md:min-w-100 sm:h-70 "
          src={data.thumbnail}
          alt={data.title}
        />
      </div>

      <div className="bg-[#332C2D] h-full mt-3 lg:mt-0 p-4  text-white flex flex-col gap-2 justify-center">
        <div>
          <h1 className="text-[16px] md:text-[18px] lg:text-[24px] font-bold">
            {data.title}
          </h1>
          <p className="max-w-xl opacity-70 text-[10px] md:text-[14px]">
            {data?.description?.length > 300
              ? data.description.substring(0, 150) + "..."
              : data?.description}
          </p>
          <p className="opacity-70">{formatTime(Number(data.duration))}</p>
        </div>

        <div>
          <button
            disabled={loading}
            onClick={downloadVideo}
            className="
                relative
                min-h-10
                px-6 sm:px-10
                bg-red-600 hover:bg-red-500
                text-white
                font-semibold
                flex items-center justify-center
                transition-all
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-md
                shrink-0
              "
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>
              save to device
            </span>

            {loading && (
              <span className="absolute w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
