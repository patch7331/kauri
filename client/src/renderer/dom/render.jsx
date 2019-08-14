/** @format */

import { h } from "preact";
import RenderError from "dom/RenderError";

import * as Nodes from "components/Editor/Nodes";
import * as Elements from "components/Editor/Elements";

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
  heading: Elements.Heading,
  lineBreak: Nodes.LineBreak,
  pageBreak: Nodes.PageBreak,
  paragraph: Elements.Paragraph,
  span: Elements.Span,
  text: Nodes.Text,
});

/**
 * Renders a list of KDF nodes.
 * @param {Object[]} nodes An array of KDF nodes.
 * @return {Component[]} An array of Preact components.
 */
export function renderNodeList(nodes = []) {
  return nodes.map(renderNode);
}

/**
 * Renders a KDF node.
 * @param {Object} node KDF node to render.
 * @return {Component} A rendered Preact component.
 */
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

/**
 * Turns a KCSS styles object into a CSS styles object.
 * @param {Object} styles KCSS styles to render.
 * @return {Object} CSS styles.
 */
export function renderStyles(styles) {
  return styles;
}
