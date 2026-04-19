"""
Animation engine for video transitions and effects
"""
import cv2
import numpy as np
from pathlib import Path

MOVIE_ANIMATIONS = {
    'fade': {'in': 'fadeIn', 'out': 'fadeOut', 'duration': 0.5},
    'slide': {'in': 'slideIn', 'out': 'slideOut', 'duration': 0.4},
    'zoom': {'in': 'zoomIn', 'out': 'zoomOut', 'duration': 0.3},
    'rotate': {'in': 'rotateIn', 'out': 'rotateOut', 'duration': 0.5},
    'blur': {'in': 'blurIn', 'out': 'blurOut', 'duration': 0.4}
}

def add_animation(video_path: str, animation: dict) -> str:
    """
    Add animation transition to video
    
    Args:
        video_path: Path to input video
        animation: Animation config with 'type', 'direction', 'duration'
    
    Returns:
        Path to output video
    """
    anim_type = animation.get('type', 'fade')
    direction = animation.get('direction', 'in')
    duration = animation.get('duration', 0.5)
    
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    input_name = Path(video_path).stem
    output_path = f"outputs/{input_name}_animated.mp4"
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()
    
    total_frames = len(frames)
    anim_frame_count = int(fps * duration)
    
    for i, frame in enumerate(frames):
        # Apply animation based on type and direction
        if direction == 'in' and i < anim_frame_count:
            progress = i / anim_frame_count
            frame = apply_animation_frame(frame, anim_type, progress)
        elif direction == 'out' and i >= total_frames - anim_frame_count:
            progress = (total_frames - i) / anim_frame_count
            frame = apply_animation_frame(frame, anim_type, progress)
        
        out.write(frame)
    
    out.release()
    return output_path

def apply_animation_frame(frame: np.ndarray, anim_type: str, progress: float) -> np.ndarray:
    """
    Apply animation effect to a frame
    
    Args:
        frame: Input frame
        anim_type: Animation type
        progress: Animation progress (0.0 to 1.0)
    
    Returns:
        Animated frame
    """
    height, width = frame.shape[:2]
    
    if anim_type == 'fade':
        # Alpha blend from transparent
        alpha = progress
        overlay = np.full_like(frame, 0)
        return cv2.addWeighted(frame, alpha, overlay, 1 - alpha, 0)
    
    elif anim_type == 'slide':
        # Slide in from direction
        offset = int(width * (1 - progress))
        if offset > 0:
            return np.concatenate([frame[:, offset:], frame[:, :offset]], axis=1)
        return frame
    
    elif anim_type == 'zoom':
        # Zoom in effect
        scale = 1 + progress * 0.3
        center = (width // 2, height // 2)
        matrix = cv2.getRotationMatrix2D(center, 0, scale)
        return cv2.warpAffine(frame, matrix, (width, height))
    
    elif anim_type == 'rotate':
        # Rotate in effect
        angle = -90 * (1 - progress)
        center = (width // 2, height // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1)
        return cv2.warpAffine(frame, matrix, (width, height))
    
    elif anim_type == 'blur':
        # Blur in effect
        blur_amount = int(20 * (1 - progress))
        if blur_amount > 0 and blur_amount % 2 == 0:
            return cv2.GaussianBlur(frame, (blur_amount, blur_amount), 0)
        return frame
    
    return frame

def apply_transition(frames1: list, frames2: list, anim_type: str, fps: int) -> list:
    """
    Create transition between two video segments
    
    Args:
        frames1: First video frames
        frames2: Second video frames
        anim_type: Type of transition
        fps: Frames per second
    
    Returns:
        List of transition frames
    """
    transition_count = int(fps * 0.5)
    result = []
    
    for i in range(transition_count):
        progress = i / transition_count
        # Cross-fade between last frame of first and first frame of second
        alpha = progress
        frame = cv2.addWeighted(frames1[-1], alpha, frames2[0], 1 - alpha, 0)
        result.append(frame)
    
    return result