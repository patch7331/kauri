/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs an anchor within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create an anchor.
 * @return {PreactElement} A rendered preact element.
 */
export default function Anchor(props) {
  const { children = [], styles = {}, attributes = {} } = props.node;
  return (
    <a class="editor__anchor" style={styles} {...attributes}>
      {renderDocumentNodes(children)}
    </a>
  );
}
