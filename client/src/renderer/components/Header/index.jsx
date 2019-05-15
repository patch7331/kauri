/** @format */

import "./styles.scss";

import { h, Component } from "preact";

/**
 * Constructs a new application header.
 * @param {Object} props Component properties.
 * @param {?string} props.title Document title.
 * @return {PreactElement} Element ready for rendering.
 */
export default function Header(props) {
  const { title = "Untitled Document" } = props;

  return (
    <div class="header">
      <h1>{title}</h1>
    </div>
  );
}
