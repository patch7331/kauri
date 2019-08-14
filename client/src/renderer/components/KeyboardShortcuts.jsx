/** @format */

import { Component, h } from "preact";

export default class KeyboardShortcuts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress, true);
  }

  handleKeyPress(event) {
    if (event.getModifierState()) return;
  }
}
