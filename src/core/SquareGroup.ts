import { Square } from "./Square";
import { Point, Shape } from "./types";

export class SquareGroup {
  private _squares: readonly Square[];
  protected isClock: boolean = true;
  constructor(
    protected _shape: Shape,
    private _centerPoint: Point,
    private color: string
  ) {
    const arr: Square[] = [];
    this._shape.forEach((p) => {
      const sq = new Square(
        {
          x: p.x + this._centerPoint.x,
          y: p.y + this._centerPoint.y,
        },
        color
      );
      arr.push(sq);
    });
    this._squares = arr;
  }

  public get squares() {
    return this._squares;
  }

  public set centerPoint(val: Point) {
    this._centerPoint = val;
    // 如果需要移动只改变中心点的位置
    this._shape.forEach((p, i) => {
      // 根据新的中心点位置改变页面中的小方块的位置
      this._squares[i].point = {
        x: p.x + this._centerPoint.x,
        y: p.y + this._centerPoint.y,
      };
    });
  }

  public get centerPoint() {
    return this._centerPoint;
  }

  public get shape() {
    return this._shape;
  }

  /**
   * 旋转后的形状
   */
  afterRotateShape() {
    let afterShape: Point[];
    // 判断是逆时针还是顺时针
    if (this.isClock) {
      // 顺
      afterShape = this._shape.map((it) => ({
        x: -it.y,
        y: it.x,
      }));
    } else {
      afterShape = this._shape.map((it) => ({
        x: it.y,
        y: -it.x,
      }));
    }
    return afterShape;
  }

  rotate(newShape: Shape) {
    // 得到旋转后的形状
    this._shape = newShape;
    // 设置每一个小方块的point 改变位置

    this._shape.forEach((it, i) => {
      this._squares[i].point = {
        x: it.x + this._centerPoint.x,
        y: it.y + this._centerPoint.y,
      };
    });
  }
}
