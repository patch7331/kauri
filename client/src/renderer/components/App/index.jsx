/** @format */

import "./modern-normalize.css";
import "./styles.scss";
import { h } from "preact";

import Editor from "components/Editor";

/**
 * Root application component.
 */
export default () => (
  <div class="app">
    <Editor />
  </div>
);
