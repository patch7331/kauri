import commandReducer from '../src/renderer/redux/reducers/commands';
import * as types from '../src/renderer/redux/actionTypes';

describe('command reducer', () => {
    it('should handle ADD_COMMAND', () => {
        expect( 
            commandReducer([], {
                type: types.ADD_COMMAND,
                id: "Clipboard:copy",
                name: "copy",
                keys: "CmdOrCtrl+C",
                behaviour: this.doClipboardCopy,
            })
        ).toEqual([
            {
                id: "Clipboard:copy",
                name: "copy",
                keys: "CmdOrCtrl+C",
                behaviour: this.doClipboardCopy,
            }
        ])
    })
})

