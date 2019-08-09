/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table column within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function TableColumn(props) {
  const { children = [], styles = {}, attributes = {} } = props.node;
  return (
    <col class="editor__tablecolumn" style={styles} {...attributes}>
      {renderDocumentNodes(children)}
    </col>
  );
}
