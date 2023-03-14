/**
 * tạo và quản lý cửa sổ
 */
import {BrowserWindow} from "electron";
import * as path from "path";
import {WindowOption} from "../defined";

export const CreateWin = (option?:WindowOption) => {
    const winOps = {...{width: 1300,height: 900, ui: path.join(__dirname,'../ui/404.html')},...option}
    const win = new BrowserWindow({
        width: winOps.width,
        height: winOps.height,
        minWidth: 1200,
        minHeight: 900,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'api.bridge.js'),
        },
    })
    return new Promise<BrowserWindow>(resolve => {
        win.loadFile(winOps.ui).then(() => {
            resolve(win)
        }).catch(() => {
            resolve(win)
        })
    })
}

