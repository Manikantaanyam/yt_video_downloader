import yt_dlp
import os
from typing import Generator
from models.youtube import UrlData, YoutubeInfo

def get_video_info(url: str) -> YoutubeInfo:
    with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
        info = ydl.extract_info(url, download=False)
        return YoutubeInfo(
            title=info.get("title", ""),
            description=info.get("description", ""),
            duration=str(info.get("duration", "")),
            thumbnail=info.get("thumbnail", "")
        )

def download_video_stream(data: UrlData) -> Generator[bytes, None, None]:
    if data.downloadType == "video":
        ydl_opts = {"format": "best", "outtmpl": "video.mp4", "quiet": True}
        filename = "video.mp4"
    else:
        ydl_opts = {"format": "bestaudio/best", "outtmpl": "audio.mp3", "quiet": True}
        filename = "audio.mp3"

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([data.url])

        with open(filename, "rb") as f:
            while chunk := f.read(1024 * 1024):
                yield chunk
    finally:
        if os.path.exists(filename):
            os.remove(filename)
