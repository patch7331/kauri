/** @format */

import { Component, h } from "preact";
import { connect } from "react/redux";
import matchEvent from "../commands/shortcuts.js";

/**
 * Non-rendering component, responsible for handling keyboard shortcuts
 * @extends Component
 */
class ShortcutListener extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * On mount, add keydown event listener.
   * On event, handleKeyPress().
   * On unmount, remove listener.
   */
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress, true);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  /**
   * Checks if keys pressed match a registered shortcut.
   * On a match, fires callback for that shortcut.
   */
  handleKeyPress(event) {
    //shortcuts contains the list of shortcut IDs
    //commands contains the list of registered shortcut objects
    const shortcuts = Object.values(this.props.shortcuts.byIds);
    const commands = this.props.commands.byId;

    //matches contains the list of shortcuts that match the entered keys
    const matches = shortcuts.filter(shortcut => matchEvent(shortcut, event));

    //for each match in matches, fire the related callback
    matches.forEach(match => {
      commands[match.commandId].callback();
    });
  }
}

export default connect(state => ({ ...state.shortcuts }))(ShortcutListener);
