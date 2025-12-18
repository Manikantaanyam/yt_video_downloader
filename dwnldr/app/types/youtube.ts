export type YoutubeResult = {
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  videoId?: string;
};

export type DownloadType = "video" | "audio";
