<template>
    <div class="layout-aside-content">
        <div class="layout-aside-menu">
            <div class="menu-list">
                <div
                    v-for="item in menuList"
                    :key="item.name"
                    class="item"
                    :class="{active: routeName === item.name}">
                    <div class="item-in" @click="clickMenuHandle(item.name)">
                        <i :class="'iconfont icon-' + item.meta.icon"></i>
                        <span class="text">{{ generateTitle(item.meta.title) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="layout-aside-footer">
            <Language />
            <div class="handle">
                <div class="handle-item">
                    <a
                        href="javascript:void(0)"
                        class="clickable"
                    @click="printTotalStats">
                        {{ $t('daily') }}&nbsp;({{ $t('all') }})
                    </a>
                </div>
                <div class="handle-item">
                    <a
                        href="javascript:void(0)"
                        class="clickable"
                        @click="getEmployeeStats">
                        {{ $t('daily') }}&nbsp;({{ $t('staff') }})
                    </a>
                </div>
                <!--<div class="handle-item">-->
                <!--    <a-->
                <!--        href="javascript:void(0)"-->
                <!--        class="clickable">-->
                <!--        {{ $t('bulletin') }}&nbsp;({{ $t('all') }})-->
                <!--    </a>-->
                <!--</div>-->
            </div>
            <div class="quit">
                <a href="javascript:void(0)" class="clickable" @click="logoutHandle">
                    <i class="iconfont icon-quit"></i>
                    {{ $t('quit') }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import Language from "@/components/Language";
import {mapMutations, mapState} from "vuex";
import {accountLogout, queryDailyStats, queryEmployeeStats} from "@/api";
import moment from "moment";
import {queryPrinterList} from "@/utils/ipc";
import {epsonDailySummary} from "@/utils/printer";

export default {
    name: "LayoutAside",
    // 组件
    components: {
        Language
    },
    props: {},
    data() {
        return {};
    },
    // 计算属性
    computed: {
        ...mapState(['menuList', 'routeName', 'userName', 'userNumber']),
        ...mapState({
            shopName: state => state.shopInfo.name,
            companyCountry: state => state.shopInfo.companyCountry   // 国家
        }),
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        ...mapMutations(['savePrinterName']),
        // 获取菜单标题
        generateTitle(name) {
            if (!name) return ''
            if (this.$t('route.' + name)) {
                return this.$t('route.' + name)
            } else {
                return ''
            }
        },
        // 点击菜单
        clickMenuHandle (name) {
            this.$router.push({ name })
        },
    
        // 打印日总结
        printTotalStats () {
            let taxPrinterType = localStorage.getItem("taxPrinterType")
            let taxPrinterIp = localStorage.getItem("taxPrinterIp")
            if (taxPrinterType === 'epsonWeb') {
                if (!taxPrinterIp) {
                    this.$message({
                        showClose: true,
                        message: this.$t('noTaxIp'),
                        type: 'warning'
                    });
                    return;
                }
                this.$epsonPrinter.dailySum(taxPrinterIp).then((dt) => {
                    if (!dt) {
                        // 打印失败
                        this.$message({
                            showClose: true,
                            message: this.$t('hintPrinterError'),
                            type: 'error'
                        });
                    }
                });
            } else if (taxPrinterType === 'epson') {
                epsonDailySummary()
            } else {
                // 非税务打印机打印日总结
                this.getTotalStats()
            }
        },
        
        // 获取全部日总结
        getTotalStats () {
            queryDailyStats().then(res => {
                if (res.code === 20000) {
                    if (!res.data) {
                        this.$message({
                            showClose: true,
                            message: this.$t('notPrintData'),
                            type: 'error'
                        })
                        return
                    }
                    this.printDailyStats({
                        ...res.data,
                        type: 'total'
                    })
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        },
        // 获取员工日总结
        getEmployeeStats () {
            queryEmployeeStats().then(res => {
                if (res.code === 20000) {
                    if (!res.data) {
                        this.$message({
                            showClose: true,
                            message: this.$t('notPrintData'),
                            type: 'error'
                        })
                        return
                    }
                    this.printDailyStats({
                        ...res.data,
                        type: 'employee'
                    })
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        },
        // 打印日总结
        printDailyStats (data) {
            let printData = {
                shopName: this.shopName,
                username: this.userName,
                number: this.userNumber,
                startedAt: moment(data.startedAt).format('DD/MM/YYYY HH:mm'),
                endedAt: moment(data.endedAt).format('DD/MM/YYYY HH:mm'),
                time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                subTotal: data.subTotal,
                paymodes: data.paymodes,
                refundOrderCount: data.refundOrderCount || 0,
                refundOrderAmount: data.refundOrderAmount || 0,
                type: data.type
            }
            queryPrinterList().then(res => {
                if (res.length !== 0) {
                    res.forEach((item) => {
                        if (item.isDefault) {
                            this.savePrinterName(item.name)
                        }
                    });
                    if (this.companyCountry === 'IT') {
                        let webview = document.querySelector('#printStatsIt')
                        webview.send('webview-print-render', printData)
                    } else if (this.companyCountry === 'ZH') {
                        let webview = document.querySelector('#printStatsZh')
                        webview.send('webview-print-render', printData)
                    } else if (this.companyCountry === 'EN') {
                        let webview = document.querySelector('#printStatsEn')
                        webview.send('webview-print-render', printData)
                    } else if (this.companyCountry === 'FR') {
                        let webview = document.querySelector('#printStatsFr')
                        webview.send('webview-print-render', printData)
                    } else if (this.companyCountry === 'DE') {
                        let webview = document.querySelector('#printStatsDe')
                        webview.send('webview-print-render', printData)
                    } else if (this.companyCountry === 'ES' || this.companyCountry === 'CA') {
                        let webview = document.querySelector('#printStatsEs')
                        webview.send('webview-print-render', printData)
                    } else {
                        let webview = document.querySelector('#printStatsEn')
                        webview.send('webview-print-render', printData)
                    }
                } else {
                    this.$message({
                        showClose: true,
                        message: this.$t('notPrinter'),
                        type: 'error'
                    })
                }
            })
        },
    
        // 退出登录
        logoutHandle () {
            queryEmployeeStats().then(res => {
                if (res.code === 20000) {
                    if (!res.data) {
                        // 退出
                        this.loginOutSkip()
                        return
                    }
                    this.$confirm(this.$t('logoutHint'), this.$t('hint'), {
                        confirmButtonText: this.$t('confirm'),
                        cancelButtonText: this.$t('cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.printDailyStats({
                            ...res.data,
                            type: 'employee'
                        })
                        setTimeout(() => {
                            this.loginOutSkip()
                        }, 1000)
                    }).catch(() => {})
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                    // 退出
                    this.loginOutSkip()
                }
            }).catch((err) => {
                this.$message.error(err);
                // 退出
                this.loginOutSkip()
            })
        },
        
        // 退出
        loginOutSkip() {
            accountLogout().then(res => {
                if (res.code === 20000) {
                    console.log('Logout')
                    // sessionStorage.removeItem('token')
                    // this.$router.replace({path: '/login'})
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                sessionStorage.removeItem('token')
                this.$router.replace({path: '/login'})
            })
        }
    },
    // 创建完成
    created() {
        if (this.routeName === 'Layout') {
            if (this.menuList.length > 0) {
                this.$router.replace({ name: this.menuList[0].name})
            } else {
                this.$router.replace({ name: 'notFound'})
            }
        }
    },
    // 挂载完成
    mounted() {
    
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.layout-aside-content{
    width: 100%;
    height: 100%;
    padding-bottom: 346px;
    position: relative;
    background-color: #385548;
    .layout-aside-menu{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .menu-list{
            padding-top: 56px;
            padding-left: 20px;
            .item{
                padding-right: 20px;
                border-radius: 58px 0px 0px 58px;
                .item-in{
                    width: 100%;
                    height: 116px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    .iconfont{
                        font-size: 48px;
                        color: #FFFFFF;
                    }
                    .text{
                        margin-top: 4px;
                        font-weight: 400;
                        font-size: 18px;
                        color: #FFFFFF;
                        text-align: center;
                        word-break: break-word;
                    }
                }
                &.active{
                    background-color: #F0EFEF;
                    .item-in{
                        .iconfont{
                            color: #2E3B2C;
                        }
                        .text{
                            color: #2E3B2C;
                        }
                    }
                }
            }
        }
    }
    .layout-aside-footer{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 346px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .handle{
            margin-top: 18px;
            padding-left: 8px;
            padding-right: 8px;
            .handle-item{
                margin-bottom: 6px;
                .clickable{
                    width: 100%;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-left: 6px;
                    padding-right: 6px;
                    border-radius: 5px;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 18px;
                    color: #385548;
                    background-color: #fff;
                    text-align: center;
                    word-break: break-all;
                }
                &:last-of-type{
                    margin-bottom: 0;
                }
            }
        }
        .quit{
            width: 100%;
            height: 76px;
            display: flex;
            justify-content: center;
            align-items: center;
            .clickable{
                height: 36px;
                padding-left: 6px;
                padding-right: 6px;
                display: flex;
                align-items: center;
                font-weight: 400;
                font-size: 20px;
                color: #FFFFFF;
                .iconfont{
                    font-size: 30px;
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>
