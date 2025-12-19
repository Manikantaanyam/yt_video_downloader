"use client";
import YouTube, { YouTubeProps } from "react-youtube";

const MovieClip = ({
  videoId,
  start,
  end,
}: {
  videoId?: string;
  start: number;
  end: number;
}) => {
  const options: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      start: Math.floor(start || 0),
      end: Math.floor(end || 0),
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="relative aspect-video w-full max-w-full overflow-hidden bg-black rounded-lg shadow-lg">
      <YouTube
        key={`${videoId}-${start}-${end}`}
        videoId={videoId}
        opts={options}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default MovieClip;
