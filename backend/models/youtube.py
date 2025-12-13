from pydantic import BaseModel

class UrlData(BaseModel):
    url: str
    downloadType: str | None = None 

class YoutubeInfo(BaseModel):
    title: str
    description: str
    duration: str
    thumbnail: str
