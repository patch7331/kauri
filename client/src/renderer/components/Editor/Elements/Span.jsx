/** @format */

import { h } from "preact";
import { renderNodeList } from "dom/render";

export function Span(props) {
  return <span>{renderNodeList(props.children)}</span>;
}
