import React, { useState, useEffect } from 'react';

import dance1 from './dance1.png';
import dance2 from './dance2.png';
import dance3 from './dance3.png';
import dance4 from './dance4.png';
import dance5 from './dance5.png';
import dance6 from './dance6.png';
import dance7 from './dance7.png';
import dance8 from './dance8.png';
import dance9 from './dance9.png';
import dance10 from './dance10.png';
import idle from './IDEL.png';

const DANCE_FRAMES = [
  dance1,
  dance2,
  dance3,
  dance4,
  dance5,
  dance6,
  dance7,
  dance8,
  dance9,
  dance10,
];

interface ThagyarMinProps {
  isDancing: boolean;
  height: number;
  frameRateMs?: number;
}

export const ThagyarMin: React.FC<ThagyarMinProps> = ({
  isDancing,
  height,
  frameRateMs = 220,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    if (!isDancing) {
      setCurrentFrameIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % DANCE_FRAMES.length);
    }, frameRateMs);

    return () => clearInterval(interval);
  }, [isDancing, frameRateMs]);

  const currentImage = isDancing ? DANCE_FRAMES[currentFrameIndex] : idle;

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none transition-all duration-100"
      style={{ height: `${height}px` }}
    >
      <img
        src={currentImage}
        alt="Thagyar Min"
        className="h-full w-auto object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
};