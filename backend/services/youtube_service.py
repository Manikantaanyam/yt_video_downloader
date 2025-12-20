import yt_dlp
import os
from typing import Generator
from models.youtube import UrlData, YoutubeInfo

def get_video_info(url: str) -> YoutubeInfo:
    with yt_dlp.YoutubeDL({"quiet": True, "cookiefile": "cookies.txt",}) as ydl:
        info = ydl.extract_info(url, download=False)
        return YoutubeInfo(
            title=info.get("title", ""),
            description=info.get("description", ""),
            duration=str(info.get("duration", "")),
            thumbnail=info.get("thumbnail", ""),
            videoId = info.get("id","")
        )
    

def download_video_stream(data: UrlData) -> Generator[bytes, None, None]:
    ydl_opts = {
        "noplaylist": True,
        "overwrites": True,
        "quiet": True,
        "outtmpl": "%(title)s.%(ext)s",
        "cookiefile": "cookies.txt",
    }

    if data.downloadType == "audio":
        ydl_opts["format"] = "bestaudio/best"
    else:
        ydl_opts["format"] = "best"


    if data.startTime and data.endTime:
        ydl_opts["download_ranges"] = lambda info, ydl: [{
            "start_time": float(data.startTime),
            "end_time": float(data.endTime)
        }]

    filename = None

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(data.url, download=True)

            if not info:
                raise RuntimeError("No information about the video")

            filename = ydl.prepare_filename(info)

        if not filename or not os.path.exists(filename):
            raise RuntimeError("No filename")

        with open(filename, "rb") as f:
            while True:
                chunk = f.read(1024 * 1024)
                if not chunk:
                    break
                yield chunk

    except Exception as e:
        print("Error", e)
        raise  

    finally:
        if filename and os.path.exists(filename):
            os.remove(filename)


