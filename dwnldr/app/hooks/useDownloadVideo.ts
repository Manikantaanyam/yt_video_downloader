import axios from "axios";
import { useState } from "react";
import { DownloadType } from "../types/youtube";

export default function useDownloadVideo({
  url,
  downloadType,
  startTime,
  endTime,
}: {
  url: string;
  downloadType: DownloadType;
  startTime?: string;
  endTime?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function downloadVideo() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/youtube/download`,
        {
          url,
          downloadType,
          startTime,
          endTime,
        },
        {
          responseType: "blob",
        }
      );

      if (response.data) {
        const blobUrl = window.URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = blobUrl;

        const fileName = downloadType === "audio" ? "audio.mp3" : "video.mp4";

        a.download = fileName;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (e) {
      console.error("Error downloading video:", e);
      setError("An error occurred while downloading the video.");
    } finally {
      setLoading(false);
    }
  }

  return { downloadVideo, loading, error };
}
