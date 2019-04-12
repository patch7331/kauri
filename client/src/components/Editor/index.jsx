/** @format */

import "./styles.scss";

import { h, Component } from "preact";

const POST_URI = "http://127.0.0.1:3000/key";

export default class Editor extends Component {
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
      <div class="editor" contenteditable="true" oninput={this._handleInput}>
        Hello
      </div>
    );
  }
}
