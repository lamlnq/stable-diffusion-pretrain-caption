import * as fs from "fs";
import path from "path";
import {GetPreference} from "../store";
import {IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {JSObject} from "../../defined";

export const GetCaption = (event: IpcMainEvent | IpcMainInvokeEvent, fileName: string) => {
    if (!fileName.includes('.')) {
        event.sender.send('api','caption.get', tags)
        return []
    }
    const nameArray = path.parse(fileName);
    const ext = nameArray.ext;
    if (ext) {
        const dataPath = GetPreference()['lastDataPath'];
        const captionFile = path.join(dataPath, nameArray.name + '.txt')
        if (fs.existsSync(captionFile)) {
            const captionStr = fs.readFileSync(captionFile, {encoding:'utf8', flag:'r'});
            const tags = captionStr.toString().trim().split(',')
            event.sender.send('api','caption.get', tags)
            return tags
        } else {
            event.sender.send('api','caption.get', [])
            return [];
        }
    } else {
        event.sender.send('api','caption.get', [])
        return [];
    }
}

export const SaveCaption = (event: IpcMainEvent | IpcMainInvokeEvent, data:JSObject) => {
    const dataPath = GetPreference('lastDataPath');
    const nameArray = path.parse(data.name);
    const captionFile = path.join(dataPath, nameArray.name + '.txt')
    fs.writeFileSync(captionFile, data.tags.join(','))
}


