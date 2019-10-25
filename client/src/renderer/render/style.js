/** @format */

import { kebabize } from "../helpers/inflections";

/**
 * Render CSS style to KCSS style.
 * @param style A CSS styles map.
 */
export function toCSS(style) {
  return style;
}

/*
 * Convert style reducer object into a string with
 * valid CSS selectors and properties which will
 * returned and added to the head of the document.
 * @param A style Reducer object
 */
export function renderStyle(style) {
  let css = "";
  Object.entries(style).map(([selector, value]) => {
    css = `${css}.__editor__${selector} { `;
    Object.entries(value.styles).map(([property, value]) => {
      property = kebabize(property);
      css = `${css}${property}: ${value}; `;
    });
    css = `${css}}`;
  });
  return css;
}
