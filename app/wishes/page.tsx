'use client';

import { useState, useEffect, useCallback } from 'react';
import WishCard from '@/components/WishCard';
import WishForm from '@/components/WishForm';

interface Wish {
  _id: string;
  name: string;
  message: string;
  type: 'text' | 'video';
  videoUrl?: string;
  createdAt: string;
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      if (data.success) setWishes(data.data);
    } catch (err) {
      console.error('Failed to fetch wishes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  const handleWishAdded = () => {
    fetchWishes();
    setShowForm(false);
    // Scroll to wishes wall
    document.getElementById('wishes-wall')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="wishes-page">
      <section className="wishes-hero">
        <div className="page-header">
          <h1 className="page-title">💌 Birthday Wishes</h1>
          <p className="page-subtitle">
            Share your love and warm wishes for Suwathika&apos;s special day! 🎂
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setTimeout(() => {
                document.getElementById('wish-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            {showForm ? '✕ Close Form' : '💌 Send a Wish'}
          </button>
        </div>
      </section>

      {/* Wish Form */}
      {showForm && (
        <section id="wish-form-section" className="wish-form-section">
          <WishForm onWishAdded={handleWishAdded} />
        </section>
      )}

      {/* Wishes Wall */}
      <section id="wishes-wall" className="wishes-wall-section">
        <h2 className="section-title">🎉 Wishes Wall</h2>

        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner">💕</span>
            <p>Loading wishes...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💝</span>
            <p>No wishes yet! Be the first to send Suwathika a wish 🌸</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              💌 Send First Wish!
            </button>
          </div>
        ) : (
          <>
            <p className="wishes-count">✨ {wishes.length} beautiful wish{wishes.length !== 1 ? 'es' : ''} from loving hearts</p>
            <div className="wishes-grid">
              {wishes.map((wish) => (
                <WishCard
                  key={wish._id}
                  name={wish.name}
                  message={wish.message}
                  type={wish.type}
                  videoUrl={wish.videoUrl}
                  createdAt={wish.createdAt}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
