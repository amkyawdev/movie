"""
Subtitle engine for adding text overlays to videos
"""
import cv2
import numpy as np
import os
from pathlib import Path

FONT_STYLES = {
    'modern': cv2.FONT_HERSHEY_SIMPLEX,
    'elegant': cv2.FONT_HERSHEY_PLAIN,
    'cinematic': cv2.FONT_HERSHEY_DUPLEX,
    'bold': cv2.FONT_HERSHEY_TRIPLEX,
    'handwritten': cv2.FONT_ITALIC
}

BACKGROUND_TYPES = {
    'solid': (0, 0, 0, 180),
    'gradient': 'gradient',
    'glass': (255, 255, 255, 50),
    'outline': None,
    'shadow': None
}

def add_subtitle(video_path: str, subtitles: dict) -> str:
    """
    Add subtitle to video
    
    Args:
        video_path: Path to input video
        subtitles: Subtitle config with 'text', 'size', 'color', 'font', 'position', 'background'
    
    Returns:
        Path to output video
    """
    text = subtitles.get('text', '')
    font_size = subtitles.get('size', 32)
    color = subtitles.get('color', 'white')
    font_style = subtitles.get('font', 'modern')
    position = subtitles.get('position', 'bottom')
    bg_type = subtitles.get('background', 'solid')
    
    # Convert color name to BGR
    color_map = {
        'white': (255, 255, 255),
        'black': (0, 0, 0),
        'yellow': (0, 255, 255),
        'red': (0, 0, 255),
        'green': (0, 255, 0),
        'blue': (255, 0, 0)
    }
    text_color = color_map.get(color, (255, 255, 255))
    
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    input_name = Path(video_path).stem
    output_path = f"outputs/{input_name}_subtitled.mp4"
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    font = FONT_STYLES.get(font_style, cv2.FONT_HERSHEY_SIMPLEX)
    
    # Calculate text position
    (text_w, text_h), baseline = cv2.getTextSize(text, font, font_size/25, 2)
    
    if position == 'bottom':
        text_x = (width - text_w) // 2
        text_y = height - baseline - 20
    elif position == 'top':
        text_x = (width - text_w) // 2
        text_y = text_h + 20
    else:  # center
        text_x = (width - text_w) // 2
        text_y = (height + text_h) // 2
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Draw background
        if bg_type == 'solid':
            cv2.rectangle(
                frame,
                (text_x - 10, text_y - text_h - 10),
                (text_x + text_w + 10, text_y + baseline + 10),
                (0, 0, 0),
                -1
            )
        elif bg_type == 'outline':
            cv2.rectangle(
                frame,
                (text_x - 10, text_y - text_h - 10),
                (text_x + text_w + 10, text_y + baseline + 10),
                (0, 0, 0),
                2
            )
        
        # Draw text
        cv2.putText(frame, text, (text_x, text_y), font, font_size/25, text_color, 2)
        
        out.write(frame)
    
    cap.release()
    out.release()
    
    return output_path

def add_multiple_subtitles(video_path: str, subtitles_list: list) -> str:
    """Add multiple subtitles to video"""
    if not subtitles_list:
        return video_path
    
    # Apply subtitles sequentially
    output_path = video_path
    for subtitles in subtitles_list:
        output_path = add_subtitle(output_path, subtitles)
    
    return output_path