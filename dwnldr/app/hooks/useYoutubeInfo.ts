import { useState } from "react";
import { YoutubeResult } from "../types/youtube";
import { fetchVideo } from "../services/youtube";

export default function useYoutubeInfo() {
  const [data, setData] = useState<YoutubeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getInfo(url: string) {
    if (!url) {
      setError("Please provide a YouTube URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVideo(url);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch YouTube data");
    } finally {
      setLoading(false);
    }
  }

  return { getInfo, loading, error, data };
}
