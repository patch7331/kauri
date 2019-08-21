/** @format */

export * from "./Caption";
export * from "./Code";
export * from "./Heading";
export * from "./Hint";
export * from "./Hyperlink";
export * from "./List";
export * from "./Paragraph";
export * from "./Span";
export * from "./Table";

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";

/**
 * A generic editor element.
 * @param {String} props.tag HTML tag to use.
 * @param {?String} props.class An optional element class.
 */
export function Element(props) {
  const Element = props.tag;
  const attributes = props.attributes ? props.attributes : {};
  return (
    <Element
      class={props.class && `__editor__${props.class}`}
      style={renderStyles(props.styles)}
      {...attributes}
    >
      {renderNodeList(props.children)}
    </Element>
  );
}
