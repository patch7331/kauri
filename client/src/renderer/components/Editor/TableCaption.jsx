/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table caption within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function TableCaption(props) {
  const { children = [], styles = {} } = props.node;
  return (
    <caption class="editor__tablecaption" style={styles}>
      {renderDocumentNodes(children)}
    </caption>
  );
}
