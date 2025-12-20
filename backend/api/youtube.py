from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.youtube import UrlData
from services.youtube_service import get_video_info, download_video_stream

router = APIRouter(prefix="/youtube")

@router.post("/get-info")
def youtube_info(data: UrlData):
    return get_video_info(data.url)

@router.post("/download")
def youtube_download(data: UrlData):
    media_type = "video/mp4" if data.downloadType == "video" else "audio/mpeg"
    filename = "video.mp4" if data.downloadType == "video" else "audio.mp3"

    return StreamingResponse(
        download_video_stream(data),
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


