import MemoryGallery from '@/components/MemoryGallery';
import { readdirSync } from 'fs';
import path from 'path';

function getImages(): string[] {
  try {
    const assetsDir = path.join(process.cwd(), 'public', 'assets');
    const files = readdirSync(assetsDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
    return files
      .filter((file) => imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)))
      .map((file) => `/assets/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

export default function MemoriesPage() {
  const images = getImages();

  return (
    <main className="memories-page">
      <section className="memories-hero">
        <div className="page-header">
          <h1 className="page-title">📸 Memories</h1>
          <p className="page-subtitle">
            A collection of beautiful moments with Suwathika 💕
          </p>
        </div>
      </section>

      {images.length === 0 ? (
        <div className="empty-state" style={{ padding: '4rem 1rem' }}>
          <span style={{ fontSize: '3.5rem' }}>📷</span>
          <p>No memories added yet. Add images to <code>public/assets/</code></p>
        </div>
      ) : (
        <section className="memories-grid-section">
          <MemoryGallery images={images} />
        </section>
      )}

      <div className="memories-footer-text">
        <p>Every picture tells a story of love and friendship 🌸</p>
      </div>
    </main>
  );
}
