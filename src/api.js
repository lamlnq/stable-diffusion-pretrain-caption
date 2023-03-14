"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRegister = void 0;
/**
 * Các tập chỉ lệnh của api
 */
const electron_1 = require("electron");
const apiList = [];
const ApiRegister = (name, cb) => {
    apiList.push({
        name: name,
        callback: cb
    });
};
exports.ApiRegister = ApiRegister;
electron_1.ipcMain.on('api', (event, command, data) => {
    for (const api of apiList) {
        if (command == api.name) {
            api.callback(event, data);
            return;
        }
    }
});
electron_1.ipcMain.handle('api', (event, command, data) => {
    for (const api of apiList) {
        if (command == api.name) {
            return api.callback(event, data);
        }
    }
});
//# sourceMappingURL=api.js.map