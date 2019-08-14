/** @format */

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";

export function Span(props) {
  return (
    <span style={renderStyles(props.styles)}>
      {renderNodeList(props.children)}
    </span>
  );
}
