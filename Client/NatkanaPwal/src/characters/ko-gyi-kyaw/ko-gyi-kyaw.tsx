import React, { useState, useEffect } from 'react';

// Import frames from the subfolder "Dances" matching your file names
import dance1 from './Dances/Dance1.png';
import dance2 from './Dances/dances2.png';
import dance3 from './Dances/dances3.png';
import dance4 from './Dances/dances4.png';
import dance5 from './Dances/dances5.png';
import dance6 from './Dances/dances6.png';
import dance7 from './Dances/dances7.png';
import idle from './Dances/IDEL.png';

const DANCE_FRAMES = [
  dance1,
  dance2,
  dance3,
  dance4,
  dance5,
  dance6,
  dance7,
];

interface KoGyiKyawProps {
  isDancing: boolean;
  height: number;
  frameRateMs?: number;
}

export const KoGyiKyaw: React.FC<KoGyiKyawProps> = ({
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
        alt="Ko Gyi Kyaw"
        className="h-full w-auto object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
};