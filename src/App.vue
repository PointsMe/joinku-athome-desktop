<template>
  <div id="app">
      <keep-alive :include="keepList">
          <router-view />
      </keep-alive>
      <!-- 升级提示 -->
      <Upgrade/>
      <!-- 预打 - 意大利 -->
      <webview id="preprintIt" src="/preprintIt.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 预打 - 中国 -->
      <webview id="preprintZh" src="/preprintZh.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 预打 - 英国 -->
      <webview id="preprintEn" src="/preprintEn.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 预打 - 法国 -->
      <webview id="preprintFr" src="/preprintFr.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 预打 - 德国 -->
      <webview id="preprintDe" src="/preprintDe.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 预打 - 西班牙 -->
      <webview id="preprintEs" src="/preprintEs.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 意大利 -->
      <webview id="printInvoiceIt" src="/printInvoiceIt.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 中国 -->
      <webview id="printInvoiceZh" src="/printInvoiceZh.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 英国 -->
      <webview id="printInvoiceEn" src="/printInvoiceEn.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 法国 -->
      <webview id="printInvoiceFr" src="/printInvoiceFr.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 德国 -->
      <webview id="printInvoiceDe" src="/printInvoiceDe.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 发票 - 西班牙 -->
      <webview id="printInvoiceEs" src="/printInvoiceEs.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 意大利 -->
      <webview id="printStatsIt" src="/printStatsIt.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 中国 -->
      <webview id="printStatsZh" src="/printStatsZh.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 英国 -->
      <webview id="printStatsEn" src="/printStatsEn.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 法国 -->
      <webview id="printStatsFr" src="/printStatsFr.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 德国 -->
      <webview id="printStatsDe" src="/printStatsDe.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 日总结 - 西班牙 -->
      <webview id="printStatsEs" src="/printStatsEs.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 意大利 -->
      <webview id="printBarcodeIt" src="/printBarcodeIt.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 中国 -->
      <webview id="printBarcodeZh" src="/printBarcodeZh.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 英国 -->
      <webview id="printBarcodeEn" src="/printBarcodeEn.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 法国 -->
      <webview id="printBarcodeFr" src="/printBarcodeFr.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 德国 -->
      <webview id="printBarcodeDe" src="/printBarcodeDe.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 条码 - 西班牙 -->
      <webview id="printBarcodeEs" src="/printBarcodeEs.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
      <!-- 图片 -->
      <webview id="printImage" src="/printImage.html" nodeintegration webpreferences="contextIsolation=no" v-show="false"></webview>
  </div>
</template>

<script>

import { mapState} from "vuex";
import {createMenu} from "@/utils/generateMenu";
import moment from "moment";
import Upgrade from "@/components/Upgrade";

export default {
    name: 'App',
    components: {
        Upgrade
    },
    data() {
        return {
            keepList: [],
            snfTimer: null
        }
    },
    // 计算属性
    computed: {
        ...mapState(['printerName']),
    },
    created () {
        if (sessionStorage.getItem('token')) {
            // 设置路由
            createMenu()
        }
        // 开始snf定时器
        this.startSnfTimer();//轮询完成当天
    },
    mounted() {
        // 初始化打印业务
        this.initPrint()
    },
    methods: {
        // 开始snf定时器
        startSnfTimer () {
            let preprintDate = localStorage.getItem('preprintDate')
            let currentDate = moment().format('YYYY-MM-DD')
            let snf = localStorage.getItem('snf')
            if (localStorage.getItem('snf')) {
                if (preprintDate === currentDate) {
                    localStorage.setItem('snf', snf);
                } else {
                    localStorage.setItem('snf', '1');
                    localStorage.setItem('preprintDate', currentDate);
                }
            } else {
                localStorage.setItem('snf', '1');
            }
            if (this.snfTimer) {
                clearInterval(this.snfTimer)
            }
            this.snfTimer = setInterval(() => {
                this.getCurrentDay()
            }, 1000)
        },
        getCurrentDay() {
            let preprintDate = localStorage.getItem('preprintDate')
            let currentDate = moment().format('YYYY-MM-DD')
            if (preprintDate !== currentDate) {
                localStorage.setItem('snf', '1');
                localStorage.setItem('preprintDate', currentDate);
            }
        },
        
        // 初始化打印业务
        initPrint() {
            // 预打单（意大利）
            const webviewPreprintIt = document.querySelector('#preprintIt');
            webviewPreprintIt.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintIt
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 预打单（中国）
            const webviewPreprintZh = document.querySelector('#preprintZh');
            webviewPreprintZh.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintZh
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 预打单（英国）
            const webviewPreprintEn = document.querySelector('#preprintEn');
            webviewPreprintEn.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintEn
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 预打单（法国）
            const webviewPreprintFr = document.querySelector('#preprintFr');
            webviewPreprintFr.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintFr
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 预打单（德国）
            const webviewPreprintDe = document.querySelector('#preprintDe');
            webviewPreprintDe.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintDe
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 预打单（西班牙）
            const webviewPreprintEs = document.querySelector('#preprintEs');
            webviewPreprintEs.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewPreprintEs
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            
            // 发票（意大利）
            const webviewInvoiceIt = document.querySelector('#printInvoiceIt');
            webviewInvoiceIt.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceIt
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 发票（中国）
            const webviewInvoiceZh = document.querySelector('#printInvoiceZh');
            webviewInvoiceZh.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceZh
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 发票（英国）
            const webviewInvoiceEn = document.querySelector('#printInvoiceEn');
            webviewInvoiceEn.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceEn
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 发票（法国）
            const webviewInvoiceFr = document.querySelector('#printInvoiceFr');
            webviewInvoiceFr.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceFr
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 发票（德国）
            const webviewInvoiceDe = document.querySelector('#printInvoiceDe');
            webviewInvoiceDe.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceDe
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 发票（西班牙）
            const webviewInvoiceEs = document.querySelector('#printInvoiceEs');
            webviewInvoiceEs.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewInvoiceEs
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            localStorage.setItem('snf', Number(localStorage.getItem('snf')) + 1);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            
            // 日总结（意大利）
            const webviewStatsIt = document.querySelector('#printStatsIt');
            webviewStatsIt.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsIt
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 日总结（中国）
            const webviewStatsZh = document.querySelector('#printStatsZh');
            webviewStatsZh.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsZh
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 日总结（英国）
            const webviewStatsEn = document.querySelector('#printStatsEn');
            webviewStatsEn.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsEn
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 日总结（法国）
            const webviewStatsFr = document.querySelector('#printStatsFr');
            webviewStatsFr.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsFr
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 日总结（德国）
            const webviewStatsDe = document.querySelector('#printStatsDe');
            webviewStatsDe.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsDe
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 日总结（西班牙）
            const webviewStatsEs = document.querySelector('#printStatsEs');
            webviewStatsEs.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
                    webviewStatsEs
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
    
            // 条码（意大利）
            const webviewBarcodeIt = document.querySelector('#printBarcodeIt');
            webviewBarcodeIt.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeIt
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 条码（中国）
            const webviewBarcodeZh = document.querySelector('#printBarcodeZh');
            webviewBarcodeZh.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeZh
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 条码（英国）
            const webviewBarcodeEn = document.querySelector('#printBarcodeEn');
            webviewBarcodeEn.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeEn
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 条码（法国）
            const webviewBarcodeFr = document.querySelector('#printBarcodeFr');
            webviewBarcodeFr.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeFr
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 条码（德国）
            const webviewBarcodeDe = document.querySelector('#printBarcodeDe');
            webviewBarcodeDe.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeDe
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
            // 条码（西班牙）
            const webviewBarcodeEs = document.querySelector('#printBarcodeEs');
            webviewBarcodeEs.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewBarcodeEs
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
    
            // 图片
            const webviewImage = document.querySelector('#printImage');
            webviewImage.addEventListener('ipc-message', (event) => {
                if (event.channel === 'webview-print-do') {
                    webviewImage
                        .print({
                            silent: true,//静默打印
                            printBackground: true,
                            deviceName: this.printerName, //打印机名称
                        })
                        .then((res) => {
                            console.log('ok')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
        },
    },
    // 销毁之前
    beforeDestroy() {
        if (this.snfTimer) {
            clearInterval(this.snfTimer)
        }
    }
};
</script>

<style lang="scss">
#app {
    font-family: PingFang SC, PingFang SC, Roboto, Verdana, Microsoft YaHei, Simsun;
}
</style>
