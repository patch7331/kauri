/** @format */

import { Component, h } from "preact";
import { connect } from "react/redux";

class ShortcutListener extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress, true);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown");
  }

  handleKeyPress(event) {
    //exits if key is a modifier
    if (
      event.key === "Control" ||
      event.key === "Shift" ||
      event.key === "Alt" ||
      event.key === "Meta"
    )
      return;

    //exits if a modifier is not pressed
    if (
      !event.modifierState("Ctrl") &&
      !event.modifierState("Shift") &&
      !event.modifierState("Alt") &&
      !event.modifierState("Meta")
    )
      return;

    //otherwise checks if pressed keys match keyboard shortcut,
    //and fires callback if it does
    const shortcuts = Object.values(this.props.shortcuts.byIds);
    const commands = this.props.commands.byId;

    const matches = shortcuts.filter(
      shortcut =>
        event.altKey === shortcut.isAlt &&
        event.ctrlKey === shortcut.isCtrl &&
        event.metaKey === shortcut.isMeta &&
        event.shiftKey === shortcut.isShift &&
        event.key === shortcut.key,
    );

    //ID = keyboardShortcut.getCallback("control+c");
    //command.byId[ID].callback();

    matches.forEach(match => {
      commands[match.commandId].callback();
    });
  }
}

export default connect(state => ({ ...state.shortcuts }))(ShortcutListener);
