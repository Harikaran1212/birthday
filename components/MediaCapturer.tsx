'use client';

import { useState, useRef, useEffect } from 'react';

interface MediaRecorderProps {
  mode: 'video' | 'voice';
  onRecorded: (blob: Blob, mimeType: string) => void;
  onCancel: () => void;
}

export default function MediaCapturer({ mode, onRecorded, onCancel }: MediaRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [phase, setPhase] = useState<'preview' | 'recording' | 'done'>('preview');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState('');

  // Start the camera/mic stream
  useEffect(() => {
    (async () => {
      try {
        const constraints =
          mode === 'video'
            ? { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true }
            : { audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (mode === 'video' && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      } catch {
        setError('Could not access camera/microphone. Please allow permission and try again. 📷');
      }
    })();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Timer while recording
  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const getMimeType = () => {
    if (mode === 'video') {
      return MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';
    }
    return MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/ogg;codecs=opus';
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: getMimeType() });
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: getMimeType().split(';')[0] });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedUrl(url);
      setPhase('done');
      // Stop camera preview stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    mr.start(250);
    mediaRecorderRef.current = mr;
    setSeconds(0);
    setPhase('recording');
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleUse = () => {
    if (recordedBlob) onRecorded(recordedBlob, getMimeType().split(';')[0]);
  };

  const handleRetry = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl('');
    setSeconds(0);
    setPhase('preview');
    // Restart stream
    (async () => {
      try {
        const constraints =
          mode === 'video'
            ? { video: { facingMode: 'user' }, audio: true }
            : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (mode === 'video' && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      } catch {
        setError('Could not restart camera. Please refresh the page.');
      }
    })();
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="media-capturer">
      {error ? (
        <div className="capturer-error">
          <span>⚠️</span>
          <p>{error}</p>
          <button className="toggle-btn" onClick={onCancel}>Go Back</button>
        </div>
      ) : (
        <>
          {/* Video preview or mic icon */}
          {mode === 'video' ? (
            phase !== 'done' ? (
              <div className="capturer-video-wrapper">
                <video ref={videoRef} className="capturer-video" playsInline />
                {phase === 'recording' && (
                  <div className="capturer-recording-badge">
                    <span className="rec-dot" />
                    REC {formatTime(seconds)}
                  </div>
                )}
              </div>
            ) : (
              <div className="capturer-video-wrapper">
                <video src={recordedUrl} className="capturer-video" controls />
                <div className="capturer-done-badge">✅ Preview your video</div>
              </div>
            )
          ) : (
            /* Voice mode — mic illustration */
            <div className="capturer-voice-display">
              <div className={`capturer-mic-icon ${phase === 'recording' ? 'capturer-mic-pulse' : ''}`}>
                🎙️
              </div>
              {phase === 'preview' && <p className="capturer-voice-hint">Press record to start your voice wish</p>}
              {phase === 'recording' && (
                <div className="capturer-voice-timer">
                  <span className="rec-dot" /> Recording… {formatTime(seconds)}
                </div>
              )}
              {phase === 'done' && (
                <div className="capturer-voice-done">
                  <p>✅ Voice recorded!</p>
                  <audio src={recordedUrl} controls className="capturer-audio" />
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="capturer-controls">
            {phase === 'preview' && (
              <>
                <button className="submit-btn" style={{ maxWidth: '200px' }} onClick={startRecording}>
                  {mode === 'video' ? '🎥 Start Recording' : '🎙️ Start Recording'}
                </button>
                <button className="toggle-btn" onClick={onCancel}>Cancel</button>
              </>
            )}
            {phase === 'recording' && (
              <button className="submit-btn" style={{ maxWidth: '200px', background: 'linear-gradient(135deg,#e11d48,#be123c)' }} onClick={stopRecording}>
                ⏹️ Stop Recording
              </button>
            )}
            {phase === 'done' && (
              <>
                <button className="submit-btn" style={{ maxWidth: '200px' }} onClick={handleUse}>
                  ✨ Use This {mode === 'video' ? 'Video' : 'Voice'}
                </button>
                <button className="toggle-btn" onClick={handleRetry}>🔄 Retry</button>
                <button className="toggle-btn" onClick={onCancel}>Cancel</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
