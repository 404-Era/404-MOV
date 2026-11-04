import React, { useEffect, useState } from 'react';

interface HeroVideoBackdropProps {
  isTyping?: boolean;
}

export const HeroVideoBackdrop: React.FC<HeroVideoBackdropProps> = ({ isTyping = false }) => {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Subtle natural mouse tilt tracking (constrained to ±5 deg)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = 200;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      const clampedX = Math.max(-5, Math.min(5, deltaX * 4));
      const clampedY = Math.max(-4, Math.min(4, deltaY * 3));

      setTilt({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none"
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(${isTyping ? 1.02 : 1})`,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* 
        Seamless Environmental Ambient Aura:
        Soft radar-green bloom matching the site's accent glow, anchoring the character naturally
      */}
      <div className="absolute inset-0 max-w-sm mx-auto bg-gradient-to-t from-[#00FFA3]/14 via-[#00FFA3]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* 
        Pure Isolated Character (Zero Video Edges, 100% Transparent Background)
        - Extracted directly from 1.mp4 footage with subpixel alpha antialiasing
        - Only the guy & cyber-camera are rendered
        - Absolutely no rectangular borders, no grey box, no detached boundary
        - Merges 100% seamlessly into the obsidian page background
      */}
      <img
        src="/assets/character_isolated.webp"
        alt="404MOV Cyberpunk Camera Operator"
        width={944}
        height={720}
        onLoad={() => setIsLoaded(true)}
        className={`w-auto h-[220px] sm:h-[260px] md:h-[290px] object-contain object-bottom pointer-events-none select-none transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          background: 'transparent'
        }}
      />
    </div>
  );
};
