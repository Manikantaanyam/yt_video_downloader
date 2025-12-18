import axios from "axios";
import { YoutubeResult } from "../types/youtube";

export async function fetchVideo(url: string): Promise<YoutubeResult> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/youtube/get-info`,
    { url }
  );

  return response.data;
}
