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
 *   "type": "heading",
 *   "level": 1,
 *   "children": [ ... ]
 * });
 *
 * @param {Object} node Node to render.
 * @param {string} node.type Type of node to render.
 * @return {PreactElement} A rendered preact element.
 */
export function renderDocumentNode(node) {
  switch (node.type) {
    case "heading":
      return <Heading node={node} />;
    case "paragraph":
      return <Paragraph node={node} />;
    case "text":
      return node.content;
    default:
      throw new RenderError(node, `Unknown type '${node.type}'.`);
  }
}
