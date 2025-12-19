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




def download_video_stream(data:UrlData) -> Generator[bytes, None, None]:
   
    request_id = f"{int(time.time())}"
    base_name = f"file_{request_id}"
    
    
    final_ext = "mp4" if data.downloadType == "video" else "mp3"
    actual_filename = f"{base_name}.{final_ext}"

    ydl_opts = {
        "noplaylist": True,
        "overwrites": True,
        "quiet": True, 
        "outtmpl": f"{base_name}.%(ext)s",
    }

    if data.downloadType == "video":
      
        ydl_opts.update({
            "format": "best[ext=mp4]/best",
            "merge_output_format": "mp4",
            "postprocessor_args": ["-c:v", "libx264", "-c:a", "aac"],
        })
    else:
        ydl_opts.update({
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
        })


    if data.startTime is not None and data.endTime is not None:
     
        ydl_opts["download_ranges"] = lambda info, ydl: [{
            "start_time": float(data.startTime),
            "end_time": float(data.endTime)
        }]
        ydl_opts["force_keyframes_at_cuts"] = True

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([data.url])
        
      
        final_path = None
        for f in os.listdir('.'):
            if f.startswith(base_name) and f.endswith(final_ext):
                final_path = f
                break
        
        if final_path and os.path.exists(final_path):
            with open(final_path, "rb") as f:
                while chunk := f.read(1024 * 1024):
                    yield chunk
        else:
            print(f"File not found after download: {actual_filename}")

    except Exception as e:
        print(f"Download Error: {str(e)}")
        yield b""

    finally:
        time.sleep(1)
        for f in os.listdir('.'):
            if f.startswith(base_name):
                try:
                    os.remove(f)
                except:
                    pass