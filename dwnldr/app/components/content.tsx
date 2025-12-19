
import useDownloadVideo from "../hooks/useDownloadVideo";
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
      ? `${h}:${m.toString().padStart(2, "0")}:${sec
          .toString()
          .padStart(2, "0")}`
      : `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="w-full max-w-5xl flex flex-col lg:flex-row items-stretch justify-center bg-[#332C2D] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="w-full lg:w-2/5 aspect-video lg:aspect-auto">
        <img
          className="w-full h-full object-cover"
          src={data.thumbnail}
          alt={data.title}
        />
      </div>

      <div className="flex-1 p-5 sm:p-8 text-white flex flex-col justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight line-clamp-2">
            {data.title}
          </h1>
          <p className="opacity-70 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
            {data.description}
          </p>
          <div className="inline-block bg-white/10 px-3 py-1 rounded text-xs font-mono">
            Duration: {formatTime(Number(data.duration))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            disabled={loading}
            onClick={downloadVideo}
            className="group relative w-full sm:w-auto min-h-12 px-10 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center overflow-hidden"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>
              SAVE TO DEVICE
            </span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
