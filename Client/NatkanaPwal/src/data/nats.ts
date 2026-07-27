export interface Nat {
  id: string;
  name: string;
  nameMM: string;
  tier: "small" | "mid" | "big" | "rare";
  image: string;
  animation?: string; // idle/summon animation key
  sound?: string;
}

export const nats: Nat[] = [
  { id: "min_mahagiri", name: "Min Mahagiri", nameMM: "မင်းမဟာဂီရိ", tier: "big", image: "/nats/min_mahagiri.png" },
  { id: "shwe_nabe", name: "Shwe Nabe", nameMM: "ရွှေနဘေး", tier: "mid", image: "/nats/shwe_nabe.png" },
  // ...
];