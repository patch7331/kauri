/** @format */

import "./styles.scss";
import { h } from "preact";

export const LineBreak = () => <br />;
export const PageBreak = () => <p class="page-break">----- Page break -----</p>;
export const Text = props => (
  <span data-node-id={props.id}>{props.content}</span>
);
