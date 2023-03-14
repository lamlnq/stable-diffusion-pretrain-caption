import Store from "electron-store";
import {SystemPreference} from "../defined";

const store = new Store({
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
})

const _preference: SystemPreference = {
    lastDataPath: '',
    lastKeywordPath: ''
};

export const GetStore = () => {
  return store;
}
export const GetPreference = (name?:string) => {
    if (!name) {
        return _preference;
    } else {
        // @ts-ignore
        return _preference[name] ?? ''
    }
}

export const CheckPreference =  () => {
    return new Promise<boolean>(resolve => {
        _preference['lastDataPath'] = <string>store.get('lastDataPath')
        _preference['lastKeywordPath'] = <string>store.get('lastKeywordPath')
        resolve(true)
    })
}

