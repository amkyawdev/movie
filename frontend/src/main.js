const { createApp, ref, reactive, computed, onMounted } = Vue

const app = createApp({
    setup() {
        // State
        const dockerOpen = ref(true)
        const dockerConnected = ref(false)
        const activeTab = ref('movie')
        const isPlaying = ref(false)
        const currentTime = ref(0)
        const duration = ref(0)
        const showShortcuts = ref(false)
        
        // Video state
        const currentVideo = ref(null)
        const videoUrl = ref('')
        const videoClips = ref([])
        const audioClips = ref([])
        const subtitles = ref([])
        
        // Selection state
        const selectedMovieAnim = ref('')
        const selectedTextAnim = ref('')
        const selectedColorPreset = ref('')
        const selectedFont = ref('modern')
        
        // Subtitle form
        const newSubtitle = reactive({
            text: '',
            size: 32,
            color: 'white',
            position: 'bottom'
        })
        
        // Export settings
        const exportSettings = reactive({
            resolution: '1080p',
            format: 'mp4',
            quality: 'high'
        })
        
        const exportProgress = ref(0)
        
        // Effect tabs with SVG
        const effectTabs = ref([
            { id: 'movie', name: 'Movie', svg: 'M18 4l2 4h-3l-2-4-2 4h-3l-2 4h3l2 4 2-4h3l2-4h3M4 18h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2z' },
            { id: 'text', name: 'Text', svg: 'M2.5 4v3h5v12h3V7h5V4h-5m5.5 15h-3v-9h3v9zM15.5 6h3v3h-3V6m0 4.5h3v3h-3v-3m0 4.5h3v3h-3v-3m4.5-9h-3v12h3c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z' },
            { id: 'subtitle', name: 'Subtitles', svg: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v2H5z' },
            { id: 'convert', name: 'Export', svg: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z' }
        ])
        
        // Movie animations with SVG paths
        const movieAnimations = ref([
            { name: 'Fade', type: 'fade', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' },
            { name: 'Slide', type: 'slide', svg: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' },
            { name: 'Zoom', type: 'zoom', svg: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 0 0 9.5 3 6.5 6.5 0 0 0 3 9.5a6.5 6.5 0 0 0 6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
            { name: 'Rotate', type: 'rotate', svg: 'M7.11 8.53L5.7 7.1C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 2.5c.14.88.47 1.72 1.02 2.47l-1.41 1.41c-.9-1.16-1.45-2.5-1.62-3.89h2.01zM20.1 13c-.17-1.39-.72-2.73-1.62-3.89l1.41 1.41c.52.75.87 1.59 1.01 2.47H19.9c-.14-.88-.47-1.72-1.02-2.47zM13 4.07V2.05c-1.39.17-2.73.72-3.89 1.62l1.41 1.41c.75-.52 1.59-.87 2.47-1.01zM11 4.07c-.88.14-1.72.49-2.47 1.02l1.41 1.41c1.16-.9 2.5-1.45 3.89-1.62v2.01c-1.39-.17-2.73-.72-3.89-1.62l1.41-1.41c.75.52 1.59.87 2.47 1.01z' },
            { name: 'Blur', type: 'blur', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' }
        ])
        
        // Text animations
        const textAnimations = ref([
            { name: 'Typewriter', type: 'typewriter', effect: 'typewriter' },
            { name: 'Bounce', type: 'bounce', effect: 'bounce' },
            { name: 'Glow', type: 'glow', effect: 'glow' },
            { name: 'Float', type: 'float', effect: 'float' },
            { name: 'Shake', type: 'shake', effect: 'shake' }
        ])
        
        // Color presets
        const colorPresets = ref([
            { name: 'Vivid', id: 'vivid', preview: 'linear-gradient(135deg, #ff6b6b, #feca57)' },
            { name: 'Vintage', id: 'vintage', preview: 'linear-gradient(135deg, #8b7355, #d4c4a8)' },
            { name: 'Cinematic', id: 'cinematic', preview: 'linear-gradient(135deg, #2c3e50, #3498db)' },
            { name: 'B&W', id: 'bw', preview: 'linear-gradient(135deg, #000, #666)' },
            { name: 'Warm', id: 'warm', preview: 'linear-gradient(135deg, #f39c12, #e74c3c)' }
        ])
        
        // Font styles
        const fontStyles = ref([
            { name: 'Modern', id: 'modern', family: 'Inter, sans-serif' },
            { name: 'Elegant', id: 'elegant', family: 'Playfair Display, serif' },
            { name: 'Cinematic', id: 'cinematic', family: 'Montserrat, sans-serif' },
            { name: 'Bold', id: 'bold', family: 'Poppins, sans-serif' },
            { name: 'Handwritten', id: 'handwritten', family: 'Pacifico, cursive' }
        ])
        
        // Methods
        const toggleDocker = () => dockerOpen.value = !dockerOpen.value
        const startDocker = async () => {
            dockerConnected.value = true
            // Call API to start Docker
        }
        const stopDocker = () => dockerConnected.value = false
        const restartDocker = async () => {
            dockerConnected.value = false
            setTimeout(() => { dockerConnected.value = true }, 1000)
        }
        
        const playVideo = () => {
            const video = document.querySelector('video')
            if (video) {
                video.play()
                isPlaying.value = true
            }
        }
        const pauseVideo = () => {
            const video = document.querySelector('video')
            if (video) {
                video.pause()
                isPlaying.value = false
            }
        }
        const stopVideo = () => {
            const video = document.querySelector('video')
            if (video) {
                video.pause()
                video.currentTime = 0
                isPlaying.value = false
            }
        }
        
        const onVideoLoaded = (e) => {
            duration.value = e.target.duration
        }
        const onTimeUpdate = (e) => {
            currentTime.value = e.target.currentTime
        }
        
        const seekVideo = (e) => {
            const video = document.querySelector('video')
            if (video) {
                video.currentTime = e.target.value
            }
        }
        
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60)
            const secs = Math.floor(seconds % 60)
            return `${mins}:${secs.toString().padStart(2, '0')}`
        }
        
        const addClip = () => {
            // Open file picker
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'video/*'
            input.onchange = (e) => {
                const file = e.target.files[0]
                if (file) {
                    const url = URL.createObjectURL(file)
                    videoClips.value.push({
                        name: file.name,
                        file: file,
                        url: url,
                        duration: 5
                    })
                    currentVideo.value = url
                }
            }
            input.click()
        }
        
        const selectClip = (clip) => {
            currentVideo.value = clip.url
        }
        
        const selectMovieAnimation = (type) => {
            selectedMovieAnim.value = type
        }
        
        const selectTextAnimation = (type) => {
            selectedTextAnim.value = type
            applyTextAnimation(type)
        }
        
        const selectColorPreset = (id) => {
            selectedColorPreset.value = id
        }
        
        const selectFont = (id) => {
            selectedFont.value = id
        }
        
        const applyTextAnimation = (type) => {
            const elements = document.querySelectorAll('.anim-preview')
            elements.forEach(el => {
                el.className = 'anim-preview ' + type
            })
        }
        
        const addSubtitle = () => {
            if (newSubtitle.text) {
                subtitles.value.push({
                    text: newSubtitle.text,
                    size: newSubtitle.size,
                    color: newSubtitle.color,
                    position: newSubtitle.position,
                    duration: 5
                })
                newSubtitle.text = ''
            }
        }
        
        const removeSubtitle = (index) => {
            subtitles.value.splice(index, 1)
        }
        
        const exportVideo = async () => {
            exportProgress.value = 0
            // Simulate export progress
            const interval = setInterval(() => {
                exportProgress.value += 10
                if (exportProgress.value >= 100) {
                    clearInterval(interval)
                }
            }, 300)
        }
        
        // Keyboard shortcuts
        onMounted(() => {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    e.preventDefault()
                    isPlaying.value ? pauseVideo() : playVideo()
                }
                if (e.ctrlKey && e.code === 'KeyS') {
                    e.preventDefault()
                    showShortcuts.value = !showShortcuts.value
                }
            })
        })
        
        return {
            dockerOpen, dockerConnected, activeTab, isPlaying,
            currentTime, duration, showShortcuts, currentVideo,
            videoUrl, videoClips, audioClips, subtitles,
            selectedMovieAnim, selectedTextAnim, selectedColorPreset,
            selectedFont, newSubtitle, exportSettings, exportProgress,
            effectTabs, movieAnimations, textAnimations, colorPresets,
            fontStyles, toggleDocker, startDocker, stopDocker, restartDocker,
            playVideo, pauseVideo, stopVideo, onVideoLoaded, onTimeUpdate,
            seekVideo, formatTime, addClip, selectClip,
            selectMovieAnimation, selectTextAnimation, selectColorPreset,
            selectFont, addSubtitle, removeSubtitle, exportVideo
        }
    }
}).mount('#app')