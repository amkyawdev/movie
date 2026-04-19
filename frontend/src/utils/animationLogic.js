// Animation Logic for Video Editor

const MOVIE_ANIMATIONS = {
    'fade': {
        'in': 'fadeIn 0.5s ease-in',
        'out': 'fadeOut 0.5s ease-out'
    },
    'slide': {
        'in': 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'out': 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    'zoom': {
        'in': 'zoomIn 0.3s ease-out',
        'out': 'zoomOut 0.3s ease-in'
    },
    'rotate': {
        'in': 'rotateIn 0.5s ease-out',
        'out': 'rotateOut 0.5s ease-in'
    },
    'blur': {
        'in': 'blurIn 0.4s ease',
        'out': 'blurOut 0.4s ease'
    }
}

const TEXT_ANIMATIONS = {
    'typewriter': {
        'duration': '1s',
        'easing': 'steps(40)',
        'effect': 'typing'
    },
    'bounce': {
        'duration': '0.6s',
        'easing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'effect': 'bounce'
    },
    'glow': {
        'duration': '1.2s',
        'easing': 'ease-in-out',
        'effect': 'pulseGlow'
    },
    'float': {
        'duration': '0.8s',
        'easing': 'ease',
        'effect': 'floatUp'
    },
    'shake': {
        'duration': '0.3s',
        'easing': 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'effect': 'shake'
    }
}

// Animation Controller Class
class AnimationController {
    constructor() {
        this.animations = new Map()
        this.currentAnimations = []
    }
    
    // Smooth text animation effects
    async applyTextAnimation(element, animationType, duration = 500) {
        const animation = TEXT_ANIMATIONS[animationType]
        
        if (!animation) return
        
        element.style.animation = `${animation.effect} ${duration}ms ${animation.easing}`
        
        return new Promise((resolve) => {
            element.addEventListener('animationend', () => {
                element.style.animation = ''
                resolve()
            }, { once: true })
        })
    }
    
    // Apply movie clip animation
    applyMovieAnimation(clip, animationType, direction = 'in') {
        const animation = MOVIE_ANIMATIONS[animationType]
        
        if (!animation) return
        
        const key = direction === 'in' ? animation['in'] : animation['out']
        return key
    }
    
    // Touch gesture handling
    setupTouchGestures(element, callbacks) {
        let touchStart = null
        let touchEnd = null
        
        element.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0]
            callbacks.onTouchStart?.(e)
        })
        
        element.addEventListener('touchmove', (e) => {
            touchEnd = e.touches[0]
            const deltaX = touchEnd.clientX - touchStart.clientX
            const deltaY = touchEnd.clientY - touchStart.clientY
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                callbacks.onSwipeHorizontal?.(deltaX)
            } else {
                callbacks.onSwipeVertical?.(deltaY)
            }
        })
        
        element.addEventListener('touchend', () => {
            callbacks.onTouchEnd?.()
        })
    }
    
    // Drag and drop for timeline clips
    setupDragAndDrop(element, onDrop) {
        let isDragging = false
        let startX = 0
        let startLeft = 0
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true
            startX = e.clientX
            startLeft = element.offsetLeft
            element.style.zIndex = 100
        })
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return
            
            const deltaX = e.clientX - startX
            element.style.position = 'absolute'
            element.style.left = (startLeft + deltaX) + 'px'
        })
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return
            isDragging = false
            element.style.zIndex = ''
            onDrop?.(element.offsetLeft)
        })
    }
}

// Export animation utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOVIE_ANIMATIONS,
        TEXT_ANIMATIONS,
        AnimationController
    }
}