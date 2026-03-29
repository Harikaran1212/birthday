'use client';

interface WishCardProps {
  name: string;
  message: string;
  type: 'text' | 'video' | 'voice';
  videoUrl?: string;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_BADGE: Record<string, string> = {
  video: '🎥 Video',
  voice: '🎙️ Voice',
  text: '💬 Text',
};

export default function WishCard({ name, message, type, videoUrl, createdAt }: WishCardProps) {
  return (
    <div className="wish-card">
      <div className="wish-card-header">
        <div className="wish-avatar">{name.charAt(0).toUpperCase()}</div>
        <div>
          <p className="wish-name">{name}</p>
          <p className="wish-time">{timeAgo(createdAt)}</p>
        </div>
        <span className="wish-type-badge">{TYPE_BADGE[type] ?? '💬 Text'}</span>
      </div>

      {type === 'video' && videoUrl ? (
        <div className="wish-video-wrapper">
          <video src={videoUrl} controls className="wish-video" preload="metadata" />
        </div>
      ) : type === 'voice' && videoUrl ? (
        <div className="wish-audio-wrapper">
          <span className="wish-audio-icon">🎙️</span>
          <audio src={videoUrl} controls className="wish-audio" preload="metadata" />
        </div>
      ) : null}

      <p className="wish-message">&quot;{message}&quot;</p>
      <div className="wish-card-footer">
        <span className="wish-heart">💖</span>
      </div>
    </div>
  );
}
