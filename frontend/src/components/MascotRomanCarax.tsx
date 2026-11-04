import React, { useEffect, useState, useRef } from 'react';

interface MascotProps {
  isTyping: boolean;
}

export const MascotRomanCarax: React.FC<MascotProps> = ({ isTyping }) => {
  // Constrained tilt angle for mouse tracking (clamped to ±15 deg)
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamp tilt to ±15 degrees
      const clampedX = Math.max(-15, Math.min(15, deltaX * 14));
      const clampedY = Math.max(-10, Math.min(15, deltaY * 10));

      setTilt({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // When user is typing in search, tilts down toward search bar
  const effectiveTiltX = isTyping ? tilt.x * 0.35 : tilt.x;
  const effectiveTiltY = isTyping ? Math.max(7, tilt.y * 0.4 + 7) : tilt.y;

  return (
    /* 
      Fixed DIV container for the mascot behind the search bar (id="mascot-container")
      CSS tracking, tilt animations, and breathing applied to this container DIV, not the image itself
    */
    <div
      id="mascot-container"
      ref={containerRef}
      className="relative flex justify-center items-end select-none pointer-events-none w-full max-w-lg mx-auto carax-breathing"
      style={{
        height: '210px',
        marginBottom: '-14px', // Torso sits naturally emerged directly behind the search input
        zIndex: 10,
        transform: `perspective(800px) rotateY(${effectiveTiltX * 0.7}deg) rotateX(${-effectiveTiltY * 0.4}deg) translateY(${effectiveTiltY * 0.25}px)`,
        transformOrigin: 'center bottom',
        transition: 'transform 0.12s cubic-bezier(0.1, 0.8, 0.3, 1)'
      }}
    >
      {/* Standard <img> tag pointing to /assets/mascot.png with zero CSS shapes/drawings */}
      <img
        src="/assets/mascot.png"
        alt="404MOV Mascot"
        className="w-auto h-full max-h-[210px] object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] pointer-events-none"
      />
    </div>
  );
};
