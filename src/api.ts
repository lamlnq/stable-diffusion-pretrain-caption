/**
 * Các tập chỉ lệnh của api
 */
import {ipcMain, IpcMainEvent, IpcMainInvokeEvent} from 'electron'

const apiList:Api[] = [];

interface Api {
    name: string,
    callback: (event: IpcMainEvent | IpcMainInvokeEvent, ...data: any[]) => any
}

export const ApiRegister = (name: string, cb: (event: IpcMainEvent | IpcMainInvokeEvent, ...data: any[]) => any) => {
  apiList.push({
      name: name,
      callback: cb
  })
}

ipcMain.on('api', (event, command, data) => {
    for (const api of apiList) {
        if (command == api.name) {
            api.callback(event, data)
            return;
        }
    }
})
ipcMain.handle('api', (event, command, data) => {
    for (const api of apiList) {
        if (command == api.name) {
            return api.callback(event, data)
        }
    }
})
