/**
 * Cầu giao tiếp giữa process và render
 */
import {contextBridge, ipcRenderer} from "electron";


contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'api', {
        // From render to main.
        send: (command: string, data:any) => {
            ipcRenderer.send('api', command, data);
        },
        // From main to render.
        receive: (command: string, listener: (...data: any[]) => void) => {
            ipcRenderer.on('api', (event, cmd, ...data) => {
                if (cmd == command) {
                    listener(...data)
                }
            });
        },
        // From render to main and back again.
        invoke: (command: string, data:any) => {
            return ipcRenderer.invoke('api', command, data);
        }
    }
);

