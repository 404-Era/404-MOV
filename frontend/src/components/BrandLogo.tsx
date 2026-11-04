import React, { useState } from 'react';

interface BrandLogoProps {
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="fixed top-5 left-7 z-50 cursor-pointer select-none group flex items-center"
      title="404MOV - Rapid Movie Decision Engine"
    >
      {/* Periodic keyframe glitch effect applied strictly to image container DIV */}
      <div className="relative inline-block glitch-logo transition-transform duration-200 group-hover:scale-105">
        {!imageError ? (
          <img
            src="/assets/logo.png"
            alt="404MOV"
            onError={() => setImageError(true)}
            className="h-10 md:h-12 w-auto object-contain"
          />
        ) : (
          /* Clean fallback text if external graphic asset is unavailable */
          <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-[#FCEE09] font-['Orbitron',sans-serif]">
            404MOV
          </span>
        )}
      </div>
    </div>
  );
};
