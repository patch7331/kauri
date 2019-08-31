/** @format */

import "./styles.scss";
import { h } from "preact";

export default function Page(props) {
  return <div class="page">{props.children}</div>;
}
