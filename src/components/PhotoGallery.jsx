import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const PhotoGallery = ({ farms, crops, tasks }) => {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      farmId: 1,
      cropId: 1,
      taskId: null,
      url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200',
      filename: 'tomato_seedlings.jpg',
      size: 245760,
      uploadDate: '2024-10-20',
      tags: ['seedlings', 'tomatoes', 'greenhouse'],
      album: 'Tomato Growth',
      description: 'Early tomato seedlings in greenhouse',
      metadata: { camera: 'iPhone', location: 'Greenhouse A' }
    },
    {
      id: 2,
      farmId: 1,
      cropId: 2,
      taskId: 1,
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
      filename: 'corn_field_watering.jpg',
      size: 312450,
      uploadDate: '2024-10-21',
      tags: ['corn', 'watering', 'irrigation'],
      album: 'Corn Season 2024',
      description: 'Watering corn field section B',
      metadata: { camera: 'Canon', weather: 'Sunny' }
    },
    {
      id: 3,
      farmId: 2,
      cropId: 3,
      taskId: null,
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200',
      filename: 'wheat_harvest_ready.jpg',
      size: 456789,
      uploadDate: '2024-10-22',
      tags: ['wheat', 'harvest', 'golden'],
      album: 'Wheat Harvest 2024',
      description: 'Wheat field ready for harvest',
      metadata: { camera: 'Nikon', time: 'Golden hour' }
    }
  ])

  const [albums, setAlbums] = useState([
    { id: 1, name: 'Tomato Growth', photoCount: 1, coverPhoto: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200', createdDate: '2024-10-20' },
    { id: 2, name: 'Corn Season 2024', photoCount: 1, coverPhoto: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200', createdDate: '2024-10-21' },
    { id: 3, name: 'Wheat Harvest 2024', photoCount: 1, coverPhoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200', createdDate: '2024-10-22' }
  ])

  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'albums'
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState('')
  const fileInputRef = useRef(null)

  // Get all unique tags
  const allTags = [...new Set(photos.flatMap(photo => photo.tags))]

  // Filter photos based on search, album, and tags
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         photo.filename.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAlbum = selectedAlbum === 'all' || photo.album === selectedAlbum
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => photo.tags.includes(tag))
    
    return matchesSearch && matchesAlbum && matchesTags
  })

  // Compress image before upload
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg'
    }
    
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Image compression failed:', error)
      return file
    }
  }

  // Handle file upload
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`)
          continue
        }

        // Compress image
        const compressedFile = await compressImage(file)
        
        // Create photo object
        const photoData = {
          id: Date.now() + i,
          farmId: farms[0]?.id || 1,
          cropId: null,
          taskId: null,
          url: URL.createObjectURL(compressedFile),
          thumbnail: URL.createObjectURL(compressedFile),
          filename: file.name,
          size: compressedFile.size,
          uploadDate: format(new Date(), 'yyyy-MM-dd'),
          tags: [],
          album: 'Unsorted',
          description: '',
          metadata: {
            originalSize: file.size,
            compressedSize: compressedFile.size,
            uploadTime: new Date().toISOString()
          }
        }

        setPhotos(prev => [...prev, photoData])
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded successfully`)
    } catch (error) {
      toast.error('Failed to upload photos')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setShowUploadModal(false)
    }
  }

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: isUploading,
  })


  const handleDeletePhoto = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId))
    toast.success('Photo deleted successfully')
  }

  const handleUpdatePhoto = (photoId, updates) => {
    setPhotos(photos.map(p => p.id === photoId ? { ...p, ...updates } : p))
    toast.success('Photo updated successfully')
  }

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      toast.error('Please enter an album name')
      return
    }

    const newAlbum = {
      id: Date.now(),
      name: newAlbumName,
      photoCount: 0,
      coverPhoto: null,
      createdDate: format(new Date(), 'yyyy-MM-dd')
    }

    setAlbums([...albums, newAlbum])
    setNewAlbumName('')
    setShowAlbumModal(false)
    toast.success('Album created successfully')
  }

  const openLightbox = (photo) => {
    setSelectedPhoto(photo)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
    setLightboxOpen(false)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search photos, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
          >
            <option value="all">All Albums</option>
            {albums.map(album => (
              <option key={album.id} value={album.name}>{album.name}</option>
            ))}
          </select>

          <div className="flex rounded-xl border border-surface-300 dark:border-surface-600 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300'} transition-colors`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('albums')}
              className={`px-3 py-2 ${viewMode === 'albums' ? 'bg-green-500 text-white' : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300'} transition-colors`}
            >
              <ApperIcon name="FolderOpen" className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-card"
          >
            <ApperIcon name="Upload" className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-green-500 text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              #{tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-lg text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Albums View */}
      {viewMode === 'albums' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Photo Albums</h3>
            <button
              onClick={() => setShowAlbumModal(true)}
              className="inline-flex items-center space-x-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-3 py-2 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Album</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {albums.map(album => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-soft transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedAlbum(album.name)}
              >
                <div className="aspect-square bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                  {album.coverPhoto ? (
                    <img
                      src={album.coverPhoto}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ApperIcon name="Image" className="w-12 h-12 text-surface-400" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-1">{album.name}</h4>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-500 mt-1">
                    Created {format(new Date(album.createdDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-surface-600 dark:text-surface-400">
              {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedAlbum !== 'all' && ` in ${selectedAlbum}`}
            </p>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Image" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No photos found</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {searchTerm || selectedTags.length > 0 ? 'Try adjusting your search or filters' : 'Upload your first photos to get started'}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                <ApperIcon name="Upload" className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
            </div>
          ) : (
            <div className="photo-grid">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-soft transition-all duration-200 group"
                >
                  <div className="relative aspect-square cursor-pointer" onClick={() => openLightbox(photo)}>
                    <img
                      src={photo.thumbnail}
                      alt={photo.description || photo.filename}
                      className="photo-thumbnail w-full h-full rounded-t-2xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <ApperIcon name="Expand" className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-surface-900 dark:text-white text-sm truncate">
                          {photo.description || photo.filename}
                        </h4>
                        <p className="text-xs text-surface-500 dark:text-surface-500">
                          {format(new Date(photo.uploadDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {photo.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {photo.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded">
                            +{photo.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-surface-500 dark:text-surface-500">
                      {(photo.size / 1024).toFixed(0)} KB • {photo.album}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => !isUploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Upload Photos</h2>
                {!isUploading && (
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Upload" className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-surface-900 dark:text-white font-medium mb-2">Uploading photos...</p>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{Math.round(uploadProgress)}% complete</p>
                </div>
              ) : (
                <div>
                  <div
                    {...getRootProps()}
                    className={`photo-upload-zone p-8 rounded-xl text-center cursor-pointer transition-all duration-200 ${
                      isDragActive ? 'dragover' : ''
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mx-auto">
                        <ApperIcon name="Upload" className="w-8 h-8 text-surface-400" />
                      </div>
                      <div>
                        <p className="text-surface-900 dark:text-white font-medium mb-1">
                          {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          or click to browse files
                        </p>
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-500">
                        Supports JPG, PNG, GIF, WebP • Max 5MB per file
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => open()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-card"
                    >
                      Browse Files
                    </button>

                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album Creation Modal */}
      <AnimatePresence>
        {showAlbumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowAlbumModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Create New Album</h2>
                <button
                  onClick={() => setShowAlbumModal(false)}
                  className="p-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Album Name
                  </label>
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="e.g., Corn Growth Season 2024"
                    className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:border-green-500 focus:ring-0 transition-colors"
                    autoFocus
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAlbumModal(false)}
                    className="flex-1 px-4 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlbum}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-card"
                  >
                    Create Album
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="photo-lightbox fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || selectedPhoto.filename}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
              
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mt-4 shadow-card">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">
                  {selectedPhoto.description || selectedPhoto.filename}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-400">
                  <span>Uploaded {format(new Date(selectedPhoto.uploadDate), 'MMM dd, yyyy')}</span>
                  <span>{(selectedPhoto.size / 1024).toFixed(0)} KB</span>
                  <span>{selectedPhoto.album}</span>
                </div>
                {selectedPhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedPhoto.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotoGallery