/** @format */

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";

export const Paragraph = props => (
  <p styles={renderStyles(props.styles)}>{renderNodeList(props.children)}</p>
);
