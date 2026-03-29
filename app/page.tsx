import FloatingHearts from '@/components/FloatingHearts';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home-page">
      <FloatingHearts />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-pre">🎀 Today is a Very Special Day 🎀</p>
          <h1 className="hero-title">
            Happy Birthday
            <span className="hero-name">Suwathika!</span>
          </h1>
          <div className="hero-cake">🎂</div>
          <p className="hero-subtitle">
            Wishing you a day filled with love, laughter, and all the happiness your heart can hold. 
            You deserve every beautiful thing life has to offer! 🌸
          </p>

          {/* <div className="hero-buttons">
            <Link href="/memories" className="btn-primary">
              📸 View Memories
            </Link>
            <Link href="/wishes" className="btn-secondary">
              💌 See Wishes
            </Link>
          </div> */}
        </div>

        {/* Decorative balloons */}
        <div className="balloon balloon-1">🎈</div>
        <div className="balloon balloon-2">🎈</div>
        <div className="balloon balloon-3">🎈</div>
        <div className="balloon balloon-4">🎈</div>
      </section>

      {/* Message Section */}
      <section className="home-message-section">
        <div className="home-message-card">
          <h2 className="home-message-heading">A Special Message 💝</h2>
          <p className="home-message-text">
           Sisters like you make life brighter, warmer, and more meaningful. Your love, your support, and your laughter make every moment special. On your birthday, I wish you endless happiness, beautiful memories, and all the success you deserve. Happy Birthday to the most amazing sister. 
          </p>
          <p className="home-message-text">
            May this year bring you everything you&apos;ve ever dreamed of and more! 
            Here&apos;s to you, Suwathika! 🥂✨
          </p>
          <div className="home-message-emojis">🌸 💕 🎂 ✨ 💖 🌟 🎀 🌺</div>
        </div>

        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-icon">📸</span>
            <span className="stat-label">Memories</span>
            <span className="stat-desc">Captured moments of joy</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💌</span>
            <span className="stat-label">Wishes</span>
            <span className="stat-desc">From hearts full of love</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💖</span>
            <span className="stat-label">Love</span>
            <span className="stat-desc">From everyone who cares</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎂</span>
            <span className="stat-label">Birthday</span>
            <span className="stat-desc">For you</span>
          </div>
        </div>
      </section>
    </main>
  );
}
