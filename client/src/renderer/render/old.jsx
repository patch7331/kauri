/** @format */

import { h, render } from "preact";
import { convertToPixels } from "helpers/units";
import store from "redux/store";

import * as Nodes from "components/Editor/Nodes";
import * as Elements from "components/Editor/Elements";
import Page from "components/Editor/Page";

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
  caption: Elements.Caption,
  code: Elements.InlineCode,
  codeblock: Elements.CodeBlock,
  heading: Elements.Heading,
  hint: Elements.Hint,
  hyperlink: Elements.Hyperlink,
  linebreak: Nodes.LineBreak,
  list: Elements.List,
  listitem: Elements.ListItem,
  pagebreak: Nodes.PageBreak,
  paragraph: Elements.Paragraph,
  span: Elements.Span,
  table: Elements.Table,
  tablecell: Elements.TableCell,
  tablerow: Elements.TableRow,
  text: Nodes.Text,
});

export function scratchRender(component) {
  let scratchArea = document.querySelector(".__scratch");

  // Create scratch area if it doesn't exist yet
  if (!scratchArea) {
    scratchArea = document.createElement("div");
    scratchArea.classList.add("__scratch");
    scratchArea.style.visibility = "hidden";
    scratchArea.style.width = `${convertToPixels(120)}px`;
    document.body.appendChild(scratchArea);
  }

  render(component, scratchArea);
}

/**
 * Renders nodes and wraps them across pages as needed.
 *
 * There are still a few additions that are needed however:
 * - Handle margin collapsing
 * - Cache element size, and invalidate cache when an element is mutated. This
 *   way we only need to render modified elements when rendering in the scratch
 *   area.
 * - Handle dynamic page heights.
 * - Handle page breaks a little more gracefully.
 * - Break nodes at a particular position.
 * - Handle wrapping edge cases, such as preventing wrapping immediately after a
 *   heading, or causing a single word to be orphaned on another page.
 *
 * @param {Object[]} nodes An array of document nodes.
 * @return {Component[]} An array of page components.
 */
export function renderPaginatedDocument(nodes) {
  const rendered = [];
  const pages = [];
  const workingHeight = convertToPixels(150);

  // Render each node
  nodes.allIds.forEach(id => {
    const node = nodes.byId[id];
    rendered.push(renderNode(node));
  });

  // Render each element in scratch area to get height
  scratchRender(rendered);
  rendered.forEach(x =>
    console.log("Height", x.__e.getBoundingClientRect().height, x),
  );

  // Add to pages
  let remainingHeight = workingHeight;
  let currentPage = [];
  rendered.forEach(node => {
    // Determine how much to reduce remaining height by
    // TODO handle margin collapsing
    const computedStyles = window.getComputedStyle(node.__e);
    remainingHeight -= node.__e.getBoundingClientRect().height;
    remainingHeight -= parseInt(computedStyles.marginTop);
    remainingHeight -= parseInt(computedStyles.marginBottom);
    console.log(remainingHeight);

    // Wrap to a new page
    if (remainingHeight < 0 || node.props.type.toLowerCase() === "pagebreak") {
      pages.push(currentPage);
      currentPage = [];
      remainingHeight = workingHeight;
    }

    currentPage.push(node);
  });
  pages.push(currentPage);

  // Render pages to document
  return pages.map(page => <Page children={page} />);
}

/**
 * Renders a list of KDF nodes.
 * @param {number[]} ids An array of node ids.
 * @return {Component[]} An array of Preact components.
 */
export function renderNodeList(ids = []) {
  return ids.map(id => {
    return renderNode(store.getState().document.nodes.byId[id]);
  });
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

  const type = node.type.toLowerCase();

  // Handle unknown node type
  if (!(type in NODE_MAP)) {
    throw new `Unknown element type '${node.type}'.`();
  }

  // Create and return tag
  const Node = NODE_MAP[type];
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
