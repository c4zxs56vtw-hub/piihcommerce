import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';

/**
 * Hero Section premium -- 100 % Tailwind CSS.
 *
 * Images : remplace les src par tes propres URLs ou place tes fichiers dans
 * public/images/ (hero-1.webp, hero-2.webp, hero-3.webp).
 */
const SLIDES = [
  {
    id: 1,
    src: '/images/hero-1.png',
    alt: 'Diptyque mode et design contemporain',
  },
  {
    id: 2,
    src: '/images/hero-2.jpg',
    alt: 'Élégance en veste cuir marron au showroom',
  },
  {
    id: 3,
    src: '/images/hero-3.png',
    alt: 'Élégance moderne au showroom',
  },
] as const;

const SLIDE_DURATION_MS = 3500;

const imageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 36,
    scale: 1.035,
    filter: 'blur(6px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -32,
    scale: 0.985,
    filter: 'blur(5px)',
  }),
};

export const HeroSection: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { amount: 0.25 });
  const reduceMotion = Boolean(useReducedMotion());

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    // Precharge les deux images suivantes pour eviter un clignotement.
    SLIDES.slice(1).forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!isInView || !tabVisible || hovered || focused || paused || reduceMotion) return;

    const timer = window.setTimeout(() => {
      setDirection(1);
      setImageError(false);
      setCurrent((index) => (index + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [current, isInView, tabVisible, hovered, focused, paused, reduceMotion]);

  const goTo = (index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setImageError(false);
    setCurrent(index);
  };

  const move = (step: number) => {
    setDirection(step);
    setImageError(false);
    setCurrent((index) => (index + step + SLIDES.length) % SLIDES.length);
  };

  const activeSlide = SLIDES[current];
  const intro = { duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      aria-label="Collections a la une"
      className="mx-auto w-full max-w-[1450px] px-2 pb-8 pt-2 text-[#111315] sm:px-4 lg:px-5"
    >
      <div
        ref={stageRef}
        className="relative isolate w-full overflow-hidden rounded-[26px] border border-white/75 bg-[linear-gradient(180deg,#cad9de_0%,#dae4e7_46%,#eef1f1_83%,#f7f7f5_100%)] sm:rounded-[36px] lg:h-[clamp(600px,58vw,780px)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
      >
        {/* Fine geometric lines behind all content. */}
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 1200 650"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.15"
          aria-hidden="true"
        >
          <path d="M-60 115 C100 230 380 350 600 505 C820 350 1100 230 1260 115" />
          <path d="M-90 235 L600 610 L1290 235" />
          <path d="M-90 355 L600 680 L1290 355" />
          <path d="M145 -55 C95 95 180 160 600 400 C1020 160 1105 95 1055 -55" />
        </svg>
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_96%,rgba(255,255,255,0.55),transparent_58%)]"
          aria-hidden="true"
        />

        {/* Title and CTA stay outside the photos. */}
        <header className="relative z-20 px-2 pt-8 text-center sm:px-5 sm:pt-9 lg:pt-10">
          <motion.h1
            className="mx-auto max-w-[1050px] font-sans text-[clamp(23px,4.5vw,61px)] font-extrabold uppercase leading-[0.96] tracking-[-0.055em] text-[#111315] drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={intro}
          >
            <span className="block whitespace-nowrap">DRESS DIFFERENT.</span>
            <span className="block whitespace-nowrap">BE C'KENNEDY.</span>
          </motion.h1>

          <motion.nav
            aria-label="Explorer les collections"
            className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ ...intro, delay: reduceMotion ? 0 : 0.18 }}
          >
            <a
              href="#trending"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#111315] px-6 text-[10px] font-semibold uppercase tracking-[0.02em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              Shop now
            </a>
            <a
              href="#lookbook"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.02em] text-[#111315] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              New Collection
            </a>
          </motion.nav>
        </header>

        {/* Image carousel — remplit toute la hauteur du stage */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-roledescription="carrousel"
          aria-label={`Visuel ${current + 1} sur ${SLIDES.length}`}
        >
          {/* Overlay léger — juste assez pour garder le texte lisible */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[rgba(202,217,222,0.35)] via-transparent to-[rgba(238,241,241,0.30)]" aria-hidden="true" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[rgba(202,217,222,0.20)] via-transparent to-[rgba(202,217,222,0.20)]" aria-hidden="true" />

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center px-5 text-center">
              <p className="max-w-sm rounded-xl bg-white/90 px-5 py-3 text-sm text-red-700 shadow-sm" role="status">
                Image introuvable : public{activeSlide.src}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={activeSlide.id}
                className="absolute inset-0"
                custom={direction}
                variants={imageVariants}
                initial={reduceMotion ? false : 'enter'}
                animate="center"
                exit={reduceMotion ? undefined : 'exit'}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  className="h-full w-full select-none object-cover object-center"
                  draggable={false}
                  loading={current === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => setImageError(true)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Low-profile carousel controls. */}
        <div
          className="relative z-30 mx-auto mb-5 mt-5 flex w-max max-w-[95%] items-center justify-center gap-1 rounded-full border border-white/70 bg-white/90 px-2 py-1 shadow-md backdrop-blur-sm lg:absolute lg:bottom-[4%] lg:left-1/2 lg:mx-0 lg:mb-0 lg:mt-0 lg:-translate-x-1/2"
          role="group"
          aria-label="Changer de collection"
        >
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Visuel precedent"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {SLIDES.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => goTo(index)}
              aria-label={`Afficher le visuel ${index + 1}`}
              aria-pressed={current === index}
              className="grid h-9 min-w-6 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-200 ${
                  current === index ? 'w-6 bg-[#23272a]' : 'w-1.5 bg-[#9aa8ad]'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Visuel suivant"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Relancer le defilement' : 'Mettre le defilement en pause'}
              aria-pressed={paused}
              className="ml-1 grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
            >
              {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
