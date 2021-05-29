import { IView, Point } from "./types";

export class Square {
  private _viewer?: IView;

  constructor(private _point: Point, private _color: string) {}

  public get point() {
    return this._point;
  }

  public set point(val) {
    this._point = val;
    /**
     * 小方块的位置改变需要重新调用显示函数
     */
    if (this._viewer) {
      this._viewer.show();
    }
  }

  public get color() {
    return this._color;
  }

  public set color(val) {
    this._color = val;
  }

  public get viewer() {
    return this._viewer;
  }

  public set viewer(val) {
    this._viewer = val;
  }
}
