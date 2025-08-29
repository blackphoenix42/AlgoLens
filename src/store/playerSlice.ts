import { Player } from "@/core/runner/player";

export type PlayerSlice = {
  player: Player;
};

export function createPlayerSlice(total: number): PlayerSlice {
  return { player: new Player(total) };
}
