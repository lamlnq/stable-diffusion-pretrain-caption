import {dialog, IpcMainEvent, IpcMainInvokeEvent, BrowserWindow} from 'electron'
import * as fs from "fs";
import {GetPreference, GetStore} from "../store";
import path from "path";

export const OpenDataSource = (event: IpcMainEvent | IpcMainInvokeEvent) => {
    return dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(openInfo => {
        if (openInfo.canceled) {
            event.sender.send('api', 'data.browser', [false,false])
            return [false,false]
        } else {
            GetStore().set('lastDataPath', openInfo.filePaths[0])
            const returnData =  [openInfo.filePaths[0], getFiles(openInfo.filePaths[0])]
            event.sender.send('api', 'data.browser', returnData)
            return returnData
        }
    }).catch(() => {
        event.sender.send('api', 'data.browser', [false,false])
        return [false,false];
    })
}
export const OpenKeywordDialog = (event: IpcMainEvent | IpcMainInvokeEvent) => {
    return dialog.showOpenDialog({
        filters: [{extensions:[ 'json'], name: 'JSON'}]
    }).then(openInfo => {
        if (openInfo.canceled) {
            event.sender.send('api', 'data.keyword', [false,false])
            return [false,false]
        } else {
            try{
                GetStore().set('lastKeywordPath', openInfo.filePaths[0])
                const returnData =  [openInfo.filePaths[0], JSON.parse(fs.readFileSync(openInfo.filePaths[0]).toString())]
                event.sender.send('api', 'data.keyword', returnData)
                return returnData;
            }catch (e) {
                event.sender.send('api', 'data.keyword', [])
                return [];
            }
        }
    }).catch(() => {
        event.sender.send('api', 'data.keyword', [false,false])
        return [false,false];
    })
}

export const SaveKeyword = (event: IpcMainEvent | IpcMainInvokeEvent,tags:any) => {
    const pre = GetPreference();
    if (pre.lastKeywordPath) {
        // save direct to file
        fs.writeFileSync(pre.lastKeywordPath, JSON.stringify(tags))
    } else {
        return dialog.showOpenDialog({
            filters: [{extensions:[ 'json'], name: 'JSON'}]
        }).then(openInfo => {
            if (openInfo.canceled) {
                // cancle save
            } else {
                // do save
                fs.writeFileSync(openInfo.filePaths[0], JSON.stringify(tags))
            }
        }).catch(() => {
            // failed
        });
    }
}
export const ExportKeyword = (event: IpcMainEvent | IpcMainInvokeEvent,tags:any) => {
    return dialog.showOpenDialog({
        filters: [{extensions:[ 'json'], name: 'JSON'}]
    }).then(openInfo => {
        if (openInfo.canceled) {
            // cancle save
        } else {
            // do save
            fs.writeFileSync(openInfo.filePaths[0], JSON.stringify(tags))
        }
    }).catch(() => {
        // failed
    });
}

export const InitLastDataDialog = (win: BrowserWindow) => {
    const pre = GetPreference();
    if (pre.lastDataPath && fs.existsSync(pre.lastDataPath)) {
        const returnData =  [pre.lastDataPath, getFiles(pre.lastDataPath)]
        win.webContents.send('api', 'data.browser', returnData)
    }
    if (pre.lastKeywordPath && fs.existsSync(pre.lastKeywordPath)) {
        const returnData =  [pre.lastKeywordPath, JSON.parse(fs.readFileSync(pre.lastKeywordPath).toString())]
        win.webContents.send('api', 'data.keyword', returnData)
    }
}

function getFiles(dir: string) {
    const files = fs.readdirSync(dir);
    const data:string[] = [];
    for (const file of files) {
        if (['.png','.jpg'].indexOf(path.extname(file)) >= 0) {
            data.push(file)
        }
    }
    return data;
}
