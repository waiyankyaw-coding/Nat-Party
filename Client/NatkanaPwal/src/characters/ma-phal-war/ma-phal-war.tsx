import React, { useState, useEffect } from 'react';

// Import all dance pose frames and idle image
import dance1 from './dance1.png';
import dance2 from './dance2.png';
import dance3 from './dance3.png';
import dance4 from './dance4.png';
import dance5 from './dance5.png';
import dance6 from './dance6.png';
import idle from './IDEL.png';

const DANCE_FRAMES = [dance1, dance2, dance3, dance4, dance5, dance6];

interface MaPhalWarProps {
  isDancing: boolean;
  height: number;
  frameRateMs?: number; // Speed of pose switching (default: 250ms)
}

export const MaPhalWar: React.FC<MaPhalWarProps> = ({
  isDancing,
  height,
  frameRateMs = 250,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    // If character is not dancing, reset frame
    if (!isDancing) {
      setCurrentFrameIndex(0);
      return;
    }

    // Cycle through dance poses sequentially
    const interval = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % DANCE_FRAMES.length);
    }, frameRateMs);

    return () => clearInterval(interval);
  }, [isDancing, frameRateMs]);

  // Determine current image source
  const currentImage = isDancing ? DANCE_FRAMES[currentFrameIndex] : idle;

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none transition-all duration-100"
      style={{ height: `${height}px` }}
    >
      <img
        src={currentImage}
        alt="Ma Phal War"
        className="h-full w-auto object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
};
