/** @format */

import "./styles.scss";

import { h, Component } from "preact";
import { renderDocumentNodes } from "dom/render";
import ToolBar from "components/Editor/ToolBar";

const POST_URI = "http://127.0.0.1:3000/key";

/**
 * A document editing component.
 * @extends Component
 */
export default class Editor extends Component {
  /**
   * Constructs a new editor component.
   * @param {Object} props Component properties.
   * @param {DOM} props.dom A DOM to render in the editor.
   */
  constructor(props) {
    super(props);
  }

  /**
   * @private
   */
  componentDidMount() {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }

  render(props) {
    return (
      <div>
        <ToolBar />

        <div class="editor" contenteditable="true">
          {renderDocumentNodes(props.dom.children)}
        </div>
      </div>
    );
  }
}
