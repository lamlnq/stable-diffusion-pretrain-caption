declare global {
    interface Window {
        api: {
            send: (channel: string, ...data: any[]) => void,
            receive: (channel: string, receiver: (...data: any[]) => void) => void,
            invoke: (channel: string, ...data: any[]) => Promise<any>
        }
    }
}

export interface WindowOption {
    width?: number,
    height?: number
    ui: string
}

export interface JSObject {
    [key: string]: any
}

export interface SystemPreference {
    lastDataPath: string,
    lastKeywordPath: string
}
