'use client';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';

const WaveformIcon = ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 120 28" className="h-7 w-full text-muted-foreground" fill="currentColor">
      <rect x="0" y="12" width="3" height={isPlaying ? "20" : "6"} rx="1.5"><animate attributeName="height" values="6;28;6" begin="0s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /><animate attributeName="y" values="12;0;12" begin="0s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /></rect>
      <rect x="5" y="12" width="3" height={isPlaying ? "24" : "12"} rx="1.5"><animate attributeName="height" values="12;28;12" begin="0.1s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /><animate attributeName="y" values="8;0;8" begin="0.1s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /></rect>
      <rect x="10" y="12" width="3" height={isPlaying ? "18" : "8"} rx="1.5"><animate attributeName="height" values="8;22;8" begin="0.2s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /><animate attributeName="y" values="10;3;10" begin="0.2s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /></rect>
      <rect x="15" y="12" width="3" height={isPlaying ? "28" : "4"} rx="1.5"><animate attributeName="height" values="4;28;4" begin="0.3s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /><animate attributeName="y" values="12;0;12" begin="0.3s" dur="1s" repeatCount={isPlaying ? "indefinite" : "0"} /></rect>
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={20 + i * 5} y="12" width="3" height={Math.floor(Math.random() * 15) + 4} rx="1.5" />
      ))}
    </svg>
  );

export default function VoiceNotePlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);


  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

   const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);
      const onLoadedMetadata = () => setDuration(audio.duration);
      const onTimeUpdate = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('timeupdate', onTimeUpdate);
      
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, []);

  return (
    <div className="flex items-center gap-3 w-64">
      <Button variant="ghost" size="icon" onClick={togglePlay} className="w-9 h-9 shrink-0 bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary">
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>
      <div className="flex-1 h-1 bg-muted-foreground/30 rounded-full" ref={progressRef}>
        <div 
          className="h-1 bg-primary rounded-full" 
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
       <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(duration - currentTime)}</span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
