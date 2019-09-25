/** @format */

import "./styles.scss";

import { h, Component, createRef } from "preact";
import { connect } from "react-redux";
import { moveSelection, Status } from "redux/actions";
import { Renderer, RenderMode } from "render";

import Error from "components/Error"

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
    return [positionStart, positionEnd];
  }

  /**
   * Handles clicks to the document element.
   */
  handleDocumentClick() {
    this.props.moveSelection(...this.getCaretPos());
  }

  render(props) {
    let content;

    switch (props.document.status) {
      case Status.ERROR:
        content = <Error exception={props.document.exception} />;
        break;
      default:
        const pages = new Renderer(props.document.content, {
          renderMode: RenderMode.CONTENT,
          pageStyle: {
            marginBottom: "1cm",
            marginLeft: "1cm",
            marginRight: "1cm",
            marginTop: "1cm",
            height: "140mm",
            width: "120mm",
          },
        }).render();
        
        console.log("Pages", pages);
        console.log("Props", props);

        content = (
          <div
            ref={this.contentEditableDiv}
            class="editor"
            contenteditable="true"
            onClick={this.handleDocumentClick}
          >
            {pages}
          </div>
        );
        break;
    }

    return content;
  } 
}

export default connect(
  state => ({ document: state.document }),
  { moveSelection },
)(Editor);
