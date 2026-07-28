import React, { useState, useEffect, useRef } from 'react';
import { Character, type CharacterType, CHARACTER_LIST } from './characters';
import { STAGE_CONFIG, SONGS } from './config/dance';
import { io } from 'socket.io-client';

interface Gifter {
  id: string;
  username: string;
  isDancing: boolean;
  x: number;
  y: number;
  characterType: CharacterType;
  isVIP?: boolean;
  vipSpotName?: string;
  createdAt: number;
}

const VIP_POSITIONS = [
  { name: 'Table Center', x: 50, y: 50 },
  { name: 'Left Shrine', x: 25, y: 52 },
  { name: 'Right Shrine', x: 75, y: 52 },
];

const GIFTER_LIFETIME_MS = 15 * 60 * 1000; // 15 minutes for floor dancers
const VIP_LIFETIME_MS = 30 * 60 * 1000;     // 30 minutes for VIP dancers

export const Stage: React.FC = () => {
  const getRandomCharacterType = (): CharacterType => {
    const characterKeys = Object.keys(CHARACTER_LIST) as CharacterType[];
    const randomIndex = Math.floor(Math.random() * characterKeys.length);
    return characterKeys[randomIndex];
  };

  const generateRandomFloorPos = () => {
    const x = Math.floor(Math.random() * 84) + 8;
    const y = Math.floor(Math.random() * 29) + 66;
    return { x, y };
  };

  const [gifters, setGifters] = useState<Gifter[]>(() => {
    const now = Date.now();
    const characterKeys = Object.keys(CHARACTER_LIST) as CharacterType[];
    
    const sampleNames = [
      'Ko Gyi Kyaw', 
      'Ma Phae Wah', 
      'Kyaw Kyaw 55', 
      'Nilar 34', 
      'Aung San', 
      'Hla Hla'
    ];

    // 1. Generate 6 default floor dancers with varied characters
    const defaultFloorDancers: Gifter[] = Array.from({ length: 6 }, (_, index) => {
      const pos = generateRandomFloorPos();
      // Safely pick a diverse character type from your CHARACTER_LIST
      const randomType = characterKeys[index % characterKeys.length] || getRandomCharacterType();
      
      return {
        id: `default-floor-${index + 1}-${now}`,
        username: sampleNames[index % sampleNames.length],
        isDancing: true,
        x: pos.x,
        y: pos.y,
        characterType: randomType,
        isVIP: false,
        createdAt: now,
      };
    });

    // 2. Generate 1 default VIP dancer (using the center table position)
    const defaultVIPDancer: Gifter = {
      id: `default-vip-1-${now}`,
      username: 'Kyaw_Kyaw_76',
      isDancing: true,
      x: VIP_POSITIONS[0].x, // Table Center (50%)
      y: VIP_POSITIONS[0].y, // Table Center (50%)
      characterType: characterKeys[0] || 'ko-gyi-kyaw',
      isVIP: true,
      vipSpotName: VIP_POSITIONS[0].name,
      createdAt: now,
    };

    // 3. Combine them into the starting state
    return [...defaultFloorDancers, defaultVIPDancer];
  });

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getCrowdScale = (count: number) => {
    if (count <= 5) return 1.0;
    if (count <= 15) return 0.85;
    if (count <= 30) return 0.68;
    if (count <= 50) return 0.55;
    return 0.42;
  };

  const crowdScale = getCrowdScale(gifters.length);

  const unlockAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsAudioUnlocked(true))
        .catch((err) => console.warn('Audio play failed:', err));
    }
  };

  // Auto-despawn floor gifters (15 mins) and VIPs (30 mins)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setGifters((prev) =>
        prev.filter((g) => {
          const lifetime = g.isVIP ? VIP_LIFETIME_MS : GIFTER_LIFETIME_MS;
          return now - g.createdAt < lifetime;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGiftReceived = (
    username: string,
    characterType?: CharacterType,
    isVIPGift: boolean = false
  ) => {
    const selectedCharacter = characterType || getRandomCharacterType();
    const cleanUsername = username.replace(/^👑\s*VIP_?/i, '');

    setGifters((prev) => {
      if (prev.some((g) => g.username === cleanUsername)) return prev;

      if (isVIPGift) {
        const currentVIPs = prev.filter((g) => g.isVIP);
        const vipIndex = currentVIPs.length % VIP_POSITIONS.length;
        const targetSpot = VIP_POSITIONS[vipIndex];

        return [
          ...prev,
          {
            id: `${cleanUsername}-${Date.now()}`,
            username: cleanUsername,
            isDancing: true,
            x: targetSpot.x,
            y: targetSpot.y,
            characterType: selectedCharacter,
            isVIP: true,
            vipSpotName: targetSpot.name,
            createdAt: Date.now(),
          },
        ];
      }

      const pos = generateRandomFloorPos();
      return [
        ...prev,
        {
          id: `${cleanUsername}-${Date.now()}`,
          username: cleanUsername,
          isDancing: true,
          x: pos.x,
          y: pos.y,
          characterType: selectedCharacter,
          createdAt: Date.now(),
        },
      ];
    });

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  // WebSockets Connection
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on(
      'giftReceived',
      (data: { username: string; characterType?: CharacterType; isVIP?: boolean }) => {
        handleGiftReceived(data.username, data.characterType, data.isVIP || false);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <audio ref={audioRef} src={SONGS[currentSongIndex].url} loop={true} autoPlay={true} />

      {!isAudioUnlocked && (
        <div
          onClick={unlockAudio}
          className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer text-white"
        >
          <div className="text-3xl font-bold mb-2 animate-bounce">
            🔊 Click Anywhere to Start Music & Stage
          </div>
        </div>
      )}

      {/* Stage Background */}
      <img
        src={STAGE_CONFIG.backgroundImg}
        alt="Stage Hall"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dancers */}
      {gifters.map((gifter) => {
        let calculatedHeight = 220;
        let zIndex = 500;

        if (gifter.isVIP) {
          calculatedHeight = 230;
          zIndex = 850;
        } else {
          const depthRatio = (gifter.y - 66) / 29;
          const baseHeight = 160 + depthRatio * 160;
          calculatedHeight = Math.round(baseHeight * crowdScale);
          zIndex = Math.round(gifter.y * 10);
        }

        const minFontSize = gifters.length > 40 ? 7 : 9;
        const fontMultiplier = gifter.isVIP ? 0.09 : 0.075;
        const fontSize = Math.max(minFontSize, calculatedHeight * fontMultiplier);

        return (
          <div
            key={gifter.id}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${
              gifter.isVIP ? 'animate-bounce' : ''
            }`}
            style={{
              left: `${gifter.x}%`,
              top: `${gifter.y}%`,
              zIndex,
              animationDuration: gifter.isVIP ? '3s' : undefined,
            }}
          >
            <div className="flex flex-col items-center relative">
              {/* VIP Aura */}
              {gifter.isVIP && (
                <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full scale-150 pointer-events-none" />
              )}

              {/* Name Badge */}
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full shadow-2xl whitespace-nowrap mb-1 z-10 ${
                  gifter.isVIP
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black border border-yellow-100 shadow-amber-500/50'
                    : 'bg-black/80 text-amber-300 font-semibold border border-amber-400/50'
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {gifter.isVIP ? `👑 VIP: ${gifter.username}` : gifter.username}
              </span>

              {/* Character Render */}
              <div className="relative z-10">
                <Character
                  type={gifter.characterType}
                isDancing={gifter.isDancing}
                  height={calculatedHeight}
                />
              </div>

              {/* VIP Cloud Pedestal */}
              {gifter.isVIP && (
                <div
                  className="absolute -bottom-4 z-0 flex items-center justify-center pointer-events-none"
                  style={{ width: `${calculatedHeight * 0.9}px` }}
                >
                  <div className="absolute w-full h-8 bg-amber-300/30 rounded-full blur-md" />
                  <div className="relative flex items-center justify-center w-full h-7">
                    <div className="w-1/3 h-7 bg-gradient-to-t from-amber-200/90 to-amber-100/90 rounded-full shadow-lg border-b border-amber-300/50 -mr-2" />
                    <div className="w-1/2 h-10 bg-gradient-to-t from-amber-200/90 via-yellow-100/90 to-amber-50/90 rounded-full shadow-xl border-t border-amber-200 -mt-2 z-10" />
                    <div className="w-1/3 h-7 bg-gradient-to-t from-amber-200/90 to-amber-100/90 rounded-full shadow-lg border-b border-amber-300/50 -ml-2" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};