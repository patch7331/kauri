/** @format */
import { genId } from "./uniqueIdGen";

export default class Command {
  constructor(id, name, callback) {
    this.shortcuts = [];
    this.id = id;
    this.name = name;
    this.callback = callback;
  }

  createShortcut(definition) {
    if (typeof definition === "string") {
      definition = parseShortcut(definition);
    }

    this.shortcuts.push({
      id: genId(),
      isAlt: false,
      isCtrl: false,
      isMeta: false,
      isShift: false,
      ...definition,
    });
  }

  /**
   *
   */
  //parse string into shortcut object. Expects "modifier<+modifier>+key"
  //no spaces, full names of modifiers, key at end
  parseShortcut(str) {
    const shortcut = {};
    const modifiers = str.toLowerCase().split("+");

    shortcut["isAlt"] = modifiers.contains("alt");
    shortcut["isCtrl"] = modifiers.contains("control");
    shortcut["isMeta"] = modifiers.contains("meta");
    shortcut["isShift"] = modifiers.contains("shift");
    shortcut["key"] = modifiers[modifiers.length - 1];
    
    return shortcut;
  }

  toObj = () => ({
    id: this.id,
    name: this.name,
    shortcuts: this.shortcuts,
    callback: this.callback,
  });
}

/*
output: (stuff to add, that is)

command {
	allIds: ["clipboard:copy"]
	byId: {
		"clipboard:copy": {
			id: "clipboard:copy",
			name: "copy",
			callback: callback
		}
	}
}

keyboardShortcut {
	const id = genID();
  allIds: [id]
	byId: {
		[id]: {
			id,
			isAlt: false,
			isCtrl: false,
			isShift: ......,
			key: "a",
			callback: "clipboard:copy"
		}
	}
}

on "ctrl+c", do
	command.byId.[ctrl+c の callback];
	
ID = keyboardShortcut.getCallback("ctrl+c")
command.byId[ID].callback();
*/
