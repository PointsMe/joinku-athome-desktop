<template>
    <div class="aside-content">
        <div class="product-handle">
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-button class="number-btn" @click="handleItemProduct(101)">
                        {{ $t('number') }}&nbsp;X
                    </el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="number-btn" @click="handleItemProduct(102)">
                        {{ $t('number') }}&nbsp;+1
                    </el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="number-btn" @click="handleItemProduct(103)">
                        {{ $t('number') }}&nbsp;-1
                    </el-button>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-button class="price-btn" @click="handleItemProduct(104)">
                        {{ $t('editPrice') }}&nbsp;<i class="iconfont icon-edit"></i>
                    </el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="price-btn" @click="handleItemProduct(105)">{{ $t('discount') }}&nbsp;%</el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="repeal-btn" @click="handleItemProduct(106)">{{ $t('repealDiscount') }}</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-button class="remark-btn" @click="handleItemProduct(107)">
                        {{ $t('remark') }}&nbsp;<i class="iconfont icon-remark"></i>
                    </el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="delete-btn" @click="handleItemProduct(108)">
                        {{ $t('delete') }}&nbsp;<i class="iconfont icon-delete"></i>
                    </el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="repeal-btn" @click="sessionRefund()" v-if="totalCount > 0">
                        {{ $t('refund') }}&nbsp;<i class="iconfont icon-return"></i>
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="product-area">
            <component
                ref="productArea"
                :is="currentTabComponent"
                :productHandleType="productHandleType"
                :itemId="itemId"
                :itemRemark="itemRemark"
                :itemImage="itemImage"
                @property-update="propertyUpdate"
                @remark-update="remarkUpdate">
            </component>
        </div>
        <div class="order-handle">
            <el-row :gutter="12">
                <el-col :span="12" class="column-col">
                    <el-button
                        class="pending-btn"
                        @click="pendingHandle"
                        v-if="totalCount > 0">
                        {{ $t('pendingOrder') }}
                    </el-button>
                    <el-button
                        class="pending-btn"
                        :disabled="pendingCount === 0"
                        @click="pendingDialog = true"
                        v-else>{{ $t('getOrder') }}({{ pendingCount }})</el-button>
                    <el-button
                        class="cancel-btn"
                        @click="cancelOrder">{{ $t('cancelOrder') }}</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button class="check-btn" :disabled="totalCount === 0" @click="checkOutHandle">{{ $t('checkOut') }}</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 挂单列表 -->
        <PendingOrder
            :showDialog="pendingDialog"
            ref="pendingRef"
            @recover-pending="pendingUpdate"
            @cancel-pending="getPendingCount"
            @parent-close="pendingDialog = false"/>
    </div>
</template>

<script>
// 商品属性操作
import ProductProperty from "./ProductProperty";
// 商品备注
import ProductRemark from "./ProductRemark";
// 商品图片预览
import ProductPreview from "./ProductPreview";
// 挂单列表
import PendingOrder from "@/components/pay/PendingOrder";
import {
    cancelCartProductDiscount,
    deleteCartProduct,
    refundCartProduct,
    unrefundCartProduct,
    updateCartProductCount,
    updateCartProductPrice,
    updateCartProductRemark,
    queryPendingOrderCount,
    pendingOrder,
    cancelSessionOrder, createSessionRefund
} from "@/api";
import {formatFloatRound} from "@/utils/common";
import JsBarcode from "jsbarcode";
import {queryPrinterList} from "@/utils/ipc";
import moment from "moment";
import {mapMutations, mapState} from "vuex";

export default {
    name: "AsideProduct",
    // 组件
    components: {
        ProductProperty,
        ProductRemark,
        ProductPreview,
        PendingOrder
    },
    props: {
        itemId: {
            type: String,
            default: ''
        },
        itemCount: {
            type: Number,
            default: 1
        },
        itemPrice: {
            type: Number,
            default: 0
        },
        itemRemark: {
            type: String,
            default: ''
        },
        itemImage: {
            type: String,
            default: ''
        },
        totalCount: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            productHandleType: '',  // 100 改数量  101 数量X  102 数量+1  103 数量-1  104 改价   105 打折  106 撤销优惠   107 备注  108 删除   109 退货
            pendingCount: 0,
            pendingDialog: false
        };
    },
    // 计算属性
    computed: {
        ...mapState(['shopInfo']),
        currentTabComponent () {
            if (this.productHandleType === 100 || this.productHandleType === 101 || this.productHandleType === 104 || this.productHandleType === 105) {
                return 'ProductProperty'
            } else if (this.productHandleType === 107) {
                return 'ProductRemark'
            } else {
                return 'ProductPreview'
            }
        }
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        ...mapMutations(['savePrinterName']),
        // 操作
        handleItemProduct (type) {
            if (!this.itemId) {
                this.$message({
                    showClose: true,
                    message: this.$t('notOperProduct'),
                    type: 'warning'
                })
                return
            }
            if (type === 102) {
                if (this.itemCount > 0) {
                    this.changeCount(this.itemCount + 1)
                } else {
                    this.changeCount(this.itemCount - 1)
                }
            } else if (type === 103) {
                if (Math.abs(this.itemCount) <= 1) {
                    this.$message({
                        showClose: true,
                        message: this.$t('numGtZero'),
                        type: 'warning'
                    })
                    return
                }
                if (this.itemCount > 0) {
                    this.changeCount(this.itemCount - 1)
                } else {
                    this.changeCount(this.itemCount + 1)
                }
            } else if (type === 106) {
                this.$confirm(this.$t('repDisHint'), this.$t('hint'), {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.productHandleType = type
                    this.cancelDiscount()
                }).catch(() => {})
                return;
            } else if (type === 108) {
                this.productDelete()
            }
            this.productHandleType = type
        },
        // 属性更新
        propertyUpdate (val) {
            // 100 改数量   101 数量X  104 改价   105 打折
            switch (this.productHandleType) {
                case 100:
                    this.changeCount(val)
                    break;
                case 101:
                    this.changeCount(this.itemCount * val)
                    break;
                case 104:
                    this.changePrice(formatFloatRound(val, 4))
                    break;
                case 105:
                    this.changePrice(formatFloatRound(this.itemPrice * (1 - val / 100), 4))
                    break;
            }
        },
        // 更改数量
        changeCount (count) {
            let params = {
                itemId: this.itemId,
                count
            }
            updateCartProductCount(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 更改价格
        changePrice (price) {
            let params = {
                itemId: this.itemId,
                price
            }
            updateCartProductPrice(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 取消折扣
        cancelDiscount () {
            let params = {
                itemId: this.itemId,
            }
            cancelCartProductDiscount(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
     
        // 商品删除
        productDelete () {
            let params = {
                itemId: this.itemId,
            }
            deleteCartProduct(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 备注更新
        remarkUpdate (val) {
            let params = {
                itemId: this.itemId,
                remark: val
            }
            updateCartProductRemark(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        
        // 获取挂单数量
        getPendingCount () {
            queryPendingOrderCount().then(res => {
                if (Number(res.code) === 20000) {
                    this.pendingCount = res.data.count
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 挂单
        pendingHandle () {
            pendingOrder().then(res => {
                if (Number(res.code) === 20000) {
                    this.pendingUpdate()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 恢复订单
        pendingUpdate () {
            // 更新挂单数量
            this.getPendingCount()
            // 更新会话
            this.$emit('session-update')
        },
        
        // 取消订单
        cancelOrder () {
            this.$confirm(this.$t('cancelOrderHint'), this.$t('hint'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                cancelSessionOrder().then(res => {
                    if (Number(res.code) === 20000) {
                        // 更新会话
                        this.$emit('session-update')
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        })
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            }).catch(() => {})
        },
    
        // 退货
        sessionRefund () {
            if (this.totalCount === 0) return;
            createSessionRefund().then(res => {
                if (Number(res.code) === 20000) {
                    // 更新会话
                    this.$emit('session-update')
                    if (!res.data) return;
                    // 生成条形码
                    const expires = res.data.expires ? moment(res.data.expires).format('DD/MM/YYYY HH:mm') : ''
                    this.createBarcode(res.data.id, res.data.amount, expires)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        
        // 生成条形码
        createBarcode (code, price, expires) {
            if (!code) return ''
            let barcodeOptions = {
                format: "CODE128",//条形码的格式
                width: 1.5,//线宽
                height: 60,//条码高度
                displayValue: true,//是否显示文字
                fontSize: 20,//设置文本的大小
                fontOptions: "bold",
                textMargin: 2,
                lineColor: "#000000", // 线条和字体颜色
                margin: 5 //设置条形码周围的空白区域
            }
            const canvas = document.createElement("canvas");
            JsBarcode(canvas, code, barcodeOptions);
            const url = canvas.toDataURL("image/png");
            this.printBarcode(url, price, expires)
        },
        // 打印条形码
        printBarcode (url, price, expires) {
            queryPrinterList().then(res => {
                if (res.length !== 0) {
                    const defaultPrinter = res.find(item => item.isDefault)
                    if (defaultPrinter !== undefined) {
                        this.savePrinterName(defaultPrinter.name)
                    }
                    let printData = {
                        name: this.shopInfo.name,
                        company: this.shopInfo.companyName || '',
                        address: this.shopInfo.address,
                        pcg: `${this.shopInfo.zipcode} ${this.shopInfo.city} ${this.shopInfo.provinceName}`,
                        country: this.shopInfo.countryName,
                        vatNumber: this.shopInfo.vatNumber,
                        taxCode: this.shopInfo.taxCode,
                        contactPhone: this.shopInfo.contactPhone,
                        price,
                        img: url,
                        time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                        expires
                    }
                    if (this.shopInfo.countryCode === 'IT') {
                        let webview = document.querySelector('#printBarcodeIt')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ZH') {
                        let webview = document.querySelector('#printBarcodeZh')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'EN') {
                        let webview = document.querySelector('#printBarcodeEn')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'FR') {
                        let webview = document.querySelector('#printBarcodeFr')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'DE') {
                        let webview = document.querySelector('#printBarcodeDe')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ES' || this.shopInfo.countryCode === 'CA') {
                        let webview = document.querySelector('#printBarcodeEs');
                        webview.send('webview-print-render', printData); //将数据发送至webview
                    } else {
                        let webview = document.querySelector('#printBarcodeEn')
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
        
        // 结账
        checkOutHandle () {
            this.$emit('toggle-page', 'checkout')
        },
        // 初始化子组件
        callChildMethod () {
            if (this.productHandleType === 100 || this.productHandleType === 101 || this.productHandleType === 104 || this.productHandleType === 105) {
                this.$refs.productArea.initValue()
            }
        },
    
        // 切换弹框选中行
        toogleCheckedRow (direction) {
            if (this.pendingDialog) {
                this.$refs.pendingRef.toogleRow(direction)
            }
        },
        // 弹框选中项确定
        dialogRowConfirm () {
            if (this.pendingDialog) {
                this.$refs.pendingRef.sendRecover()
            }
        },
        // 弹框选中项删除
        dialogRowDelete () {
            if (this.pendingDialog) {
                this.$refs.pendingRef.sendCancel()
            }
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        this.getPendingCount()
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.aside-content{
    width: 100%;
    height: 100%;
    .product-handle{
        .el-row{
            margin-bottom: 15px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
        ::v-deep .el-button{
            width: 100%;
            height: 106px;
            padding: 0 6px;
            border-radius: 5px;
            font-weight: 500;
            font-size: 30px;
            color: #FFFFFF;
            box-shadow: inset 0px 3px 6px 1px rgba(0,0,0,0.16);
            white-space: normal !important;
            word-break: break-word;
            .iconfont{
                font-size: 30px;
            }
        }
        .number-btn{
            background: #77B783;
        }
        .price-btn{
            background: #156043;
        }
        .repeal-btn{
            background: #013738;
        }
        .remark-btn{
            background: #5D5D5D;
        }
        .refund-btn{
            background: #000000;
        }
        .delete-btn{
            background: #B23303;
        }
    }
    .product-area{
        height: calc(100% - 543px);
        padding-top: 25px;
        padding-bottom: 25px;
        .card{
        
        }
    }
    .order-handle{
        height: 195px;
        ::v-deep .el-button{
            width: 100%;
            box-shadow: inset 0px 3px 6px 1px rgba(0,0,0,0.16);
            border-radius: 5px 5px 5px 5px;
            margin-left: 0;
            margin-right: 0;
            white-space: normal !important;
            word-break: break-word;
        }
        .column-col{
            height: 195px;
            display: flex;
            flex-direction: column;
            justify-content: space-between
        }
        .pending-btn{
            height: 90px;
            background: #959595;
            font-weight: 400;
            font-size: 30px;
            color: #FFFFFF;
        }
        .cancel-btn{
            height: 90px;
            background: #000000;
            font-weight: 400;
            font-size: 30px;
            color: #FFFFFF;
        }
        .check-btn{
            height: 195px;
            background: #E09200;
            font-weight: 500;
            font-size: 39px;
            color: #FFFFFF;
        }
    }
}
</style>
