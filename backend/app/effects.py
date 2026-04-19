"""
Video effects processing module
"""
import cv2
import numpy as np
import os
from pathlib import Path

COLOR_PRESETS = {
    'vivid': {'brightness': 1.1, 'contrast': 1.2, 'saturation': 1.3},
    'vintage': {'brightness': 0.9, 'contrast': 0.8, 'saturation': 0.7},
    'cinematic': {'brightness': 0.95, 'contrast': 1.15, 'saturation': 1.1},
    'bw': {'brightness': 1.0, 'contrast': 1.0, 'saturation': 0},
    'warm': {'brightness': 1.05, 'contrast': 1.0, 'saturation': 1.15}
}

def apply_video_effect(video_path: str, effect_type: str, params: dict = None) -> str:
    """
    Apply color/effects to video
    
    Args:
        video_path: Path to input video
        effect_type: Type of effect ('color_correction', 'vivid', 'vintage', 'cinematic', 'bw', 'warm')
        params: Additional parameters
    
    Returns:
        Path to output video
    """
    if params is None:
        params = {}
    
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    
    # Output path
    input_name = Path(video_path).stem
    output_path = f"outputs/{input_name}_edited.mp4"
    
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    # Get color preset
    if effect_type in COLOR_PRESETS:
        preset = COLOR_PRESETS[effect_type]
    else:
        preset = {'brightness': 1.0, 'contrast': 1.0, 'saturation': 1.0}
    
    brightness = preset.get('brightness', params.get('brightness', 1.0))
    contrast = preset.get('contrast', params.get('contrast', 1.0))
    saturation = preset.get('saturation', params.get('saturation', 1.0))
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Apply color adjustments
        frame = apply_color_adjustment(frame, brightness, contrast, saturation)
        out.write(frame)
    
    cap.release()
    out.release()
    
    return output_path

def apply_color_adjustment(frame: np.ndarray, brightness: float = 1.0, 
                          contrast: float = 1.0, saturation: float = 1.0) -> np.ndarray:
    """
    Apply color adjustments to a frame
    
    Args:
        frame: Input frame
        brightness: Brightness factor (1.0 = unchanged)
        contrast: Contrast factor (1.0 = unchanged)
        saturation: Saturation factor (1.0 = unchanged)
    
    Returns:
        Adjusted frame
    """
    # Apply brightness
    if brightness != 1.0:
        frame = np.clip(frame * brightness, 0, 255).astype(np.uint8)
    
    # Apply contrast
    if contrast != 1.0:
        mean = frame.mean()
        frame = np.clip((frame - mean) * contrast + mean, 0, 255).astype(np.uint8)
    
    # Apply saturation
    if saturation != 1.0:
        # Convert to HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)
        frame = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    
    return frame

def apply_blur(frame: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    """Apply blur effect"""
    return cv2.GaussianBlur(frame, (kernel_size, kernel_size), 0)

def apply_sharpen(frame: np.ndarray) -> np.ndarray:
    """Apply sharpen effect"""
    kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    return cv2.filter2D(frame, -1, kernel)

def apply_sepia(frame: np.ndarray) -> np.ndarray:
    """Apply sepia tone effect"""
    kernel = np.array([[0.272, 0.534, 0.131],
                      [0.349, 0.686, 0.168],
                      [0.393, 0.769, 0.189]])
    return cv2.transform(frame, kernel)