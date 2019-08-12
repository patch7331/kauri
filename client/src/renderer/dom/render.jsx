/** @format */

import { h } from "preact";
import RenderError from "dom/RenderError";

import Heading from "components/Heading";
import Paragraph from "components/Paragraph";

/**
 * A map of node types to components.
 *
 * It's faster to perform a lookup in an object when you know the key, than
 * create a giant switch case statement with each possible Node type. Having a
 * lookup object also allows us to create additional nodes at runtime. This
 * could prove valuable once we begin supporting third-party extensions.
 *
 * @type {Object}
 */
const NODE_MAP = Object.freeze({
  heading: Heading,
  paragraph: Paragraph
});

export function renderNodeList(nodes = []) {
  return nodes.map(renderNode);
}

export function renderNode(node) {
  // Handle text node shorthand
  if (typeof node === "string") {
    return node;
  }

  // Handle unknown node type
  if (!(node.type in NODE_MAP)) {
    throw new RenderError(`Unknown element type '${node.type}'.`);
  }

  // Create and return tag
  const Node = NODE_MAP[node.type];
  return <Node {...node} />;
}
