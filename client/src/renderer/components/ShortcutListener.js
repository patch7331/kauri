/** @format */

import { Component, h } from "preact";
import { connect } from "react-redux";
import readJSON from "../commands/shortcuts.js";

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
    const shortcuts = Object.values(this.props.shortcuts.byId);
    const commands = this.props.commands.byId;

    //generate list of shortcuts that match the entered keys
    //for each match, fire the related callback
    shortcuts
      .filter(shortcut => matchEvent(shortcut, event))
      .forEach(match => {
        commands[match.id].callback();
      });
  }

  /**
   * Compare registered shortcut with keydown event
   * @param  {shortcut} shortcut  registered shortcut object
   * @param  {event}    event     caught keydown event
   * @return {boolean}            true if keydown event matches shortcut description
   */
  export function matchEvent(shortcut, event) {
    const modifiers = shortcut.modifiers;
    return (
      event.altKey === modifiers.contains("alt") &&
      event.ctrlKey === modifiers.contains("ctrl") &&
      event.metaKey === modifiers.contains("meta") &&
      event.shiftKey === modifiers.contains("shift") &&
      event.key === shortcut.key
    );
  }
}

export default connect(state => ({ ...state.shortcuts }))(ShortcutListener);
