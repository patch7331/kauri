/** @format */

import { h } from "preact";
import { renderNodeList } from "dom/render";

export function Heading(props) {
  // Ensure level is valid
  if (props.level < 1) {
    throw new RenderError(`Invalid heading level '${props.level}'`);
  }

  const Heading = `h${Math.min(props.level, 6)}`;

  // Render heading
  return (
    <Heading class={props.class && `__editor__${props.class}`}>
      {renderNodeList(props.children)}
    </Heading>
  );
}
