/** @format */

import "./styles.scss";

import { h, Component, createRef } from "preact";
import { renderNodeList } from "dom/render";
import { connect } from "react-redux";
import { updateCaretPos } from "redux/actions";

/**
 * A document editing component.
 * @extends Component
 */
class Editor extends Component {
  /**
   * Constructs a new editor component.
   */
  constructor(props) {
    super(props);
    this.contentEditableDiv = createRef();

    // Binds
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand("styleWithCSS", false, true);
  }

  /**
   * Returns absolute values of caret's start/end positions
   */
  getCaretPos() {
    const range = document.getSelection().getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(this.contentEditableDiv.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const positionStart = preSelectionRange.toString().length;
    const positionEnd = positionStart + range.toString().length;
    return { positionStart, positionEnd };
  }

  /**
   * Handles clicks to the document element.
   */
  handleDocumentClick() {
    this.props.updateCaretPos(this.getCaretPos());
  }

  render = props => (
    <div
      ref={this.contentEditableDiv}
      class="editor"
      contenteditable="true"
      onClick={this.handleDocumentClick}
    >
      {renderNodeList(props.document)}
    </div>
  );
}

export default connect(
  state => ({ document: state.document }),
  { updateCaretPos },
)(Editor);
