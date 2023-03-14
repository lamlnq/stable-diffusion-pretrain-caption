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
exports.SaveCaption = exports.GetCaption = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const store_1 = require("../store");
const GetCaption = (event, fileName) => {
    if (!fileName.includes('.')) {
        event.sender.send('api', 'caption.get', tags);
        return [];
    }
    const nameArray = path_1.default.parse(fileName);
    const ext = nameArray.ext;
    if (ext) {
        const dataPath = (0, store_1.GetPreference)()['lastDataPath'];
        const captionFile = path_1.default.join(dataPath, nameArray.name + '.txt');
        if (fs.existsSync(captionFile)) {
            const captionStr = fs.readFileSync(captionFile, { encoding: 'utf8', flag: 'r' });
            const tags = captionStr.toString().trim().split(',');
            event.sender.send('api', 'caption.get', tags);
            return tags;
        }
        else {
            event.sender.send('api', 'caption.get', []);
            return [];
        }
    }
    else {
        event.sender.send('api', 'caption.get', []);
        return [];
    }
};
exports.GetCaption = GetCaption;
const SaveCaption = (event, data) => {
    const dataPath = (0, store_1.GetPreference)('lastDataPath');
    const nameArray = path_1.default.parse(data.name);
    const captionFile = path_1.default.join(dataPath, nameArray.name + '.txt');
    fs.writeFileSync(captionFile, data.tags.join(','));
};
exports.SaveCaption = SaveCaption;
//# sourceMappingURL=caption.js.map