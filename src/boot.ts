/**
 * App bootstrap
 */
import {app, Menu} from "electron";
import {CreateWin} from "./window";
import path from "path";
import {ApiRegister} from "./api";
import {InitLastDataDialog, OpenDataSource, OpenKeywordDialog, SaveKeyword} from "./command/dialog";
import {GetCaption, SaveCaption} from "./command/caption";
import {CheckPreference} from "./store";

export const AppInit = () => {
    CheckPreference().then(() => {
        APILoader();
        //Menu.setApplicationMenu(null);
        app.whenReady().then(() => {
            CreateWin({
                ui: path.join(__dirname,'../ui/home.html')
            }).then((win) => {
                // after ui load. Check old path if exists, we load it
                InitLastDataDialog(win);
            }).catch(() => {
                // Error, let do something
            })
        })
    }).catch(() => {
        // do something
    })
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}

/**
 * Đăng ký all api sẽ chạy
 * @constructor
 */
function APILoader() {
    ApiRegister('data.browser',OpenDataSource)
    ApiRegister('data.keyword',OpenKeywordDialog)
    ApiRegister('caption.get', GetCaption);
    ApiRegister('caption.save', SaveCaption);
    ApiRegister('data.keyword.save', SaveKeyword);
    ApiRegister('data.keyword.export', SaveKeyword);
}
