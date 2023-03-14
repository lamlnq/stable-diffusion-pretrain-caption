"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cầu giao tiếp giữa process và render
 */
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld(
// Allowed 'ipcRenderer' methods.
'api', {
    // From render to main.
    send: (command, data) => {
        electron_1.ipcRenderer.send('api', command, data);
    },
    // From main to render.
    receive: (command, listener) => {
        electron_1.ipcRenderer.on('api', (event, cmd, ...data) => {
            if (cmd == command) {
                listener(...data);
            }
        });
    },
    // From render to main and back again.
    invoke: (command, data) => {
        return electron_1.ipcRenderer.invoke('api', command, data);
    }
});
//# sourceMappingURL=api.bridge.js.map