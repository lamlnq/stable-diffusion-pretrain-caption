"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitLastDataDialog = exports.ExportKeyword = exports.SaveKeyword = exports.OpenKeywordDialog = exports.OpenDataSource = void 0;
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const store_1 = require("../store");
const path_1 = __importDefault(require("path"));
const OpenDataSource = (event) => {
    return electron_1.dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(openInfo => {
        if (openInfo.canceled) {
            event.sender.send('api', 'data.browser', [false, false]);
            return [false, false];
        }
        else {
            (0, store_1.GetStore)().set('lastDataPath', openInfo.filePaths[0]);
            const returnData = [openInfo.filePaths[0], getFiles(openInfo.filePaths[0])];
            event.sender.send('api', 'data.browser', returnData);
            return returnData;
        }
    }).catch(() => {
        event.sender.send('api', 'data.browser', [false, false]);
        return [false, false];
    });
};
exports.OpenDataSource = OpenDataSource;
const OpenKeywordDialog = (event) => {
    return electron_1.dialog.showOpenDialog({
        filters: [{ extensions: ['json'], name: 'JSON' }]
    }).then(openInfo => {
        if (openInfo.canceled) {
            event.sender.send('api', 'data.keyword', [false, false]);
            return [false, false];
        }
        else {
            try {
                (0, store_1.GetStore)().set('lastKeywordPath', openInfo.filePaths[0]);
                const returnData = [openInfo.filePaths[0], JSON.parse(fs.readFileSync(openInfo.filePaths[0]).toString())];
                event.sender.send('api', 'data.keyword', returnData);
                return returnData;
            }
            catch (e) {
                event.sender.send('api', 'data.keyword', []);
                return [];
            }
        }
    }).catch(() => {
        event.sender.send('api', 'data.keyword', [false, false]);
        return [false, false];
    });
};
exports.OpenKeywordDialog = OpenKeywordDialog;
const SaveKeyword = (event, tags) => {
    const pre = (0, store_1.GetPreference)();
    if (pre.lastKeywordPath) {
        // save direct to file
        fs.writeFileSync(pre.lastKeywordPath, JSON.stringify(tags));
    }
    else {
        return electron_1.dialog.showOpenDialog({
            filters: [{ extensions: ['json'], name: 'JSON' }]
        }).then(openInfo => {
            if (openInfo.canceled) {
                // cancle save
            }
            else {
                // do save
                fs.writeFileSync(openInfo.filePaths[0], JSON.stringify(tags));
            }
        }).catch(() => {
            // failed
        });
    }
};
exports.SaveKeyword = SaveKeyword;
const ExportKeyword = (event, tags) => {
    return electron_1.dialog.showOpenDialog({
        filters: [{ extensions: ['json'], name: 'JSON' }]
    }).then(openInfo => {
        if (openInfo.canceled) {
            // cancle save
        }
        else {
            // do save
            fs.writeFileSync(openInfo.filePaths[0], JSON.stringify(tags));
        }
    }).catch(() => {
        // failed
    });
};
exports.ExportKeyword = ExportKeyword;
const InitLastDataDialog = (win) => {
    const pre = (0, store_1.GetPreference)();
    if (pre.lastDataPath && fs.existsSync(pre.lastDataPath)) {
        const returnData = [pre.lastDataPath, getFiles(pre.lastDataPath)];
        win.webContents.send('api', 'data.browser', returnData);
    }
    if (pre.lastKeywordPath && fs.existsSync(pre.lastKeywordPath)) {
        const returnData = [pre.lastKeywordPath, JSON.parse(fs.readFileSync(pre.lastKeywordPath).toString())];
        win.webContents.send('api', 'data.keyword', returnData);
    }
};
exports.InitLastDataDialog = InitLastDataDialog;
function getFiles(dir) {
    const files = fs.readdirSync(dir);
    const data = [];
    for (const file of files) {
        if (['.png', '.jpg'].indexOf(path_1.default.extname(file)) >= 0) {
            data.push(file);
        }
    }
    return data;
}
//# sourceMappingURL=dialog.js.map