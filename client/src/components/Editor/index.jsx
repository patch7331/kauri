/** @format */

import "./styles.scss";

import { h, Component } from "preact";
import { renderDom } from "dom/render";

const POST_URI = "http://127.0.0.1:3000/key";

/**
 * A document editing component.
 */
export default class Editor extends Component {
  /**
   * Constructs a new editor component.
   * @param {Object} props Component properties.
   * @param {DOM} props.dom A DOM to render in the editor.
   */
  constructor(props) {
    super(props);
    this.dom = props.dom;
  }

  /**
   * Handles inputs on the contenteditable dic.
   * @param {Event} event Input event.
   * @private
   */
  _handleInput(event) {
    const { data } = event;
    fetch(POST_URI, { method: "POST", body: data })
      .then(resp => console.log(resp))
      .catch(e => alert(e));
  }

  render() {
    return (
      <div class="editor" contenteditable="false" oninput={this._handleInput}>
        {renderDom(this.props.dom)}
      </div>
    );
  }
}
