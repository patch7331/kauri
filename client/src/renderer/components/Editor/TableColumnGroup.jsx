/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table column group within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function TableColumnGroup(props) {
  const { children = [], styles = {} } = props.node;
  return (
    <colgroup class="editor__tablecolumngroup" style={styles}>
      {renderDocumentNodes(children)}
    </colgroup>
  );
}
