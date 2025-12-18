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
            thumbnail=info.get("thumbnail", ""),
            videoId = info.get("id","")
        )

def download_video_stream(data: UrlData) -> Generator[bytes, None, None]:

    def download_section(info_dict, ydl):
        sections = [
            {
                "start_time": float(data.startTime),
                "end_time":float(data.endTime)
            }
        ]
        return sections
    
    if data.downloadType == "video":
        filename = "default.mp4"
        if data.startTime is not None and data.endTime is not None:
            ydl_opts = {"format": "bestvideo+bestaudio/best", "outtmpl": filename,  "download_ranges": download_section}
        else:
            ydl_opts = {"format": "bestvideo+bestaudio/best", "outtmpl": filename}
    else:
        filename = "default.mp3"
        if data.startTime is not None and data.endTime is not None:
            ydl_opts = {"format": "bestaudio/best", "outtmpl": filename, "quiet": True, "download_ranges": download_section}
        else:
            ydl_opts = {"format": "bestaudio/best", "outtmpl": filename, "quiet": True}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([data.url])    
        with open(filename, "rb") as f:
            while chunk := f.read(1024 * 1024):
                yield chunk
    finally:
         if os.path.exists(filename):
            os.remove(filename)

