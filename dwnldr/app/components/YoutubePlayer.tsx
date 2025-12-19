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
    height: "390",
    width: "640",
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
    <div className="aspect-video w-full   bg-black">
      <YouTube
        key={`${videoId}-${start}-${end}`}
        videoId={videoId}
        opts={options}
      />
    </div>
  );
};

export default MovieClip;
