/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";
import RenderError from "dom/RenderError";

/**
 * Constructs a heading within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create this heading.
 * @return {PreactElement} A rendered preact element.
 */
export default function Heading(props) {
  const { children = [], attributes = {}, styles = {} } = props.node;
  const { level = 1 } = attributes;
  const Tag = `h${level}`;

  // Ensure level is within valid range
  if (level < 1 || level > 6) {
    throw new RenderError(props.node, `Invalid heading level ${level}`);
  }

  return (
    <Tag class="editor__heading" style={styles}>
      {renderDocumentNodes(children)}
    </Tag>
  );
}
