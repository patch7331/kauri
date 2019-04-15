/** @format */

import Element from "dom/Element";

export default class ParagraphElement extends Element {
  constructor(...children) {
    super(new Map(), children);
  }
}
