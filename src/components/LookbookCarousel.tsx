import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { useLooks } from '../features/looks';
import { useCart } from '../context/CartContext';

export const LookbookCarousel: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { setSelectedLookForStudio } = useCart();
  const { looks } = useLooks();

  const currentLook = looks[currentIdx] ?? looks[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + looks.length) % looks.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % looks.length);
  };

  // Aucun look publié : on n'affiche pas la section
  if (!currentLook) return null;

  return (
    <section className="py-16 sm:py-20 px-4 md:px-8 max-w-[1440px] mx-auto overflow-hidden" id="lookbook">
      {/* Stage Frame with Watermark Typographic Backdrop */}
      <div className="relative bg-gradient-to-b from-[#CAD2D5] to-[#DCE2E4] rounded-[36px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 border border-white/60 shadow-inner flex flex-col items-center">
        {/* Giant Backing Typographic Backdrop Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none opacity-40 overflow-hidden">
          <div className="text-[70px] sm:text-[120px] md:text-[180px] font-display font-black watermark-text tracking-tighter whitespace-nowrap pl-4 sm:pl-8">
            SUBLIMEZ
          </div>
          <div className="text-[70px] sm:text-[120px] md:text-[180px] font-display font-black watermark-text tracking-tighter whitespace-nowrap pl-8 sm:pl-16 pb-4">
            VOTRE STYLE
          </div>
        </div>

        {/* Carousel Navigation Tabs */}
        <div className="relative z-20 flex flex-wrap justify-center gap-1.5 sm:gap-2 bg-black/10 backdrop-blur-md p-1.5 rounded-full mb-8 max-w-full">
          {looks.map((look, idx) => (
            <button
              key={look.id}
              onClick={() => setCurrentIdx(idx)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-mono uppercase transition-all cursor-pointer ${
                currentIdx === idx
                  ? 'bg-black text-white shadow-md'
                  : 'text-black/70 hover:text-black hover:bg-white/40'
              }`}
            >
              Look {look.number} / {look.name.split('/')[0].trim()}
            </button>
          ))}
        </div>

        {/* Feature Center Spotlight Poster Card */}
        <div className="relative z-10 w-full max-w-[540px] h-[600px] sm:h-[680px] md:h-[720px] rounded-[32px] sm:rounded-[36px] bg-[#1E2022] shadow-2xl overflow-hidden border border-white/20 transition-all duration-500 group">
          {/* Main Image Display Container */}
          <img
            key={currentLook.heroImage}
            src={currentLook.heroImage}
            alt={currentLook.name}
            className="w-full h-full object-cover object-center filter contrast-105 transition-all duration-500 group-hover:scale-105 select-none"
          />

          {/* Technical Specification Callouts Overlaid Directly on the Card */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between pointer-events-none text-white font-mono bg-gradient-to-t from-black/60 via-transparent to-black/50">
            {/* Top Spec Header */}
            <div className="flex justify-between items-start">
              <div className="text-xs uppercase tracking-wider text-white/90 drop-shadow-sm">
                <div className="font-bold">{currentLook.topLeftTitle}</div>
                <div className="text-[10px] text-white/70">{currentLook.topLeftSubtitle}</div>
              </div>
              <div className="text-right text-xs uppercase tracking-wider text-white/90 drop-shadow-sm">
                <div className="font-bold">{currentLook.topRightTitle}</div>
                <div className="text-[10px] text-white/70">{currentLook.topRightSubtitle}</div>
              </div>
            </div>

            {/* Mid Center Badge Floating Label */}
            <div className="self-center bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-center shadow-lg">
              <span className="text-[11px] sm:text-xs font-display font-black tracking-widest text-white uppercase">
                {currentLook.badge}
              </span>
            </div>

            {/* Bottom Spec Callouts & Action Trigger */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-xs uppercase tracking-wider text-white/90 drop-shadow-sm">
                  <div className="font-bold">{currentLook.bottomLeftTitle}</div>
                  <div className="text-[10px] text-white/70">{currentLook.bottomLeftSubtitle}</div>
                </div>
                <div className="text-right text-xs uppercase tracking-wider text-white/90 drop-shadow-sm">
                  <div className="font-bold">{currentLook.bottomRightTitle}</div>
                  <div className="text-[10px] text-white/70">{currentLook.bottomRightSubtitle}</div>
                </div>
              </div>

              {/* Interactive Inspect Outfit Button */}
              <div className="pt-2 border-t border-white/10 flex justify-center pointer-events-auto">
                <button
                  onClick={() => setSelectedLookForStudio(currentLook)}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider font-semibold py-2.5 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Voir & Commander la tenue</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Switcher Controls */}
        <div className="relative z-20 flex items-center space-x-4 mt-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
            title="Previous Look"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold tracking-widest">
            0{currentIdx + 1} / 0{looks.length}
          </span>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
            title="Next Look"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
