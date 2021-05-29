import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface IView {
  show(): void;
  remove(): void;
}

export type Shape = Point[];

export enum Direction {
  left,
  right,
  down,
}

export interface GameViewer {
  switch(teris: SquareGroup): void;
  showNext(teris: SquareGroup): void;
  showScore(score: number): void;
  init(game: Game): void;
  onOver(): void;
  onStart(): void;
  onPause(): void;
}

export enum GameState {
  init, // 游戏未开始
  playing, // 游戏正在进行中
  paused, // 游戏暂停
  over, // 游戏结束
}
