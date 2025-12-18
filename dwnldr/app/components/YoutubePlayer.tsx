"use client";
import YouTube from "react-youtube";

const MovieClip = ({ videoId, start, end }: any) => {
  const options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      controls: 1,
      start: start, // start time in seconds
      end: end, // end time in seconds
    },
  };

  const onReady = (event) => {
    event.target.playVideo();
  };

  return (
    <YouTube videoId={videoId} opts={options} onReady={onReady} id="video" />
  );
};

export default MovieClip;
