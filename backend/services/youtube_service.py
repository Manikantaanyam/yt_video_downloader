import yt_dlp
import os
import shutil
from typing import Generator
from models.youtube import UrlData, YoutubeInfo

def download_video_stream(data: UrlData) -> Generator[bytes, None, None]:
    ffmpeg_path = shutil.which("ffmpeg") or "./ffmpeg"

    ydl_opts = {
        "noplaylist": True,
        "overwrites": True,
        "quiet": True,
        "cookiefile": "cookies.txt",
        "ffmpeg_location": ffmpeg_path,
    }

    if data.downloadType == "audio":
        ydl_opts["format"] = "bestaudio/best"
        ydl_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }]
        ydl_opts["outtmpl"] = "%(title)s.%(ext)s"
    else:
        ydl_opts["format"] = "bestvideo+bestaudio/best"
        ydl_opts["outtmpl"] = "%(title)s.%(ext)s"

    if data.startTime and data.endTime:
        ydl_opts["download_ranges"] = lambda info, ydl: [{
            "start_time": float(data.startTime),
            "end_time": float(data.endTime)
        }]

    filename = None

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(data.url, download=True)
            base_filename = ydl.prepare_filename(info)
            if data.downloadType == "audio":
                filename = os.path.splitext(base_filename)[0] + ".mp3"
            else:
                filename = base_filename

        print(f"Attempting to stream file: {filename}")

        if not filename or not os.path.exists(filename):
            raise RuntimeError(f"File not found on disk: {filename}")

        with open(filename, "rb") as f:
            while True:
                chunk = f.read(1024 * 1024)
                if not chunk:
                    break
                yield chunk

    except Exception as e:
        print("Download Stream Error:", e)
        raise

    finally:
        if filename and os.path.exists(filename):
            os.remove(filename)
            base_name = os.path.splitext(filename)[0]
            for ext in [".webm", ".m4a", ".mp4"]:
                if os.path.exists(base_name + ext):
                    os.remove(base_name + ext)
