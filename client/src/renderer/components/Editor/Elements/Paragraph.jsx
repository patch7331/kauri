/** @format */

import { h } from "preact";
import { renderNodeList } from "dom/render";

export const Paragraph = props => (
  <p class={props.class && `__editor__${props.class}`}>
    {renderNodeList(props.children)}
  </p>
);
