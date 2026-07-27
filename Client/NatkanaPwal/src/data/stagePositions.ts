export type StagePosition = "table" | "main_stage";
export const tierToPosition: Record<string, StagePosition> = {
  small: "table",
  mid: "table",
  big: "main_stage",
  rare: "main_stage",
};