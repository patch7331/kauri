/** @format */

import { h } from "preact";
import { renderDocumentNodes } from "dom/render";

/**
 * Constructs a span within the editor from a DOM node.
 * @param {Object} props Component properties.
 * @param {Object} props.node DOM Node used to create a span.
 * @return {PreactElement} A rendered preact element.
 */
export default function Span(props) {
  const { children = [], styles = {} } = props.node;
  return <span style={styles}>{renderDocumentNodes(children)}</span>;
}
