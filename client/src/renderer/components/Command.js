
export default class Command() {
	constructor(id, name, callback) {
		this.shortcuts = [];
		const shortcut = {
			isAlt: false,
			isCtrl: false,
			isMeta: false,
			isShift: false
		}
		this.id = id;
		this.name = name;
		this.callback = callback;
	}

	createShortcut(definition) {
		if (typeof definition === "string") {
			definition = parseShortcut(definition);
		}
		
		
		const shortcuts = shortcut.split("+");
		
		this.shortcuts.push({
			isAlt: false,
			isCtrl: false,
			isMeta: false,
			isShift: false,
			...definition
		})
	}
}

registercommand(command) {
}

parseShortcut(str) {
	const shortcut = {};
	const modifiers = str.toLowerCase().split("+");

	if (modifiers.contains("alt"))
		shortcut["isAlt"] = true;
	if (modifiers.contains("control"))
		shortcuts["isCtrl"] = true;
	if (modifiers.contains("meta"))
		shortcut["isMeta"] = true;
	if (modifiers.contains("shift"))
		shortcut["isShift"] = true;
	shortcut["key"] = modifiers[modifiers.length - 1];
	return shortcut;
}

toObj() {
	return {
		id: this.id,
		name: this.name,
		shortcut: this.shortcut,
		callback: this.callback
	}
}

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
	allIds: [1]
	byId: {
		1: {
			id: 1,
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