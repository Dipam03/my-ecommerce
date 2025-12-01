import { useState } from 'react'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  if (!isOpen || !images || images.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full h-full max-w-4xl max-h-screen flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        {/* Image */}
        <img
          src={images[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            aria-label="Previous image"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            aria-label="Next image"
          >
            <FiChevronRight size={24} />
          </button>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center max-w-2xl">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-12 rounded overflow-hidden border-2 transition ${
                  idx === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
