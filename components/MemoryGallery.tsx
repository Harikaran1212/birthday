'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface MemoryGalleryProps {
  images: string[];
}

export default function MemoryGallery({ images }: MemoryGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (src: string, idx: number) => {
    setLightboxSrc(src);
    setLightboxIndex(idx);
  };

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const goNext = useCallback(() => {
    const next = (lightboxIndex + 1) % images.length;
    setLightboxIndex(next);
    setLightboxSrc(images[next]);
  }, [lightboxIndex, images]);

  const goPrev = useCallback(() => {
    const prev = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(prev);
    setLightboxSrc(images[prev]);
  }, [lightboxIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxSrc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxSrc, closeLightbox, goNext, goPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxSrc ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxSrc]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="memories-grid">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="memory-card"
            onClick={() => openLightbox(src, idx)}
            role="button"
            tabIndex={0}
            aria-label={`View memory ${idx + 1}`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(src, idx)}
            style={{ cursor: 'pointer' }}
          >
            <div className="memory-image-wrapper">
              <Image
                src={src}
                alt={`Memory ${idx + 1} of Suwathika`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="memory-image"
                style={{ objectFit: 'cover' }}
              />
              <div className="memory-overlay">
                <span className="memory-overlay-icon">🔍</span>
                <span className="memory-overlay-text">Memory #{idx + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div className="lightbox-backdrop" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>

            {/* Prev */}
            {images.length > 1 && (
              <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Previous">‹</button>
            )}

            {/* Image */}
            <div className="lightbox-image-wrapper">
              <Image
                src={lightboxSrc}
                alt={`Memory ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {/* Next */}
            {images.length > 1 && (
              <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Next">›</button>
            )}

            {/* Counter */}
            <div className="lightbox-counter">{lightboxIndex + 1} / {images.length} 💕</div>
          </div>
        </div>
      )}
    </>
  );
}
