/** @format */

import { h } from "preact";

import Heading from "components/Editor/Heading";
import Paragraph from "components/Editor/Paragraph";
import RenderError from "dom/RenderError";

/**
 * Renders an array of DOM nodes.
 * @param {Object[]} nodes DOM nodes to render.
 * @return {PreactElement[]} An array of rendered preact elements.
 */
export function renderDocumentNodes(nodes) {
  return nodes.map(x => renderDocumentNode(x));
}

/**
 * Renders a document tree recursively, depth first, one node at a time.
 *
 * @example
 * renderDocumentNode({
 *   "type": "Element",
 *   "tag": "heading",
 *   "attributes" {
 *     "level": "1"
 *   },
 *   "styles": {},
 *   "children": [ ... ]
 * });
 *
 * @param {Object} node Node to render.
 * @param {string} node.type Type of node to render.
 * @return {PreactElement} A rendered preact element.
 */
export function renderDocumentNode(node) {
  switch (node.type) {
    case "Element":
      return renderTag(node);
    case "Text":
      if (
        Object.keys(node.styles).length === 0 &&
        node.styles.constructor === Object
      ) {
        return node.content;
      } else {
        return <span style={node.styles}>{node.content}</span>;
      }
    default:
      throw new RenderError(node, `Unknown type '${node.type}'.`);
  }
}

/**
 * Returns a component that matches the tag property of the node.
 *
 * @param {Object} node Node to match.
 * @param {string} node.tag Tag of node to render.
 * @return {PreactElement} A rendered preact element.
 */
function renderTag(node) {
  switch (node.tag) {
    case "heading":
      return <Heading node={node} />;
    case "paragraph":
      return <Paragraph node={node} />;
    default:
      throw new RenderError(node, `Unknown tag '${node.tag}'.`);
  }
}
