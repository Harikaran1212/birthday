'use client';

import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  animDuration: number;
  animDelay: number;
  fontSize: number;
  emoji: string;
}

const EMOJIS = ['💕', '💖', '💗', '💓', '🌸', '✨', '🎀', '💝'];

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animDuration: 6 + Math.random() * 8,
      animDelay: Math.random() * 10,
      fontSize: 14 + Math.random() * 22,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="floating-hearts-container" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.animDuration}s`,
            animationDelay: `${h.animDelay}s`,
            fontSize: `${h.fontSize}px`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
