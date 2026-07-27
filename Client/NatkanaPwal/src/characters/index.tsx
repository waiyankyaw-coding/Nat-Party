import React from 'react';
import { AmyaKyewl } from './amay-kyewl/amya-kyewl';
import { AmayYayYin } from './amay-yay-yin/amay-yay-yin';
import { AmayYayYin2 } from './amay-yay-yin-2/amay-yay-yin-2';
import { BaLuee } from './ba-luee/ba-luee';
import { KoGyiKyaw } from './ko-gyi-kyaw/ko-gyi-kyaw';
import { MaPhalWar } from './ma-phal-war/ma-phal-war';
import { ThagyarMin } from './thagyar-min/thagyarmin';
import { YokeKaSoe } from './yoke-ka-soe/yoke-ka-soe';

export type CharacterType =
  | 'amay-kyewl'
  | 'amay-yay-yin'
  | 'amay-yay-yin-2'
  | 'ba-luee'
  | 'ko-gyi-kyaw'
  | 'ma-phal-war'
  | 'thagyar-min'
  | 'yoke-ka-soe';

export interface CharacterConfig {
  id: CharacterType;
  name: string;
}

export const CHARACTER_LIST: Record<CharacterType, CharacterConfig> = {
  'amay-kyewl': { id: 'amay-kyewl', name: 'Amya Kyewl' },
  'amay-yay-yin': { id: 'amay-yay-yin', name: 'Amay Yay Yin' },
  'amay-yay-yin-2': { id: 'amay-yay-yin-2', name: 'Amay Yay Yin 2' },
  'ba-luee': { id: 'ba-luee', name: 'Ba Luee' },
  'ko-gyi-kyaw': { id: 'ko-gyi-kyaw', name: 'Ko Gyi Kyaw' },
  'ma-phal-war': { id: 'ma-phal-war', name: 'Ma Phal War' },
  'thagyar-min': { id: 'thagyar-min', name: 'Thagyar Min' },
  'yoke-ka-soe': { id: 'yoke-ka-soe', name: 'Yoke Ka Soe' },
};

interface CharacterProps {
  type: CharacterType;
  isDancing: boolean;
  height: number;
  frameRateMs?: number;
}

export const Character: React.FC<CharacterProps> = ({
  type,
  isDancing,
  height,
  frameRateMs,
}) => {
  switch (type) {
    case 'amay-kyewl':
      return <AmyaKyewl isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'amay-yay-yin':
      return <AmayYayYin isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'amay-yay-yin-2':
      return <AmayYayYin2 isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'ba-luee':
      return <BaLuee isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'ma-phal-war':
      return <MaPhalWar isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'thagyar-min':
      return <ThagyarMin isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'yoke-ka-soe':
      return <YokeKaSoe isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
    case 'ko-gyi-kyaw':
    default:
      return <KoGyiKyaw isDancing={isDancing} height={height} frameRateMs={frameRateMs} />;
  }
};