import { Square } from "../Square";
import { IView } from "../types";
import PageConfig from "./PageConfig";
import $ from "jquery";

export class SquarePageViewer implements IView {
  private dom?: JQuery<HTMLElement>;
  constructor(private square: Square, private container: JQuery<HTMLElement>) {}

  show(): void {
    if (!this.dom) {
      this.dom = $("<div>").css({
        width: PageConfig.squareDom.width,
        height: PageConfig.squareDom.height,
        backgroundColor: this.square.color,
        position: "absolute",
        border: "1px solid #ccc",
        boxSizing: "border-box",
      });
    }

    this.dom
      .css({
        left: this.square.point.x * PageConfig.squareDom.width,
        top: this.square.point.y * PageConfig.squareDom.height,
      })
      .appendTo(this.container);
  }

  remove(): void {
    if (this.dom) {
      this.dom.remove();
    }
  }
}
