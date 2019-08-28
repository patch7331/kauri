/** @format */

import { Component, h } from "preact";

export default class KeyboardShortcut extends Component {
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

  	//otherwise checks if pressed keys match keyboard shortcut, and fires callback if it does
  	if (
  	  event.altKey === isAlt &&
	  event.ctrlKey === isCtrl &&
	  event.metaKey === isMeta &&
	  event.shiftKey === isShift &&
	  event.key === this.key
	  ) {
  		ID = keyboardShortcut.getCallback("ctrl+c");
  		command.byId[ID].callback();
  	}
  }
}

 //"Ctrl+C"

createShortcut(shortcut) {
	obj shortcut = parse(shortcut)
	return {
		ctrl: false,
		alt: false,
		...
		key: "",
		...shortcut
	}
}