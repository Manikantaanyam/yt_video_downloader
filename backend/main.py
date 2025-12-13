from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from api import youtube


app = FastAPI(title="YouTube Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  
)

app.include_router(youtube.router)
