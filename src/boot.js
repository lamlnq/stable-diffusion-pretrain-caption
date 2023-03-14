"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInit = void 0;
/**
 * App bootstrap
 */
const electron_1 = require("electron");
const window_1 = require("./window");
const path_1 = __importDefault(require("path"));
const api_1 = require("./api");
const dialog_1 = require("./command/dialog");
const caption_1 = require("./command/caption");
const store_1 = require("./store");
const AppInit = () => {
    (0, store_1.CheckPreference)().then(() => {
        APILoader();
        //Menu.setApplicationMenu(null);
        electron_1.app.whenReady().then(() => {
            (0, window_1.CreateWin)({
                ui: path_1.default.join(__dirname, '../ui/home.html')
            }).then((win) => {
                // after ui load. Check old path if exists, we load it
                (0, dialog_1.InitLastDataDialog)(win);
            }).catch(() => {
                // Error, let do something
            });
        });
    }).catch(() => {
        // do something
    });
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
};
exports.AppInit = AppInit;
/**
 * Đăng ký all api sẽ chạy
 * @constructor
 */
function APILoader() {
    (0, api_1.ApiRegister)('data.browser', dialog_1.OpenDataSource);
    (0, api_1.ApiRegister)('data.keyword', dialog_1.OpenKeywordDialog);
    (0, api_1.ApiRegister)('caption.get', caption_1.GetCaption);
    (0, api_1.ApiRegister)('caption.save', caption_1.SaveCaption);
    (0, api_1.ApiRegister)('data.keyword.save', dialog_1.SaveKeyword);
    (0, api_1.ApiRegister)('data.keyword.export', dialog_1.SaveKeyword);
}
//# sourceMappingURL=boot.js.map