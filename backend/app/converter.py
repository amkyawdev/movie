"""
Video converter module for changing resolution and format
"""
import cv2
import numpy as np
from pathlib import Path

RESOLUTIONS = {
    '480p': {'width': 854, 'height': 480, 'bitrate': '1.5M'},
    '720p': {'width': 1280, 'height': 720, 'bitrate': '2.5M'},
    '1080p': {'width': 1920, 'height': 1080, 'bitrate': '5M'},
    '1440p': {'width': 2560, 'height': 1440, 'bitrate': '8M'},
    '4K': {'width': 3840, 'height': 2160, 'bitrate': '15M'}
}

def convert_video(video_path: str, resolution: str, format: str = "mp4") -> str:
    """
    Convert video to different resolution/format
    
    Args:
        video_path: Path to input video
        resolution: Target resolution ('480p', '720p', '1080p', '1440p', '4K')
        format: Target format (mp4, avi, mov, mkv)
    
    Returns:
        Path to output video
    """
    target = RESOLUTIONS.get(resolution, RESOLUTIONS['1080p'])
    target_width = target['width']
    target_height = target['height']
    
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    input_name = Path(video_path).stem
    output_path = f"outputs/{input_name}_{resolution}.{format}"
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (target_width, target_height))
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Resize to target resolution
        resized = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_LINEAR)
        out.write(resized)
    
    cap.release()
    out.release()
    
    return output_path

def extract_frames(video_path: str, output_dir: str) -> list:
    """Extract all frames from video"""
    cap = cv2.VideoCapture(video_path)
    frames = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    
    cap.release()
    
    # Save frames
    os.makedirs(output_dir, exist_ok=True)
    for i, frame in enumerate(frames):
        cv2.imwrite(f"{output_dir}/frame_{i:04d}.jpg", frame)
    
    return frames

def create_video_from_frames(frames: list, output_path: str, fps: int = 30) -> str:
    """Create video from frames"""
    if not frames:
        return None
    
    height, width = frames[0].shape[:2]
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    for frame in frames:
        out.write(frame)
    
    out.release()
    return output_path