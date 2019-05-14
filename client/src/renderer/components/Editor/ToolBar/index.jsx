/** @format */

import "./styles.scss";

import { h } from "preact";
import StyleSelector from "components/Editor/ToolBar/StyleSelector";
import StyleButtons from "components/Editor/ToolBar/StyleButtons";
import FontSelector from "components/Editor/ToolBar/FontSelector";
import FontColorSelector from "components/Editor/ToolBar/FontColorSelector";
import FontSizeSelector from "components/Editor/ToolBar/FontSizeSelector";

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
      <StyleButtons />
      <FontSelector />
      <FontColorSelector />
      <FontSizeSelector />
    </div>
  );
}
