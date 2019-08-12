/** @format */

import "./styles.scss";

import { h, Component, createRef } from "preact";
import { renderNodeList } from "dom/render";
import { connect } from "react-redux";

import ToolBar from "components/Editor/ToolBar";

/**
 * A document editing component.
 * @extends Component
 */
class Editor extends Component {
  componentDidMount() {
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand("styleWithCSS", false, true);
  }

  render = props => (
    <div>
      <ToolBar />

      <div class="editor" contenteditable="true">
        {renderNodeList(props.document)}
      </div>
    </div>
  );
}

export default connect(
  state => ({ document: state.document }),
  null
)(Editor);
