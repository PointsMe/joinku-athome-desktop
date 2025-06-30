<template>
    <div class="container">
        <div class="container-main">
            <div class="card">
                <h3 class="card-title">{{ $t('printer') }}</h3>
                <div class="list">
                    <div class="item" @click="taxPrinterDialog = true">
                        <div class="icon">
                            <i class="iconfont icon-printer"></i>
                        </div>
                        <span class="text">{{ $t('taxPrinter') }}</span>
                    </div>
                    <div class="item" @click="norPrinterDialog = true">
                        <div class="icon">
                            <i class="iconfont icon-printer"></i>
                        </div>
                        <span class="text">{{ $t('normalPrinter') }}</span>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3 class="card-title">{{ $t('set') }}</h3>
                <div class="list">
                    <div class="item" @click="passwordHandle">
                        <div class="icon">
                            <i class="iconfont icon-password"></i>
                        </div>
                        <span class="text">{{ $t('passwordEdit') }}</span>
                    </div>
                    <div class="item" @click="usernameDialog = true">
                        <div class="icon">
                            <i class="iconfont icon-user"></i>
                        </div>
                        <span class="text">{{ $t('userNameEdit') }}</span>
                    </div>
                    <div class="item" @click="mposDialog = true" v-if="enabledDojo">
                        <div class="icon">
                            <i class="iconfont icon-pos"></i>
                        </div>
                        <span class="text">{{ $t('mpos') }}</span>
                    </div>
                    <div class="item" @click="displayDialog = true">
                        <div class="icon">
                            <i class="iconfont icon-cashier"></i>
                        </div>
                        <span class="text">{{ $t('customerDisplay') }}</span>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3 class="card-title">{{ $t('barcode') }}</h3>
                <div class="list">
                    <div class="item" @click="barcodeDialog = true">
                        <div class="icon">
                            <i class="iconfont icon-barcode"></i>
                        </div>
                        <span class="text">{{ $t('printBarcode') }}</span>
                    </div>
                    <!--<div class="item">-->
                    <!--    <div class="icon">-->
                    <!--        <i class="iconfont icon-list"></i>-->
                    <!--    </div>-->
                    <!--    <span class="text">{{ $t('printList') }}</span>-->
                    <!--</div>-->
                </div>
            </div>
            <div class="card">
                <h3 class="card-title">{{ $t('platform') }}</h3>
                <div class="btns">
                    <div class="item">
                        <el-button type="primary" @click="syncPlatformHandle">{{ $t('syncAll') }}</el-button>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3 class="card-title">Bo Hao</h3>
                <div class="btns">
                    <div class="item">
                        <el-button type="primary" @click="syncConnectHandle">{{ $t('connect') }}</el-button>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="syncProductHandle">{{ $t('productSync') }}</el-button>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="syncMemberHandle">{{ $t('memberSync') }}</el-button>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="syncOrderHandle">{{ $t('orderSync') }}</el-button>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="syncSupplierHandle">{{ $t('supplierSync') }}</el-button>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="syncTotalHandle">{{ $t('syncAll') }}</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 税务打印机 -->
        <TaxPrinter
            :showDialog="taxPrinterDialog"
            @parent-close="taxPrinterDialog = false"/>
        <!-- 普通打印机 -->
        <NormalPrinter
            :showDialog="norPrinterDialog"
            @parent-close="norPrinterDialog = false"/>
        <!-- 用户名 -->
        <Username
            :showDialog="usernameDialog"
            @parent-close="usernameDialog = false"/>
        <!-- 打印条码 -->
        <PrintBarcode
            :showDialog="barcodeDialog"
            @parent-close="barcodeDialog = false" />
        <!-- pos机 -->
        <Mpos
            :showDialog="mposDialog"
            @parent-close="mposDialog = false"/>
        <!-- 客显 -->
        <CustomerDisplay
            :showDialog="displayDialog"
            @parent-close="displayDialog = false"/>
        <!-- 进度条 -->
        <SyncProgress
            :showDialog="progressDialog"/>
    </div>
</template>

<script>
// 税务打印机
import TaxPrinter from "@/components/more/TaxPrinter";
// 普通打印机
import NormalPrinter from "@/components/more/NormalPrinter";
// 用户名
import Username from "@/components/more/Username";
// 打印条码
import PrintBarcode from "@/components/more/PrintBarcode";
// pos机
import Mpos from "@/components/more/Mpos";
// 客显
import CustomerDisplay from "@/components/more/CustomerDisplay";
// 同步进度条
import SyncProgress from "@/components/SyncProgress";
import {
    syncBohaoMember,
    syncBohaoOrder,
    syncBohaoProduct,
    syncBohaoRunScript,
    syncBohaoSupplier,
    syncBohaoTotal,
    syncPlatformData
} from "@/api";
import {mapState} from "vuex";
export default {
    name: "More",
    // 组件
    components: {
        TaxPrinter,
        NormalPrinter,
        Username,
        PrintBarcode,
        Mpos,
        CustomerDisplay,
        SyncProgress
    },
    props: {
    
    },
    data() {
        return {
            taxPrinterDialog: false,
            norPrinterDialog: false,
            usernameDialog: false,
            barcodeDialog: false,
            progressDialog: false,
            mposDialog: false,
            displayDialog: false,
        };
    },
    // 计算属性
    computed: {
        ...mapState({
            enabledDojo: state => state.dojoConfig.enabled   // 启用Dojo
        }),
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 修改密码
        passwordHandle () {
            this.$parent.showPassword()
        },
        // 平台数据同步
        syncPlatformHandle () {
            this.sendSyncPlatform()
            this.progressDialog = true
        },
        sendSyncPlatform () {
            syncPlatformData({}).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                this.progressDialog = false
            })
        },
    
        // 博浩连接
        syncConnectHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('dataConnect'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoRunScript().then(res => {
                if (res.code === 20000) {
                    if (res.data.execute) {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
        // 博浩商品同步
        syncProductHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('syncData'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoProduct().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
        // 博浩会员同步
        syncMemberHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('syncData'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoMember().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
        // 博浩订单同步
        syncOrderHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('syncData'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoOrder().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
        // 博浩供应商同步
        syncSupplierHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('syncData'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoSupplier().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
        // 博浩同步所有
        syncTotalHandle () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('syncData'),
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            syncBohaoTotal().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                loading.close();
            })
        },
    },
    // 创建完成
    created() {
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
.container{
    width: 100%;
    height: 100%;
    .container-main{
        padding-left: 20px;
        padding-right: 20px;
        .card{
            width: 100%;
            height: 116px;
            padding-left: 30px;
            padding-right: 30px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #FFFFFF;
            //&:last-of-type{
            //    border-bottom: none;
            //}
            .card-title{
                width: 140px;
                font-weight: 400;
                font-size: 20px;
                color: #000000;
                word-break: break-word;
            }
            .list{
                height: 100%;
                display: flex;
                align-items: center;
                .item{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    margin-right: 40px;
                    .icon{
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #78B5E1;
                        border-radius: 50%;
                        .iconfont{
                            font-size: 32px;
                            color: #FFFFFF;
                        }
                    }
                    .text{
                        margin-top: 5px;
                        font-weight: 400;
                        font-size: 13px;
                        color: #3E3E3E;
                    }
                }
            }
            .btns{
                height: 100%;
                display: flex;
                align-items: center;
                .item{
                    margin-right: 40px;
                    &:last-of-type{
                        margin-right: 0;
                    }
                }
            }
        }
    }
}
</style>
