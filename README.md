# 🎬 Movie Editor Pro

A professional video editing application with animation capabilities, subtitle editing, and conversion tools built with Vue 3 + Python FastAPI.

![Movie Editor Pro](https://img.shields.io/badge/Movie%20Editor%20Pro-v1.0.0-blue)
![Vue 3](https://img.shields.io/badge/Vue%203-4.x-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎞️ Movie Animations (5 Types)
- **Fade** - Smooth fade in/out transitions
- **Slide** - Directional slide animations
- **Zoom** - Zoom in/out effects
- **Rotate** - Rotation transitions
- **Blur** - Blur in/out effects

### ✏️ Text Animations (5 Types)
- **Typewriter** - Classic typing effect
- **Bounce** - Bouncy text animation
- **Glow** - Pulsing glow effect
- **Float** - Floating text animation
- **Shake** - Dynamic shake effect

### 🎨 Color Presets (5 Styles)
- **Vivid** - High saturation and contrast
- **Vintage** - Nostalgic warm tone
- **Cinematic** - Professional film look
- **B&W** - Classic black & white
- **Warm** - Cozy warm tones

### 📐 Resolution Options
| Resolution | Dimensions | Bitrate |
|------------|------------|---------|
| 480p | 854×480 | 1.5M |
| 720p | 1280×720 | 2.5M |
| 1080p | 1920×1080 | 5M |
| 1440p | 2560×1440 | 8M |
| 4K | 3840×2160 | 15M |

### 🔤 Font Styles (5 Options)
- **Modern** - Inter sans-serif
- **Elegant** - Playfair Display serif
- **Cinematic** - Montserrat bold
- **Bold** - Poppins
- **Handwritten** - Pacifico cursive

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- FFmpeg (for video processing)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/movie-editor-app.git
cd movie-editor-app

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

#### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend
```bash
cd frontend
npm run dev
```

Access the application at: **http://localhost:5173**

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individually
docker build -t movie-backend -f backend/docker/Dockerfile ./backend
docker run -p 8000:8000 movie-backend
```

## 📁 Project Structure

```
movie-editor-app/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── docker/
│   │   └── Dockerfile     # Backend container
│   ├── app/
│   │   ├── effects.py           # Video effects
│   │   ├── animation_engine.py # Movie animations
│   │   ├── subtitle_engine.py  # Subtitle system
│   │   └── converter.py       # Video converter
│   └── uploads/           # Upload directory
├── frontend/
│   ├── index.html        # Main HTML
│   ├── package.json     # Node dependencies
│   ├── vite.config.js  # Vite configuration
│   └── src/
│       ├── main.js           # Vue application
│       ├── style.css         # Styles
│       └── utils/
│           ├── animationLogic.js
│           └── videoUtils.js
└── docker-compose.yml
```

## 🔧 API Endpoints

### Video Upload
```bash
POST /api/upload
```

### Apply Effects
```bash
POST /api/apply-effect?video_path={path}&effect_type={type}
```

### Add Subtitle
```bash
POST /api/add-subtitle
Body: { "text": "...", "size": 32, "color": "white", "position": "bottom" }
```

### Add Animation
```bash
POST /api/add-animation
Body: { "type": "fade", "direction": "in", "duration": 0.5 }
```

### Convert Video
```bash
POST /api/convert?video_path={path}&resolution=1080p&format=mp4
```

### Get Configuration
```bash
GET /api/config
```

## 🎨 Responsive Design

The application features a fully responsive design that adapts to different screen sizes:

- **Mobile**: Bottom navigation bar with touch-friendly controls
- **Desktop**: Top menu bar with full feature access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [OpenCV](https://opencv.org/) - Computer Vision Library
- [MoviePy](https://zulko.github.io/moviepy/) - Video editing with Python

---

<p align="center">Built with ❤️ using Vue 3 + FastAPI</p>