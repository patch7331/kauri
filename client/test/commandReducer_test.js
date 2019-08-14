import commandReducer from '../src/renderer/redux/reducers/command';
import { ADD_COMMAND } from '../src/renderer/redux/actionTypes';

describe('command reducer', () => {
    it('should handle ADD_COMMAND', () => {
        expect( 
            commandReducer([], {
                type: ADD_COMMAND,
                payload: {
                    id: "Clipboard:copy",
                    name: "copy",
                    keys: "CmdOrCtrl+C",
                    behaviour: "this.doClipboardCopy",
                },
            })
        ).toEqual([
            {
                id: "Clipboard:copy",
                name: "copy",
                keys: "CmdOrCtrl+C",
                behaviour: "this.doClipboardCopy",
            }
        ])
    })
})

