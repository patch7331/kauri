/** @format */

import "./styles.scss";

import { h, Component, createRef, Fragment } from "preact";
import Helmet from "preact-helmet";
import { connect } from "react-redux";
import {
  moveSelection,
  Status,
  addText,
  deleteTextEnd,
  deleteText,
} from "redux/actions";
import { Renderer, RenderMode } from "render";
import { renderStyle } from "render/style";

import Error from "components/Error";
import { nodeInternals } from "stack-utils";

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

    //text buffer
    this.buffer = [];
    this.bufferTimeout;
    this.bufferTimeoutValue = 333;
    this.maxBufferSize = 10;
    this.bufferStartPos = 0;
    this.bufferStartId = 0;

    // Binds
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.logKeyPress = this.logKeyPress.bind(this);
    this.pushBufferToStore = this.pushBufferToStore.bind(this);
    this.addToBuffer = this.addToBuffer.bind(this);
    this.createNewDataNode = this.createNewDataNode.bind(this);
    this.setCursorPosition = this.setCursorPosition.bind(this);
  }

  /**
   * Returns absolute values of caret's start/end positions
   */
  getAbsolutePos() {
    const range = document.getSelection().getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(this.contentEditableDiv.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const positionStart = preSelectionRange.toString().length;
    const positionEnd = positionStart + range.toString().length;
    return [positionStart, positionEnd];
  }

  getNodeData() {
    const selection = document.getSelection().getRangeAt(0);
    const startPos = selection.startOffset;
    const endPos = selection.endOffset;
    const startId = parseInt(
      selection.startContainer.parentElement.getAttribute("data-node-id"),
    );
    const endId = parseInt(
      selection.endContainer.parentElement.getAttribute("data-node-id"),
    );
    const length = selection.startContainer.parentElement.textContent.length;
    console.log("node length:");
    console.log(length);
    return [startPos, endPos, startId, endId, length];
  }

  /**
   * Used to queue actions that need fire after React's call stack has completely resolved
   * @param {function()} callback
   */
  onNextFrame(callback) {
    setTimeout(function() {
      requestAnimationFrame(callback);
    });
  }

  /**
   * Handles clicks to the document element.
   */
  handleDocumentClick() {
    this.onNextFrame(() => {
      this.props.moveSelection(...this.getNodeData());
    });
  }

  setCursorPosition() {
    console.log(this.props);
    this.onNextFrame(() => {
      console.log(this.props);
      const store = this.props.document.selection;
      console.log(store);
      const el = document.querySelector(
        "[data-node-id='" + store.startId + "']",
      );
      const sel = document.getSelection();
      const range = document.createRange();
      range.setStart(el.childNodes[0], store.startPos);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }

  /**
   * Listens to keyboard presses
   * @param {number} e
   */
  logKeyPress(e) {
    console.log(e);
    switch (e.key) {
      //Positioning keys
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown":
      case "Tab":
        this.onNextFrame(() => {
          this.props.moveSelection(...this.getNodeData());
        });
        break;

      //Special cases
      case "Backspace":
        e.preventDefault();
        this.deleteTextData();
        break;
      case "Delete":
        break;
      case "Enter":
        this.createNewDataNode();
        break;
      case "Insert":
      case "Shift":
      case "Control":
      case "Alt":
      case "CapsLock":
        //push to store?
        break;

      //add to buffer
      default:
        this.addToBuffer(e);
        break;
    }
  }

  addToBuffer(e) {
    //stores the starting position + ID for string concat in redux
    if (this.buffer.length === 0) {
      const relativePos = this.getNodeData();
      this.bufferStartPos = relativePos[0];
      this.bufferStartId = relativePos[2];
    }
    clearTimeout(this.bufferTimeout);
    this.buffer.push(e.key);
    console.log(this.buffer);
    this.bufferTimeout = setTimeout(
      this.pushBufferToStore,
      this.bufferTimeoutValue,
    );
  }

  pushBufferToStore() {
    if (this.buffer.length != 0) {
      console.log(
        "Push buffer triggered, Startpos:" +
          this.bufferStartPos +
          " ID: " +
          this.bufferStartId,
      );
      const editString = this.buffer.join("");
      console.log(editString);
      this.props.addText(this.bufferStartId, this.bufferStartPos, editString);
      this.buffer = [];
    }
  }

  deleteTextData() {
    this.pushBufferToStore();
    //need this? everything else updates position
    const relativePos = this.getNodeData();
    if (relativePos[0] === relativePos[4]) {
      this.props.deleteTextEnd(relativePos[2], relativePos[0]);
    } else if (relativePos[0] === 0) {
      //delete node instead
    } else {
      this.props.deleteText(relativePos[2], relativePos[0]);
    }
  }

  //not finished
  createNewDataNode() {
    const parent = document.getSelection().anchorNode.parentNode;
    const grandparent = parent.parentElement;
    console.log(
      parent.getAttribute("data-node-id") +
        " , " +
        grandparent.getAttribute("data-node-id"),
    );
    //get node type ... default to text node??
    //send node type + prev node id to store
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
            marginBottom: "2.5cm",
            marginLeft: "2.5cm",
            marginRight: "2.5cm",
            marginTop: "2.5cm",
            height: "297mm",
            width: "210mm",
          },
        }).render();

        this.setCursorPosition();
        content = (
          <div
            ref={this.contentEditableDiv}
            class="editor"
            contenteditable="true"
            onClick={this.handleDocumentClick}
            onkeyDown={this.logKeyPress}
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
  state => ({ document: state.document, styles: state.styles }),
  { moveSelection, addText, deleteTextEnd, deleteText },
)(Editor);
