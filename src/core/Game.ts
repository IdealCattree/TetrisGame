import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { Direction, GameState, GameViewer } from "./types";

export class Game {
  // 游戏的状态
  private _gameState: GameState = GameState.init;

  // 当前的方块组
  private _curTeris?: SquareGroup;

  // 下一个方块组
  private _nextTeris: SquareGroup = createTeris({ x: 0, y: 0 });

  // 计时器的序列
  private _timer?: number;

  // 每次下落间隔的时间
  private _duration: number = 1000;

  // 触底之后的方块集合
  private _exists: Square[] = [];

  // 积分处理
  private _score: number = 0;

  constructor(private _viewer: GameViewer) {
    this._viewer.showNext(this._nextTeris);
    this.resetCenterPoint(GameConfig.tipSize.width, this._nextTeris);
    this._viewer.showScore(this._score);
    this._viewer.init(this);
  }

  public get score(): number {
    return this._score;
  }

  public set score(val: number) {
    this._score = val;
    this._viewer.showScore(val);
  }

  public get gameState(): GameState {
    return this._gameState;
  }

  /**
   * 初始化操作
   */
  private init() {
    this._exists.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove();
      }
    });
    this._exists = [];
    this._nextTeris = createTeris({ x: 0, y: 0 });
    this.resetCenterPoint(GameConfig.tipSize.width, this._nextTeris);
    if (this._curTeris) {
      this._curTeris.squares.forEach((sq) => {
        sq.viewer!.remove();
      });
    }
    this._curTeris = undefined;
    this._score = 0;
  }

  /**
   * 开始游戏
   */
  start(): void {
    if (this._gameState === GameState.playing) {
      return;
    }

    if (this._gameState === GameState.over) {
      this.init();
    }

    this._gameState = GameState.playing;
    this._viewer.onStart();
    if (!this._curTeris) {
      this.switchTeris();
    }
    this.autoDrop();
  }

  /**
   * 游戏暂停
   */
  pause(): void {
    if (this._gameState === GameState.playing) {
      this._viewer.onPause();
      clearInterval(this._timer);
      this._timer = undefined;
      this._gameState = GameState.paused;
    }
  }

  /**
   * 向左移动
   */
  controlLeft(): void {
    if (this._gameState === GameState.playing && this._curTeris) {
      TerisRule.move(this._curTeris, Direction.left, this._exists);
    }
  }

  /**
   * 向右移动
   */
  controlRight(): void {
    if (this._gameState === GameState.playing && this._curTeris) {
      TerisRule.move(this._curTeris, Direction.right, this._exists);
    }
  }

  /**
   * 向下移动
   */
  controlDown(): void {
    if (this._gameState === GameState.playing && this._curTeris) {
      TerisRule.move(this._curTeris, Direction.down, this._exists);
      if (!TerisRule.move(this._curTeris, Direction.down, this._exists)) {
        // 触底处理
        this.hitBottom();
      }
    }
  }

  /**
   * 旋转
   */
  controlRotate(): void {
    if (this._gameState === GameState.playing && this._curTeris) {
      TerisRule.rotate(this._curTeris, this._exists);
    }
  }

  /**
   * 切换方块
   */
  private switchTeris() {
    // 切换逻辑方块
    this._curTeris = this._nextTeris;
    this.resetCenterPoint(GameConfig.panleSize.width, this._curTeris);

    // 切换dom方块
    this._viewer.switch(this._curTeris);
    // 判断游戏是否结束
    this.isOver(this._curTeris!);
    // 如果游戏结束了，直接结束该函数，不需要生产下一个俄罗斯方块了
    if (this._gameState === GameState.over) {
      return;
    }

    // 生成新的下一个俄罗斯方块
    this._nextTeris = createTeris({ x: 0, y: 0 });

    // 根据tip面板的尺寸重新设置俄罗斯方块的中心点位置
    this.resetCenterPoint(GameConfig.tipSize.width, this._nextTeris);
    // 重新显示新的tip方块
    this._viewer.showNext(this._nextTeris);
  }

  /**
   * 自动下落函数
   */
  private autoDrop() {
    if (this._timer || this._gameState !== GameState.playing) {
      return;
    }

    this._timer = setInterval(() => {
      if (!TerisRule.move(this._curTeris!, Direction.down, this._exists)) {
        // 触底处理
        this.hitBottom();
      }
    }, this._duration);
  }

  /**
   * 重新设置中心点坐标
   */
  private resetCenterPoint(width: number, teris: SquareGroup) {
    const x = Math.ceil(width / 2) - 1; // 根据面板的宽度设置俄罗斯方块的中心点x坐标
    let y = 0;
    teris.centerPoint = { x, y };

    // 循环判断真实的坐标y的值是否大于0，如果小于0则强制向下移动一个格子
    while (teris.squares.some((sq) => sq.point.y < 0)) {
      teris.squares.forEach((sq) => {
        sq.point = {
          x: sq.point.x,
          y: sq.point.y + 1,
        };
      });
    }
  }

  /**
   * 触底处理
   */
  private hitBottom(): void {
    // 将当前的俄罗斯方块放入触底数组的集合
    this._exists = [...this._exists, ...this._curTeris!.squares];

    // 消除处理
    const num = TerisRule.deleteSquare(this._exists);
    // 消除之后要做积分处理
    if (num) {
      this.score += num * GameConfig.panleSize.width;
    }

    // 切换方块，将下一个俄罗斯方块赋值给当前方块
    this.switchTeris();
  }

  /**
   * 游戏结束处理
   */
  private isOver(teris: SquareGroup): void {
    if (
      !TerisRule.canIMove(
        teris.shape,
        { x: teris.centerPoint.x, y: teris.centerPoint.y + 1 },
        this._exists
      )
    ) {
      // this._curTeris!.squares.forEach((sq) => sq.viewer!.remove());
      clearInterval(this._timer);
      this._timer = undefined;
      this._gameState = GameState.over;
      this._viewer.onOver();
    }
  }
}
