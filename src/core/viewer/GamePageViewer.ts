import { SquareGroup } from "../SquareGroup";
import { GameState, GameViewer } from "../types";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";
import { Game } from "../Game";

export class GamePageViewer implements GameViewer {
  private msgDom = $(".msg");
  /**
   * 初始化界面
   * @param game
   */
  init(game: Game): void {
    $(".panel").css({
      width: GameConfig.panleSize.width * PageConfig.squareDom.width,
      height: GameConfig.panleSize.height * PageConfig.squareDom.height,
    });
    $(".next").css({
      width: GameConfig.tipSize.width * PageConfig.squareDom.width,
      height: GameConfig.tipSize.height * PageConfig.squareDom.height,
    });

    this.msgDom.css({
      position: "absolute",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      width: "100%",
      height: "100%",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontSize: "4em",
      fontWeight: "bold",
      zIndex: 10,
    });

    // 注册dom事件
    $(document).on("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        game.controlLeft();
      } else if (e.key === "ArrowDown") {
        game.controlDown();
      } else if (e.key === "ArrowRight") {
        game.controlRight();
      } else if (e.key === "ArrowUp") {
        game.controlRotate();
      } else if (e.key === " ") {
        if (game.gameState === GameState.playing) {
          game.pause();
        } else if (game.gameState === GameState.over) {
          game.start();
        } else {
          game.start();
        }
      }
    });
  }

  /**
   *
   * @param score
   */
  showScore(score: number): void {
    $(".score").html(score.toString());
  }
  switch(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove(); // 把next容器中的dom移除掉
      }
      sq.viewer = new SquarePageViewer(sq, $("#root .panel"));
      sq.viewer.show();
    });
  }

  showNext(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      sq.viewer = new SquarePageViewer(sq, $("#root .tip .next"));
      sq.viewer.show();
    });
  }

  /**
   * 暂停后显示msg界面
   */
  onPause(): void {
    this.msgDom
      .css({
        display: "flex",
      })
      .html("游戏暂停");
  }
  /**
   * 开始后移除msg界面
   */
  onStart(): void {
    this.msgDom.hide();
  }

  /**
   * 游戏结束收显示msg界面
   */
  onOver(): void {
    this.msgDom
      .css({
        display: "flex",
      })
      .html("游戏结束");
  }
}
