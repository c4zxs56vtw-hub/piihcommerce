import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const VideoModal: React.FC = () => {
  const { isVideoModalOpen, setIsVideoModalOpen } = useCart();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(24);

  useEffect(() => {
    let interval: any;
    if (isVideoModalOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isVideoModalOpen, isPlaying]);

  if (!isVideoModalOpen) return null;

  const currentSeconds = Math.floor((progress / 100) * 84);
  const formattedTime = `00:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / 01:24`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-950 text-white rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/60">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              C'KENNEDY // PRÉSENTATION
            </span>
            <h2 className="text-lg sm:text-xl font-display font-black uppercase">
              L'ATELIER C'KENNEDY — NOTRE UNIVERS
            </h2>
          </div>
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Simulator */}
        <div className="relative w-full h-72 sm:h-96 md:h-[480px] bg-neutral-900 overflow-hidden flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9bLiOJEmQ_xElT-HzdVG4FN8VSnqY9wdz2gI30vt1hbDqJVbNJ7JsRNwcMB7cBdKeZOe88CZUn1fvzK59ZytdaMwceAzdXvwj79sE4UJVsPBnWqQH2Omxtdf1ditooVZllFqy8GN4dODIIYwfvSLaECGTeD3gQ1UbQYwvUOTh9tww0UP5LUppgE57NO-nPi_ydC84md4nEuJKN3LorfdxOntvItLr3GizWGOJaGqgD-BVThCIjdk9Rg"
            alt="The Winter Lab Documentary"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isPlaying ? 'scale-105 filter contrast-110' : 'filter grayscale contrast-90'
            }`}
          />

          {/* Technical HUD Overlay Grid */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between font-mono text-[11px] text-white/70">
            <div className="flex justify-between items-start">
              <span className="bg-red-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider animate-pulse">
                REC • 4K 60FPS
              </span>
              <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                TEMPERATUE: -12.4°C // WIND: 38 KM/H
              </span>
            </div>

            <div className="self-center text-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <span className="text-white font-bold tracking-widest uppercase">
                C'KENNEDY — SUBLIMEZ VOTRE STYLE
              </span>
            </div>

            <div className="flex justify-between items-end">
              <span>GPS: 45°24'11"N 6°58'32"E</span>
              <span>BIOMECHANICAL DRAG: OPTIMAL (-34%)</span>
            </div>
          </div>

          {/* Center Play/Pause button on hover/click */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black" />
              ) : (
                <Play className="w-6 h-6 fill-black ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Video Control Bar */}
        <div className="p-4 bg-neutral-900 border-t border-white/10 space-y-2">
          {/* Progress Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.round((clickX / rect.width) * 100));
            }}
            className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
          >
            <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex justify-between items-center text-xs font-mono pt-1 text-white/80">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span>{formattedTime}</span>
            </div>

            <div className="text-[11px] text-white/50">
              AUDIO: DUAL CHANNEL FIELD AMBIENCE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
