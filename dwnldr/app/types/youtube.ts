export type YoutubeResult = {
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  videoId?: string;
};

export type DownloadType = "video" | "audio";

export interface TrimSliderProps {
  key?: string;
  videoId?: string;
  duration: number | string;
  url: string;
  downloadType: "video" | "audio";
}
