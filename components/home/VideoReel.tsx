'use client';

import { useEffect, useRef } from 'react';

export default function VideoReel() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !mq.matches) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto w-[240px] sm:w-[280px]">
      <div className="overflow-hidden rounded-[2rem] border-[6px] border-ink-900/90 bg-black shadow-lg">
        <video
          ref={ref}
          aria-label="A Cut Above Lawn Care featured by Greenworks Commercial for switching to electric equipment"
          muted
          loop
          playsInline
          preload="none"
          poster="/videos/reel-poster.jpg"
          className="aspect-[9/16] w-full object-cover"
        >
          <source src="/videos/reel.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
