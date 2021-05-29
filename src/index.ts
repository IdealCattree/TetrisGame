import { Game } from "./core/Game";
import { GamePageViewer } from "./core/viewer/GamePageViewer";
import $ from "jquery";

const g = new Game(new GamePageViewer());

$(".btnStart").on("click", () => {
  g.start();
});

$(".btnPause").on("click", () => {
  g.pause();
});

$(".btnLeft").on("click", () => {
  g.controlLeft();
});

$(".btnRight").on("click", () => {
  g.controlRight();
});

$(".btnDown").on("click", () => {
  g.controlDown();
});

$(".btnRotate").on("click", () => {
  g.controlRotate();
});
