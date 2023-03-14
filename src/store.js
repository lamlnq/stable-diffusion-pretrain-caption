"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPreference = exports.GetPreference = exports.GetStore = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default({
    name: 'preference',
    encryptionKey: '5naKNUtZsOUIas323xI3xlwkMxpfNGf8jXIs',
    schema: {
        lastDataPath: {
            type: 'string',
            default: ''
        },
        lastKeywordPath: {
            type: 'string',
            default: ''
        }
    }
});
const _preference = {
    lastDataPath: '',
    lastKeywordPath: ''
};
const GetStore = () => {
    return store;
};
exports.GetStore = GetStore;
const GetPreference = (name) => {
    if (!name) {
        return _preference;
    }
    else {
        // @ts-ignore
        return _preference[name] ?? '';
    }
};
exports.GetPreference = GetPreference;
const CheckPreference = () => {
    return new Promise(resolve => {
        _preference['lastDataPath'] = store.get('lastDataPath');
        _preference['lastKeywordPath'] = store.get('lastKeywordPath');
        resolve(true);
    });
};
exports.CheckPreference = CheckPreference;
//# sourceMappingURL=store.js.map