/** @format */

import { h } from "preact";
import { Element } from "./index";
import RenderError from "dom/RenderError";

export function Heading(props) {
  // Ensure level is valid
  if (props.level < 1) {
    throw new RenderError(`Invalid heading level '${props.level}'`);
  }

  return <Element tag={`h${Math.min(props.level, 6)}`} {...props} />;
}
