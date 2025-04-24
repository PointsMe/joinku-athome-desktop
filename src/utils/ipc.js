import { ipcRenderer } from 'electron'
const os = require("os");

/*
* 查询设备号
* */
export const queryMachineMac = () => {
    return new Promise((resolve, reject) => {
        ipcRenderer.invoke('machine-mac', 'OK').then(res => {
            resolve(res)
        })
    })
}

/*
* 查询本地ip
* */
export const queryLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        for (const alias of interfaces[devName]) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "127.0.0.1"; // 如果找不到，则返回本地回环地址
}

/*
* 查询打印机列表
* */
export const queryPrinterList = () => {
    return new Promise((resolve, reject) => {
        ipcRenderer.invoke('query-printer-list', 'OK').then(res => {
            resolve(res)
        })
    })
}

/*
* 普通打印机开钱箱
* */
export const normalOpenCashbox = (data) => {
    ipcRenderer.invoke('connect-normal-printer', data).then(res => {
        ipcRenderer.send('cashbox-normal-printer', 'open')
    })
}

/**
 * 调用虚拟键盘
 */
export const startKeyboard = () => {
    ipcRenderer.send('activate-keyboard', 'start')
}

/**
 * 退出应用程序
 */
export const quitApp = () => {
    ipcRenderer.send('quit-app', 'quit')
}
