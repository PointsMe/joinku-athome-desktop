module.exports = {
    publicPath: "./",
    outputDir: process.env.VUE_APP_OUTPUT_DIR,
    devServer: {
        open: false, // 服务启动后默认打开浏览器
        host: '0.0.0.0',
        port: 5103,
        before: app => {
        }
    },
    productionSourceMap: false,  // 打包不需要生成map文件
    // 第三方插件配置
    pluginOptions: {
        electronBuilder: {
            outputDir: "dist_electron",//打包后输出的目录名
            nodeIntegration: true,   // 开启node环境
            "files": [
                "**/*",
            ],
            "extraFiles": [
                {
                    "from": "./resource/*",
                    "to": "./resource"
                }
            ],
            builderOptions: {
                win: {
                    icon: './public/app.ico'
                },
                mac: {
                    icon: './public/app.png'
                },
                productName: 'Joinku-athome-desktop',
                nsis: {
                    "oneClick": false,
                    "perMachine": true,
                    "allowElevation": true,
                    "allowToChangeInstallationDirectory": true,
                    "createDesktopShortcut": true,
                    "createStartMenuShortcut": true
                },
                publish: {
                    "provider": "generic",
                    "url": ""
                },
            }
        }
    },
}
