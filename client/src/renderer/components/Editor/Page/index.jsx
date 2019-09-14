/** @format */

import "./styles.scss";
import { h } from "preact";

export default function Page(props) {
  return (
    <div class="page" styles={props.styles}>
      {props.children}
    </div>
  );
}
