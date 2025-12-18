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
  return (
    <section className="w-full flex flex-col items-center justify-center lg:flex-row mt-4">
      {error && <p>{error}</p>}
      <div className="h-full">
        <img
          className="w-120 h-50 sm:h-70 "
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
          <p className="opacity-70">{data.duration}</p>
        </div>

        <div>
          <button
            disabled={loading}
            onClick={downloadVideo}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            save to device
          </button>
        </div>
      </div>
    </section>
  );
}
