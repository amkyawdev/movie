// Movie Recap - Project Management JavaScript
const { createApp, ref, reactive, computed, onMounted } = Vue

const app = createApp({
    setup() {
        // State
        const isLoading = ref(true)
        const isRefreshing = ref(false)
        const filter = ref('all')
        const showNewProjectModal = ref(false)
        const processingProject = ref(null)
        const processingProgress = ref(0)
        const toasts = ref([])
        
        // New project form
        const newProject = reactive({
            name: '',
            resolution: '1080p',
            file: null
        })
        
        // Projects data (mock - replace with API call)
        const projects = ref([
            {
                id: 1,
                name: 'Beach Sunset Edit',
                duration: 180,
                resolution: '1080p',
                createdAt: new Date(Date.now() - 86400000),
                thumbnail: null,
                isFavorite: true,
                isProcessing: false,
                effects: ['vivid', 'fade']
            },
            {
                id: 2,
                name: 'City Timelapse',
                duration: 45,
                resolution: '4K',
                createdAt: new Date(Date.now() - 172800000),
                thumbnail: null,
                isFavorite: false,
                isProcessing: true,
                effects: ['cinematic']
            },
            {
                id: 3,
                name: 'Family Memories',
                duration: 320,
                resolution: '1080p',
                createdAt: new Date(Date.now() - 259200000),
                thumbnail: null,
                isFavorite: true,
                isProcessing: false,
                effects: ['vintage', 'subtitle']
            }
        ])
        
        // Computed
        const filteredProjects = computed(() => {
            switch (filter.value) {
                case 'recent':
                    return projects.value.filter(p => 
                        Date.now() - p.createdAt.getTime() < 604800000) // 7 days
                case 'favorites':
                    return projects.value.filter(p => p.isFavorite)
                case 'exported':
                    return projects.value.filter(p => !p.isProcessing)
                default:
                    return projects.value
            }
        })
        
        const canCreate = computed(() => 
            newProject.name && newProject.file)
        
        // Methods
        const formatDuration = (seconds) => {
            const mins = Math.floor(seconds / 60)
            const secs = Math.floor(seconds % 60)
            return `${mins}:${secs.toString().padStart(2, '0')}`
        }
        
        const formatDate = (date) => {
            const now = new Date()
            const diff = now - date
            const days = Math.floor(diff / 86400000)
            
            if (days === 0) return 'Today'
            if (days === 1) return 'Yesterday'
            if (days < 7) return `${days} days ago`
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }
        
        const refreshProjects = async () => {
            isRefreshing.value = true
            // Simulate API call
            await new Promise(r => setTimeout(r, 1000))
            isRefreshing.value = false
            addToast('Projects refreshed', 'success')
        }
        
        const toggleFavorite = (project) => {
            project.isFavorite = !project.isFavorite
            addToast(
                project.isFavorite ? 'Added to favorites' : 'Removed from favorites',
                'success'
            )
        }
        
        const playProject = (project) => {
            console.log('Playing:', project.name)
            addToast('Opening player...', 'success')
        }
        
        const editProject = (project) => {
            console.log('Editing:', project.name)
            // Navigate to editor with project
            window.location.href = 'editor.html?id=' + project.id
        }
        
        const exportProject = async (project) => {
            if (project.isProcessing) return
            
            // Start processing
            project.isProcessing = true
            processingProject.value = {
                title: 'Exporting Video',
                message: `Converting ${project.name} to ${project.resolution}`,
                cancelable: true
            }
            processingProgress.value = 0
            
            // Simulate export progress
            const interval = setInterval(() => {
                processingProgress.value += Math.random() * 15
                if (processingProgress.value >= 100) {
                    processingProgress.value = 100
                    clearInterval(interval)
                    setTimeout(() => {
                        processingProject.value = null
                        project.isProcessing = false
                        addToast('Video exported successfully!', 'success')
                    }, 500)
                }
            }, 500)
        }
        
        const deleteProject = (project) => {
            if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
                const index = projects.value.findIndex(p => p.id === project.id)
                if (index > -1) {
                    projects.value.splice(index, 1)
                    addToast('Project deleted', 'success')
                }
            }
        }
        
        const triggerFileInput = () => {
            document.querySelector('input[type="file"]').click()
        }
        
        const handleFileDrop = (e) => {
            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith('video/')) {
                newProject.file = file
                if (!newProject.name) {
                    newProject.name = file.name.replace(/\.[^/.]+$/, '')
                }
            }
        }
        
        const handleFileSelect = (e) => {
            const file = e.target.files[0]
            if (file) {
                newProject.file = file
                if (!newProject.name) {
                    newProject.name = file.name.replace(/\.[^/.]+$/, '')
                }
            }
        }
        
        const createProject = async () => {
            if (!canCreate.value) return
            
            const project = {
                id: Date.now(),
                name: newProject.name,
                duration: 0,
                resolution: newProject.resolution,
                createdAt: new Date(),
                thumbnail: null,
                isFavorite: false,
                isProcessing: false,
                effects: []
            }
            
            // Add to projects
            projects.value.unshift(project)
            
            // Reset form
            newProject.name = ''
            newProject.resolution = '1080p'
            newProject.file = null
            showNewProjectModal.value = false
            
            addToast('Project created!', 'success')
        }
        
        const cancelProcessing = () => {
            processingProject.value = null
            processingProgress.value = 0
            addToast('Processing cancelled', 'error')
        }
        
        const addToast = (message, type = 'success') => {
            const id = Date.now()
            toasts.value.push({ id, message, type })
            setTimeout(() => removeToast(id), 3000)
        }
        
        const removeToast = (id) => {
            const index = toasts.value.findIndex(t => t.id === id)
            if (index > -1) toasts.value.splice(index, 1)
        }
        
        // Simulate loading
        onMounted(async () => {
            await new Promise(r => setTimeout(r, 800))
            isLoading.value = false
        })
        
        return {
            isLoading,
            isRefreshing,
            filter,
            showNewProjectModal,
            processingProject,
            processingProgress,
            toasts,
            newProject,
            projects,
            filteredProjects,
            canCreate,
            formatDuration,
            formatDate,
            refreshProjects,
            toggleFavorite,
            playProject,
            editProject,
            exportProject,
            deleteProject,
            triggerFileInput,
            handleFileDrop,
            handleFileSelect,
            createProject,
            cancelProcessing,
            removeToast
        }
    }
}).mount('#app')