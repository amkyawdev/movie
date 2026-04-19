// Video Utility Functions

// Resolution presets
const RESOLUTIONS = {
    '480p': { width: 854, height: 480, bitrate: '1.5M' },
    '720p': { width: 1280, height: 720, bitrate: '2.5M' },
    '1080p': { width: 1920, height: 1080, bitrate: '5M' },
    '1440p': { width: 2560, height: 1440, bitrate: '8M' },
    '4K': { width: 3840, height: 2160, bitrate: '15M' }
}

// Color presets
const COLOR_PRESETS = {
    'vivid': { brightness: 1.1, contrast: 1.2, saturation: 1.3 },
    'vintage': { brightness: 0.9, contrast: 0.8, saturation: 0.7 },
    'cinematic': { brightness: 0.95, contrast: 1.15, saturation: 1.1 },
    'bw': { brightness: 1.0, contrast: 1.0, saturation: 0 },
    'warm': { brightness: 1.05, contrast: 1.0, saturation: 1.15 }
}

// Font styles
const FONT_STYLES = {
    'modern': 'Inter, sans-serif',
    'elegant': 'Playfair Display, serif',
    'cinematic': 'Montserrat, sans-serif',
    'bold': 'Poppins, sans-serif',
    'handwritten': 'Pacifico, cursive'
}

// Background types
const BACKGROUND_TYPES = {
    'solid': 'rgba(0,0,0,0.7)',
    'gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'glass': 'rgba(255,255,255,0.1)',
    'outline': 'transparent',
    'shadow': 'rgba(0,0,0,0.5)'
}

// Format video duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Get video dimensions
function getVideoDimensions(video) {
    return {
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight
    }
}

// Calculate timeline position
function calculateTimelinePosition(time, scale) {
    return time * scale
}

// Convert file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RESOLUTIONS,
        COLOR_PRESETS,
        FONT_STYLES,
        BACKGROUND_TYPES,
        formatDuration,
        getVideoDimensions,
        calculateTimelinePosition,
        formatFileSize
    }
}