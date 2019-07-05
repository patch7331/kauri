/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a paragraph within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function Paragraph(props) {
  const { children = [], styles = {} } = props.node;
  return (
    <p class="editor__paragraph" style={styles}>
      {renderDocumentNodes(children)}
    </p>
  );
}
