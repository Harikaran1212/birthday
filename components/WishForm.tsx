'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MediaCapturer = dynamic(() => import('./MediaCapturer'), { ssr: false });

interface WishFormProps {
  onWishAdded: () => void;
}

type WishType = 'text' | 'video' | 'voice';

export default function WishForm({ onWishAdded }: WishFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<WishType>('text');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCapturer, setShowCapturer] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedLabel, setCapturedLabel] = useState('');

  const resetCapture = () => { setCapturedBlob(null); setCapturedLabel(''); };

  const handleTypeChange = (t: WishType) => {
    setType(t);
    setShowCapturer(false);
    resetCapture();
  };

  const handleRecorded = (blob: Blob, _mimeType: string) => {
    setCapturedBlob(blob);
    const label = type === 'video' ? '🎥 Video recorded!' : '🎙️ Voice recorded!';
    setCapturedLabel(label);
    setShowCapturer(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Please fill in your name and message 💕');
      return;
    }
    if ((type === 'video' || type === 'voice') && !capturedBlob) {
      setError(`Please record a ${type} first! ${type === 'video' ? '🎥' : '🎙️'}`);
      return;
    }
    setLoading(true);
    setError('');

    try {
      let videoUrl = '';

      if (capturedBlob) {
        const formData = new FormData();
        const ext = type === 'video' ? 'webm' : 'webm';
        formData.append('video', capturedBlob, `recording.${ext}`);
        const uploadRes = await fetch('/api/wishes/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');
        videoUrl = uploadData.videoUrl;
      }

      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), type, videoUrl }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to save wish');

      setSuccess(true);
      setName('');
      setMessage('');
      setType('text');
      resetCapture();
      setShowCapturer(false);
      onWishAdded();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong 😢');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="wish-form" onSubmit={handleSubmit}>
      <h2 className="wish-form-title">💌 Send Your Wish to Suwathika</h2>

      {success && <div className="wish-success">🎉 Your wish has been sent! Suwathika will love it! 💖</div>}
      {error && <div className="wish-error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="wish-name">Your Name</label>
        <input
          id="wish-name"
          type="text"
          placeholder="Your beautiful name 🌸"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          maxLength={60}
          required
        />
      </div>

      <div className="form-group">
        <label>Wish Type</label>
        <div className="type-toggle">
          <button type="button" className={`toggle-btn ${type === 'text' ? 'toggle-active' : ''}`} onClick={() => handleTypeChange('text')}>
            💬 Text
          </button>
          <button type="button" className={`toggle-btn ${type === 'video' ? 'toggle-active' : ''}`} onClick={() => handleTypeChange('video')}>
            🎥 Video
          </button>
          <button type="button" className={`toggle-btn ${type === 'voice' ? 'toggle-active' : ''}`} onClick={() => handleTypeChange('voice')}>
            🎙️ Voice
          </button>
        </div>
      </div>

      {/* Camera / Mic capture */}
      {(type === 'video' || type === 'voice') && (
        <div className="form-group">
          <label>{type === 'video' ? 'Record Video 🎥' : 'Record Voice 🎙️'}</label>

          {!capturedBlob && !showCapturer && (
            <button
              type="button"
              className="file-label"
              style={{ display: 'flex', justifyContent: 'center' }}
              onClick={() => setShowCapturer(true)}
            >
              {type === 'video' ? '📷 Open Camera & Record' : '🎙️ Open Mic & Record'}
            </button>
          )}

          {capturedBlob && !showCapturer && (
            <div className="capturer-ready">
              <span>{capturedLabel}</span>
              <button type="button" className="toggle-btn" onClick={() => { resetCapture(); setShowCapturer(true); }}>
                🔄 Re-record
              </button>
            </div>
          )}

          {showCapturer && (
            <MediaCapturer
              mode={type as 'video' | 'voice'}
              onRecorded={handleRecorded}
              onCancel={() => setShowCapturer(false)}
            />
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="wish-message">
          {type === 'text' ? 'Your Birthday Message' : 'Brief Description (shown with your recording)'}
        </label>
        <textarea
          id="wish-message"
          placeholder={type === 'text' ? 'Write your heartfelt birthday wish... 💕' : 'A short description of your wish... 🌸'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-textarea"
          rows={4}
          maxLength={500}
          required
        />
        <span className="char-count">{message.length}/500</span>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <span className="btn-loading">Sending your love... 💫</span> : '🎂 Send Wish!'}
      </button>
    </form>
  );
}
