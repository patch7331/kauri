import { h } from "preact";
import { renderNodeList } from "dom/render";

export default (props) => (
  <p class={props.class && `__editor__${props.class}`}>
    {renderNodeList(props.children)}
  </p>
);
