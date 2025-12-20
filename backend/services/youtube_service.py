import yt_dlp
import os
from typing import Generator
from models.youtube import UrlData, YoutubeInfo
import time

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

def download_video_stream(data: UrlData):
    ydl_opts = {
        "noplaylist": True,
        "overwrites": True,
        "quiet": True,
        "outtmpl": "%(title)s.%(ext)s",
    }

    def download_section(info_dict, ydl):
        sections = [
            {
                "start_time" : 120,
                "end_time" : 180
            }
        ]

        return sections

    if data.downloadType == "audio":
        ydl_opts["format"]= "bestaudio/best"
        if data.startTime and data.endTime:
            ydl_opts["download_ranges"]= lambda info, ydl:[{
                 "start_time": float(data.startTime),
                 "end_time": float(data.endTime)
            }]
    else:
        ydl_opts["format"]= "best"
        if data.startTime and data.endTime:
            ydl_opts["download_ranges"]= lambda info, ydl:[{
                 "start_time": float(data.startTime),
                 "end_time": float(data.endTime)
            }]

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(data.url, download=True)

      
        filename = ydl.prepare_filename(info)

    with open(filename, "rb") as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            yield chunk

    


