/** @format */

import { h, render } from "preact";

render(
  <div class="test">
    <button onClick={e => alert("hi!")}>Click me!</button>
  </div>,
  document.body
);
