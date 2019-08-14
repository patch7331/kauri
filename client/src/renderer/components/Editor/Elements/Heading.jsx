/** @format */

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";

export function Heading(props) {
  // Ensure level is valid
  if (props.level < 1) {
    throw new RenderError(`Invalid heading level '${props.level}'`);
  }

  const Heading = `h${Math.min(props.level, 6)}`;

  // Render heading
  return (
    <Heading style={renderStyles(props.styles)}>
      {renderNodeList(props.children)}
    </Heading>
  );
}
