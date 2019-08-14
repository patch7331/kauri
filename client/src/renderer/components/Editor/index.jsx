/** @format */

import "./styles.scss";

import { h, Component, createRef } from "preact";
import { renderDocumentNodes } from "dom/render";
import { connect, useDispatch, useSelector } from "react-redux";
import { addCommand, updateCaretPos } from "redux/actions";
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
    this.contentEditableDiv = createRef();
    this.clearContentEditable = this.clearContentEditable.bind(this);
    this.state = { positions: [] };
  }

  /**
   * @private
   */
  componentDidMount() {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }

  /**
   * Clears the contents of the contenteditable div, designed for use before loading a new file.
   */
  clearContentEditable() {
    this.contentEditableDiv.current.innerHTML = "";
  }

  //returns absolute values of caret's start/end positions
  getCaretPos() { 
    const editor = document.getElementById('editor');
    var positions = {pos1: 0, pos2: 0};

    var range = document.getSelection().getRangeAt(0);
    var preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editor);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    positions.pos1 = preSelectionRange.toString().length;
    positions.pos2 = positions.pos1 + range.toString().length;
    console.log("Editor: ",positions.pos1, positions.pos2);
    return positions;
  }

  render(props) {
    const dispatch = useDispatch();
    const caretPos = useSelector(state => state.caret);

    return (
      <div>
        <ToolBar />

        <div
          ref={this.contentEditableDiv}
          class="editor"
          id="editor"
          contenteditable="true"
          onclick={() => dispatch(updateCaretPos(this.getCaretPos()))}
        >
          {renderDocumentNodes(props.dom.children)}
        </div>
      </div>
    );
  }
}
