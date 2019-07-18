/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table row within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function TableRow(props) {
  const { children = [], styles = {}, attributes = {} } = props.node;
  return (
    <tr class="editor__tablerow" style={styles} {...attributes}>
      {renderDocumentNodes(children)}
    </tr>
  );
}
