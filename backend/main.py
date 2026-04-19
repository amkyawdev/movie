from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import cv2
import numpy as np
import json
import os
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directories exist
UPLOAD_DIR = Path("uploads/temp")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Video Processing Endpoints
@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file"""
    content = await file.read()
    filename = UPLOAD_DIR / file.filename
    with open(filename, "wb") as f:
        f.write(content)
    return {"filename": str(filename), "status": "success"}

@app.post("/api/apply-effect")
async def apply_effect(video_path: str, effect_type: str, params: dict = None):
    """Apply color/effects to video"""
    if params is None:
        params = {}
    
    from .app import effects
    output_path = effects.apply_video_effect(video_path, effect_type, params)
    return {"output_path": output_path}

@app.post("/api/add-subtitle")
async def add_subtitle(video_path: str, subtitles: dict):
    """Add subtitle to video"""
    from .app import subtitle_engine
    output_path = subtitle_engine.add_subtitle(video_path, subtitles)
    return {"output_path": output_path}

@app.post("/api/add-animation")
async def add_animation(video_path: str, animation: dict):
    """Add animation to video"""
    from .app import animation_engine
    output_path = animation_engine.add_animation(video_path, animation)
    return {"output_path": output_path}

@app.post("/api/convert")
async def convert_video(video_path: str, resolution: str, format: str = "mp4"):
    """Convert video to different resolution/format"""
    from .app import converter
    output_path = converter.convert_video(video_path, resolution, format)
    return {"output_path": output_path}

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """Download processed video"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Resolution and effect configs
RESOLUTIONS = {
    '480p': {'width': 854, 'height': 480, 'bitrate': '1.5M'},
    '720p': {'width': 1280, 'height': 720, 'bitrate': '2.5M'},
    '1080p': {'width': 1920, 'height': 1080, 'bitrate': '5M'},
    '1440p': {'width': 2560, 'height': 1440, 'bitrate': '8M'},
    '4K': {'width': 3840, 'height': 2160, 'bitrate': '15M'}
}

COLOR_PRESETS = {
    'vivid': {'brightness': 1.1, 'contrast': 1.2, 'saturation': 1.3},
    'vintage': {'brightness': 0.9, 'contrast': 0.8, 'saturation': 0.7},
    'cinematic': {'brightness': 0.95, 'contrast': 1.15, 'saturation': 1.1},
    'bw': {'brightness': 1.0, 'contrast': 1.0, 'saturation': 0},
    'warm': {'brightness': 1.05, 'contrast': 1.0, 'saturation': 1.15}
}

@app.get("/api/config")
async def get_config():
    """Get available configurations"""
    return {
        "resolutions": RESOLUTIONS,
        "color_presets": COLOR_PRESETS,
        "movie_animations": ["fade", "slide", "zoom", "rotate", "blur"],
        "text_animations": ["typewriter", "bounce", "glow", "float", "shake"],
        "font_styles": ["modern", "elegant", "cinematic", "bold", "handwritten"]
    }