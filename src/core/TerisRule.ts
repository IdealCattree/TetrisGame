import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { Direction, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
  if (typeof (obj as Point).x === "number") {
    return true;
  }
  return false;
}

export class TerisRule {
  /**
   * 判断是否能移动到目标点
   * @param shape 一组方块的形状
   * @param targetCenterPoint 目标点的中心位置
   */
  static canIMove(
    shape: Shape,
    targetCenterPoint: Point,
    exsits: Square[]
  ): boolean {
    const targetSquaresPoint: Shape = [];
    shape.forEach((p) => {
      targetSquaresPoint.push({
        x: p.x + targetCenterPoint.x,
        y: p.y + targetCenterPoint.y,
      });
    });
    // 判断一组方块中是否有方块超出边界
    // 只要有一个为true 就返回true
    let result = targetSquaresPoint.some((p) => {
      return (
        p.x < 0 ||
        p.x >= GameConfig.panleSize.width ||
        p.y < 0 ||
        p.y >= GameConfig.panleSize.height
      );
    });

    // 如果有方块超出则不能进行移动
    if (result) {
      return false;
    }

    result = targetSquaresPoint.some((p) =>
      exsits.some((sq) => sq.point.x === p.x && sq.point.y === p.y)
    );
    if (result) {
      return false;
    }

    return true;
  }

  /**
   * 根据传入的目标点坐标，或者移动的方向进行移动
   * @param teris 俄罗斯方块对象
   * @param targetCenterPointOrDirection 移动的目标点或者移动的方向
   */
  static move(
    teris: SquareGroup,
    targetCenterPointOrDirection: Point,
    existes: Square[]
  ): boolean;
  static move(
    teris: SquareGroup,
    targetCenterPointOrDirection: Direction,
    existes: Square[]
  ): boolean;
  static move(
    teris: SquareGroup,
    targetCenterPointOrDirection: Point | Direction,
    exists: Square[]
  ) {
    // 判断传入的是目标点还是方向
    if (isPoint(targetCenterPointOrDirection)) {
      // 判断是否能移动
      const result = this.canIMove(
        teris.shape,
        targetCenterPointOrDirection,
        exists
      );

      if (result) {
        teris.centerPoint = targetCenterPointOrDirection;
        return true;
      }
      return false;
    } else {
      // 传入的是方向
      const direction = targetCenterPointOrDirection;
      let targetPoint: Point;
      // 根据方向判断出下一个目标点的坐标
      if (direction === Direction.down) {
        targetPoint = {
          x: teris.centerPoint.x,
          y: teris.centerPoint.y + 1,
        };
      } else if (direction === Direction.left) {
        targetPoint = {
          x: teris.centerPoint.x - 1,
          y: teris.centerPoint.y,
        };
      } else {
        targetPoint = {
          x: teris.centerPoint.x + 1,
          y: teris.centerPoint.y,
        };
      }
      return this.move(teris, targetPoint, exists);
    }
  }

  /**
   * 旋转功能
   * @param teris
   * @param exists
   */
  static rotate(teris: SquareGroup, exists: Square[]) {
    const newShape = teris.afterRotateShape();
    const result = this.canIMove(newShape, teris.centerPoint, exists);
    if (result) {
      teris.rotate(newShape);
    }
  }

  /**
   * 获取指定行上的小方块集合
   * @param exists
   * @param y
   */
  static getLineSquares(exists: Square[], y: number): Square[] {
    return exists.filter((sq) => sq.point.y === y);
  }

  static deleteSquare(exists: Square[]): number {
    
    const yPoints = exists.map((sq) => sq.point.y);
    const minY = Math.min(...yPoints);
    const maxY = Math.max(...yPoints);
    let num = 0;
    for (let i = minY; i <= maxY; i++) {
      if (this.deleteLine(exists, i)) {
        num++;
      }
    }
    return num;
  }

  /**
   * 消除一行
   * @param exists
   * @param y
   */
  private static deleteLine(exists: Square[], y: number) {
    // 获取一行的所有小方块
    const squares = this.getLineSquares(exists, y);
    // 判断改行的方块数量是否等于该行的宽度,如果跟等于则消除
    if (squares.length === GameConfig.panleSize.width) {
      // 进行消除
      squares.forEach((sq) => {
        // 1. 移除页面上的dom
        sq.viewer!.remove();

        // 2. 移除exists数组中对应的小方块对象
        const index = exists.indexOf(sq);
        exists.splice(index, 1);
      });

      // 3. 将移除行的上面的所有行全部向下移动一行
      exists.forEach((sq) => {
        if (sq.point.y < y) {
          sq.point = { x: sq.point.x, y: sq.point.y + 1 };
        }
      });
      return true;
    }

    return false;
  }
}
