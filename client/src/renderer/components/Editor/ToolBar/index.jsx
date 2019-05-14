/** @format */

import "./styles.scss";

import { h } from "preact";
import StyleSelector from "components/Editor/ToolBar/StyleSelector";

/**
 * A tool bar component which sits above the editor interface.
 *
 * Please note that this tool bar is not designed for long term use, and will
 * eventually be replaced by contextual editing tools and the purposely designed
 * Kauri interface. Until that time, this tool bar will serve as a drop in
 * replacement.
 *
 * @return {PreactElement} Rendered tool bar element.
 */
export default function ToolBar() {
  return (
    <div class="toolbar">
      <StyleSelector />
    </div>
  );
}
