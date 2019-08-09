/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table cell within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function TableCell(props) {
  const { children = [], styles = {}, attributes = {} } = props.node;
  return (
    <td class="editor__tablecell" style={styles} {...attributes}>
      {renderDocumentNodes(children)}
    </td>
  );
}
