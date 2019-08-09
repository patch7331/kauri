/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a table within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a paragraph.
 * @return {PreactElement} A rendered preact element.
 */
export default function Table(props) {
  const { children = [], styles = {} } = props.node;
  return (
    <table class="editor__table" style={styles}>
      {renderDocumentNodes(children)}
    </table>
  );
}
