from pydantic import BaseModel
from typing import Optional

class UrlData(BaseModel):
    url: str
    downloadType: str | None = None 

class YoutubeInfo(BaseModel):
    title: str
    description: str
    duration: Optional[str]
    thumbnail: str
    videoId : Optional[str]

