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
        
        // Effect tabs
        const effectTabs = ref([
            { id: 'movie', name: 'Movie', icon: '🎬' },
            { id: 'text', name: 'Text', icon: '📝' },
            { id: 'subtitle', name: 'Subtitles', icon: '💬' },
            { id: 'convert', name: 'Export', icon: '⬇️' }
        ])
        
        // Movie animations
        const movieAnimations = ref([
            { name: 'Fade', type: 'fade', icon: '🌫️' },
            { name: 'Slide', type: 'slide', icon: '➡️' },
            { name: 'Zoom', type: 'zoom', icon: '🔍' },
            { name: 'Rotate', type: 'rotate', icon: '🔄' },
            { name: 'Blur', type: 'blur', icon: '👁️' }
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