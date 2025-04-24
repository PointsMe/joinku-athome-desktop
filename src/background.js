"use strict";

import {app, BrowserWindow, ipcMain, Menu, protocol} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
import installExtension, {VUEJS_DEVTOOLS} from "electron-devtools-installer";
import {machineIdSync} from "node-machine-id";
import {autoUpdater} from 'electron-updater'

const { exec } = require("child_process");
const os = require('os')

// const path = require('path')

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);

let win = null;

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        maximizable: true,
        minimizable: true,
        resizable: false,   // 窗口大小是否可调整
        // fullscreen: true,   // 窗口是否全屏
        autoHideMenuBar: true,  // 自动隐藏菜单栏
        // frame: false, // 隐藏默认的窗口框架
        webPreferences: {
            webviewTag: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: `${__static}/app.ico`
    });
    
    // 窗口最大化
    win.maximize();
    // 隐藏菜单
    win.setMenu(null);
    
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
    
    // createMenu();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    
    ipcMain.on("render-msg", async (event, arg) => {
        event.sender.send("person-list", "hello world");
    });
    
    createWindow();
    
    handleIPC();
    handlePrinter()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

// 设置菜单栏
function createMenu() {
    // darwin表示macOS，针对macOS的设置
    if (process.platform === "darwin") {
        const template = [{
            label: "App Demo",
            submenu: [
                { role: "about" },
                { role: "quit" },
            ]
        }];
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        // windows及linux系统
        Menu.setApplicationMenu(null);
    }
}

// 开启监听渲染进程消息
function handleIPC() {
    // 返回设备号
    ipcMain.handleOnce("machine-mac", function(e, args) {
        return machineIdSync({ original: true });
    });
    
    // 调用虚拟键盘
    ipcMain.on('activate-keyboard', (e, mes) => {
        if (os.platform() === 'win32') {
            exec('osk.exe')
        } else {
            exec('onboard')
        }
    })
    
    // 获取打印机列表
    ipcMain.handle('query-printer-list', (event, data) => {
        //主线程获取打印机列表
        return win.webContents.getPrinters() || [];
    })
    
    // 退出应用
    ipcMain.on('quit-app', (e, mes) => {
        app.quit();
    })
    
    // 开始升级
    ipcMain.on('upgrade-start', (event,address) => {
        upgradeHandle(address);
    });
}
// 开启监听渲染进程消息
function handlePrinter () {
    // 连接普通打印机
    let normalPrinter = null
    function connectNormalPrinter (data) {
        return new Promise((resolve, reject) => {
            let net = require('net');
            normalPrinter = new net.Socket();
            normalPrinter.connect(data.port, data.ip, function() {
                resolve();
            });
            normalPrinter.on('error', function(error) {
                //错误出现之后关闭连接
                normalPrinter.destroy();
                normalPrinter = null;
                reject();
            });
        });
    }
    // 连接普通打印机
    ipcMain.handle("connect-normal-printer",async(e, data)=>{
        return await connectNormalPrinter(data);
    });
    // 普通打印机开钱箱
    ipcMain.on("cashbox-normal-printer",async(e, data)=>{
        let code = ['0x1B', '0x70', '0x00', '0x80', '0xFF'];
        let buffer = Buffer.from(code, 'hex');
        normalPrinter.write(buffer);
        setTimeout(() => {
            normalPrinter.destroy(); //延迟一下发送完指令就断开
            normalPrinter = null;
        }, 1000);
    });
}


function upgradeHandle(address) {
    // 设置更新服务器url
    autoUpdater.setFeedURL(address)
    // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包
    // autoUpdater.autoDownload = true
    
    // 更新失败
    autoUpdater.on('error', function(error) {
        win.webContents.send('upgrade-error');
    })
    // 获取版本信息
    // autoUpdater.on('checking-for-upgrade', function() {
    //     win.webContents.send('checking-for-upgrade');
    // })
    // 更新可用
    autoUpdater.on('update-available', function(info) {
        win.webContents.send('upgrade-available');
    })
    // 更新不可用
    autoUpdater.on('update-not-available', function(info) {
        win.webContents.send('upgrade-not-available');
    })
    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
        win.webContents.send('download-progress', progressObj)
    })
    // 更新下载完成
    autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, upgradeUrl, quitAndUpdate) {
        win.webContents.send('upgrade-downloaded');
        // 开启安装界面
        autoUpdater.quitAndInstall();
    })
    // 执行自动更新检查
    autoUpdater.checkForUpdates();
}

