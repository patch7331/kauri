/** @format */

import { h } from "preact";

import Heading from "components/Editor/Heading";
import Paragraph from "components/Editor/Paragraph";
import Span from "components/Editor/Span";
import Table from "components/Editor/Table";
import TableCaption from "components/Editor/TableCaption";
import TableColumnGroup from "components/Editor/TableColumnGroup";
import TableColumn from "components/Editor/TableColumn";
import TableRow from "components/Editor/TableRow";
import TableCell from "components/Editor/TableCell";
import Anchor from "components/Editor/Anchor";
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
      return node.content;
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
    case "span":
      return <Span node={node} />;
    case "table":
      return <Table node={node} />;
    case "caption":
      return <TableCaption node={node} />;
    case "colgroup":
      return <TableColumnGroup node={node} />;
    case "col":
      return <TableColumn node={node} />;
    case "tr":
      return <TableRow node={node} />;
    case "td":
      return <TableCell node={node} />;
    case "a":
      return <Anchor node={node} />;
    default:
      throw new RenderError(node, `Unknown tag '${node.tag}'.`);
  }
}
