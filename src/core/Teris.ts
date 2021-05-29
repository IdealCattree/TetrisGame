import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./types";
import { getRandom } from "./utils";

// export const TShape: Shape = [
//   { x: 0, y: 0 },
//   { x: 0, y: -1 },
//   { x: 0, y: 1 },
//   { x: -1, y: 0 },
// ];

export class TShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ],
      _centerPoint,
      color
    );
  }
}

// export const LShape: Shape = [
//   { x: -2, y: 0 },
//   { x: -1, y: 0 },
//   { x: 0, y: 0 },
//   { x: 0, y: -1 },
// ];

export class LShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: -2, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: -1 },
      ],
      _centerPoint,
      color
    );
  }
}

// export const LMirrorShape: Shape = [
//   { x: 2, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 0 },
//   { x: 0, y: -1 },
// ];

export class LMirrorShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: -1 },
      ],
      _centerPoint,
      color
    );
  }
}

// export const SShape: Shape = [
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 1 },
//   { x: -1, y: 1 },
// ];

export class SShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      _centerPoint,
      color
    );
  }
  afterRotateShape(): Point[] {
    let afterShape: Point[];
    if (this.isClock) {
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
    this.isClock = !this.isClock;

    return afterShape;
  }
}

// export const SMirrorShape: Shape = [
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 1 },
//   { x: -1, y: 1 },
// ];

export class SMirrorShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
      ],
      _centerPoint,
      color
    );
  }

  afterRotateShape(): Point[] {
    let afterShape: Point[];
    if (this.isClock) {
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
    this.isClock = !this.isClock;

    return afterShape;
  }
}

// export const LineShape: Shape = [
//   { x: -1, y: 0 },
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 2, y: 0 },
// ];

export class LineShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      _centerPoint,
      color
    );
  }

  afterRotateShape(): Point[] {
    let afterShape: Point[];
    if (this.isClock) {
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
    // console.log("fjakd" + afterShape);
    this.isClock = !this.isClock;

    return afterShape;
  }
}

// export const SquareShape: Shape = [
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 1 },
//   { x: 1, y: 1 },
// ];

export class SquareShape extends SquareGroup {
  constructor(_centerPoint: Point, color: string) {
    super(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      _centerPoint,
      color
    );
  }

  rotate() {}
}

const shapes = [
  TShape,
  LineShape,
  LShape,
  LMirrorShape,
  SMirrorShape,
  SShape,
  SquareShape,
];
const colors = ["red", "green", "#fff", "blue", "orange"];

export function createTeris(centerPoint: Point) {
  const shapeIndex = getRandom(0, shapes.length);
  const shape = shapes[shapeIndex];
  const colorIndex = getRandom(0, colors.length);
  const color = colors[colorIndex];

  return new shape(centerPoint, color);
}
