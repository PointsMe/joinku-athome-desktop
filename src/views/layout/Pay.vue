<template>
    <div class="container" :class="pageType === 'checkout' ? 'checkout-container' : 'product-container'">
        <div class="container-main">
            <div class="main-product">
                <div class="table" ref="tableContainer">
                    <el-table
                        :data="productList"
                        :max-height="tableHeight"
                        border
                        row-key="id"
                        :row-class-name="rowClassName"
                        @row-click="rowClick"
                        style="width: 100%">
                        <el-table-column
                            prop="barcode"
                            :label="$t('productBarcode')"
                            show-overflow-tooltip
                            align="center"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            :label="$t('productName')"
                            show-overflow-tooltip
                            align="center"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            prop="finalPrice"
                            :label="$t('sellPrice') + ' (€)'"
                            align="center"
                            min-width="120">
                            <template slot-scope="scope">
                                <div class="cell-price" v-if="scope.row.finalPrice !== scope.row.sellPrice">
                                    <del>{{ scope.row.sellPrice }}</del>
                                    <span class="price">{{ scope.row.finalPrice }}</span>
                                </div>
                                <span v-else>{{ scope.row.finalPrice }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="count"
                            :label="$t('number')"
                            align="center"
                            min-width="120">
                            <template slot-scope="scope">
                                <a
                                    href="javascript:void(0)"
                                    class="cell-count"
                                    :class="{checked: countChecked && itemId === scope.row.id}"
                                    @dblclick.stop="dblclickCount(scope.row)">
                                    {{ scope.row.count }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="finalAmount"
                            :label="$t('subtotal') + ' (€)'"
                            align="center"
                            min-width="120">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="product-remark">
                    <p class="remark" v-if="!!itemRemark">{{ $t('remark') }}:{{ itemRemark }}</p>
                </div>
                <div class="total bd-top">
                    <div class="total-item">
                        <span class="label" v-if="orderData">{{ $t('netValue') }}&nbsp;(€)</span>
                        <span class="value" v-if="orderData">{{ orderData.netAmount | filterUseFloat }}</span>
                    </div>
                    <div class="total-item">
                        <span class="label" v-if="orderData">IVA&nbsp;(€)</span>
                        <span class="value" v-if="orderData">{{ finalVatAmount | filterUseFloat }}</span>
                    </div>
                    <div class="total-item">
                        <span class="label" v-if="orderData">{{ $t('total') }}&nbsp;(€)</span>
                        <span class="value" v-if="orderData">{{ orderData.finalAmount | filterSaveFloat }}</span>
                    </div>
                </div>
                <div class="product-hint">
                    <p class="record" v-if="recordPayment.finalAmount > 0">
                        <span>{{ $t('prePayment') }}:&nbsp;</span>
                        <span>{{ $t('receivable') }}&nbsp;{{ recordPayment.finalAmount | filterUseFloat }}&nbsp;</span>
                        <span v-for="item in recordPayment.payments" :key="item.paymode">
                            <i v-if="item.paymode === 101">{{ $t('cash') }}</i>
                            <i v-else-if="item.paymode === 102">{{ $t('swipingCard') }}</i>
                            <i v-else-if="item.paymode === 106">BIZUM</i>
                            <i v-else-if="item.paymode === 103">{{ $t('mealVoucher') }}</i>
                            <i v-else-if="item.paymode === 105">{{ $t('voucher') }}</i>
                            <i v-else-if="item.paymode === 104">{{ $t('notPaid') }}</i>
                            &nbsp;{{ item.amount | filterUseFloat }}&nbsp;
                        </span>
                        <span>{{ $t('giveChange') }}&nbsp;{{ recordPayment.roundingAmount | filterUseFloat  }}</span>
                    </p>
                    <p class="record" v-else></p>
                    <span class="count">{{ $t('sum') }}{{ totalCount | filterUseFloat }}{{ $t('piece') }}</span>
                </div>
                
            </div>
            <div class="main-footer">
                <component
                    ref="footerRef"
                    :is="currentFooterComponent"
                    :itemId="itemId"
                    :itemPrice="itemPrice"
                    :orderData="orderData"
                    @add-product="addProduct"
                    @open-cashbox="openCashbox"
                    @session-update="getCurrentSession">
                </component>
            </div>
        </div>
        <div class="container-aside">
            <component
                ref="asideRef"
                :is="currentAsideComponent"
                :itemId="itemId"
                :itemCount="itemCount"
                :itemPrice="itemPrice"
                :itemRemark="itemRemark"
                :itemImage="itemImage"
                :totalCount="totalCount"
                :orderData="orderData"
                @open-cashbox="openCashbox"
                @session-update="getCurrentSession"
                @toggle-page="togglePage">
            </component>
        </div>
        <!-- 商品编辑 -->
        <ProductEdit
            :showDialog="editDialog"
            :itemId="itemId"
            @parent-update="updateProduct"
            @parent-close="editDialog = false" />
    </div>
</template>

<script>
// 旁边商品
import AsideProduct from "@/components/pay/AsideProduct";
// 旁边付款
import AsideCheckout from "@/components/pay/AsideCheckout";
// 底部商品
import FooterProduct from "@/components/pay/FooterProduct";
// 底部结账
import FooterCheckout from "@/components/pay/FooterCheckout";
// 商品编辑
import ProductEdit from "@/components/product/Edit"

import {queryCurrentSession, updateCartProduct} from "@/api";
import {countPropertyTotal} from "@/utils/common";
import {mapMutations, mapState} from "vuex";
import {epsonCashBox} from "@/utils/printer";
import {normalOpenCashbox} from "@/utils/ipc";

export default {
    name: "Pay",
    // 组件
    components: {
        AsideProduct,
        AsideCheckout,
        FooterProduct,
        FooterCheckout,
        ProductEdit
    },
    props: {},
    data() {
        return {
            tableHeight: 520,
            productList: [],
            pageType: 'product',   // 页面类型   product：商品    checkout：结账
            itemIndex: 0,
            itemId: '',
            itemCount: 1,
            itemPrice: 0,
            itemRemark: '',
            itemImage: '',
            countChecked: false,
            totalCount: 0,
            orderData: null,
            editDialog: false,
            ifCodeless: false,
            passable: true
        };
    },
    // 计算属性
    computed: {
        currentAsideComponent () {
            if (this.pageType === 'product') {
                return 'AsideProduct'
            } else if (this.pageType === 'checkout') {
                return 'AsideCheckout'
            } else {
                return 'AsideProduct'
            }
        },
        currentFooterComponent () {
            if (this.pageType === 'product') {
                return 'FooterProduct'
            } else if (this.pageType === 'checkout') {
                return 'FooterCheckout'
            } else {
                return 'FooterProduct'
            }
        },
        finalVatAmount () {
            if (this.orderData) {
                return this.orderData.finalAmount - this.orderData.netAmount
            } else {
                return 0
            }
        },
        ...mapState(['recordPayment']),
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        ...mapMutations(['saveLayoutAside']),
        // 获取表格高度
        getTableHeight() {
            if (this.$refs.tableContainer) {
                const tableHeight = this.$refs.tableContainer.offsetHeight
                this.$nextTick(() => {
                    this.tableHeight = tableHeight
                });
            }
        },
        // 获取当前会话
        getCurrentSession (b = false) {
            queryCurrentSession().then(res => {
                if (Number(res.code) === 20000) {
                    this.productList = res.data.items || []
                    if (this.productList.length > 0) {
                        const currentIndex = this.productList.findIndex(item => item.id === this.itemId)
                        if (currentIndex === -1) {
                            this.itemIndex = this.productList.length - 1
                            this.itemId = this.productList.slice(-1)[0].id
                            this.itemCount = this.productList.slice(-1)[0].count
                            this.itemPrice = this.productList.slice(-1)[0].finalPrice
                            this.itemRemark = this.productList.slice(-1)[0].remark || ''
                            this.itemImage = this.productList.slice(-1)[0].image
                            this.ifCodeless = this.productList.slice(-1)[0].codeless
                        } else {
                            this.itemIndex = currentIndex
                            this.itemCount = this.productList[currentIndex].count
                            this.itemPrice = this.productList[currentIndex].finalPrice
                            this.itemRemark = this.productList[currentIndex].remark || ''
                            this.itemImage = this.productList[currentIndex].image
                            this.ifCodeless = this.productList[currentIndex].codeless
                        }
                    } else {
                        this.itemIndex = 0
                        this.itemId = ''
                        this.itemCount = 1
                        this.itemPrice = 0
                        this.itemRemark = ''
                        this.itemImage = ''
                        this.ifCodeless = false
                    }
                    // 总计
                    this.orderData = res.data
                    // 总个数
                    this.totalCount = countPropertyTotal(this.productList, 'count')
                    // 初始化操作类型
                    if (this.pageType === 'product') {
                        this.$refs.asideRef.productHandleType = ''
                        // 扫码框得到焦点
                        this.$refs.footerRef.scanCodeFocus()
                    } else if (this.pageType === 'checkout' && !b) {
                        this.$nextTick(() => {
                            this.$refs.asideRef.initPayAmount()
                        })
                    }
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
        // 自定义行名称
        rowClassName ({row, rowIndex}) {
            if (row.id === this.itemId) {
                return 'active-row'
            } else {
                return ''
            }
        },
        // 点击行
        rowClick (row, column) {
            if (this.pageType !== 'product') return;
            // if (column.property === 'count') return;
            if (row.id === this.itemId) return;
            this.itemIndex = this.productList.indexOf(row);
            this.itemId = row.id
            this.itemCount = row.count
            this.itemPrice = row.finalPrice
            this.itemRemark = row.remark || ''
            this.itemImage = row.image
            this.ifCodeless = row.codeless
            // 初始化操作类型
            this.$refs.asideRef.productHandleType = ''
            // 扫码框得到焦点
            this.$refs.footerRef.scanCodeFocus()
        },
        // 双击行
        dblclickCount (row) {
            if (this.pageType !== 'product') return;
            // 改数量
            this.$refs.asideRef.productHandleType = 100
            this.$nextTick(() => {
                // 初始化输入框
                this.$refs.asideRef.callChildMethod()
            })
        },
        // 添加商品
        addProduct (id) {
            this.itemId = id
            // this.itemCount = 1
            // this.itemPrice = 0
            // this.itemRemark = ''
            // this.itemImage = ''
            // this.ifCodeless = false
            this.getCurrentSession()
        },
    
        // 切换页面类型
        togglePage (type) {
            this.pageType = type
            this.toogleLayoutAside()
        },
        
        // 切换布局侧边栏
        toogleLayoutAside () {
            if (this.pageType === 'checkout') {
                this.saveLayoutAside(false)
            } else {
                this.saveLayoutAside(true)
            }
        },
    
        // 更新购物车商品
        updateProduct () {
            let params = {
                productId: this.itemId,
                count: this.itemCount
            }
            updateCartProduct(params).then(res => {
                if (res.code === 20000) {
                    this.getCurrentSession()
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
    
        // 开钱箱
        openCashbox () {
            if (!this.passable) return;
            this.passable = false
            setTimeout(() => {
                this.passable = true
            }, 2000)
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
                this.$epsonPrinter.openBox(taxPrinterIp);
            } else if (taxPrinterType === 'epson') {
                epsonCashBox()
            } else {
                const printerUrl = localStorage.getItem("normalPrinterIp")
                if (!printerUrl) {
                    this.$message({
                        showClose: true,
                        message: this.$t('noSetPrinter'),
                        type: 'warning'
                    });
                    return;
                }
                const printerArr = printerUrl.split(':')
                if (printerArr.length === 2) {
                    normalOpenCashbox({
                        ip: printerArr[0],
                        port: printerArr[1]
                    })
                } else {
                    normalOpenCashbox({
                        ip: printerArr[0],
                        port: ''
                    })
                }
            }
        },
    
        // 监听按键
        handleKeydown(event) {
            if (event.key === 'Tab') {
                event.preventDefault();
                if (this.pageType === 'product') {
                    if (event.target.id === 'temporary_price') return;
                    this.$refs.footerRef.scanCodeFocus()
                }
            } else if (!event.ctrlKey && event.key === 'F3') {  // 开钱箱
                this.openCashbox()
            } else if (!event.ctrlKey && event.key === 'ArrowUp') {
                event.preventDefault();
                if (this.pageType === 'product') {
                    this.toogleCheckedProduct('up')
                }
            } else if (!event.ctrlKey && event.key === 'ArrowDown') {
                event.preventDefault();
                if (this.pageType === 'product') {
                    this.toogleCheckedProduct('down')
                }
            } else if (event.ctrlKey && event.key === 'ArrowUp') {
                event.preventDefault();
                this.$refs.footerRef.toogleCheckedRow('up')
                if (this.pageType === 'product') {
                    this.$refs.asideRef.toogleCheckedRow('up')
                }
            } else if (event.ctrlKey && event.key === 'ArrowDown') {
                event.preventDefault();
                this.$refs.footerRef.toogleCheckedRow('down')
                if (this.pageType === 'product') {
                    this.$refs.asideRef.toogleCheckedRow('down')
                }
            } else if (event.ctrlKey && event.key === 'g') {
                if (this.pageType === 'product') {
                    if (this.totalCount > 0) {
                        this.$refs.asideRef.pendingHandle()
                    } else {
                        if (this.$refs.asideRef.pendingCount === 0) {
                            this.$message({
                                showClose: true,
                                message: this.$t('noRetOrder'),
                                type: 'warning'
                            })
                            return;
                        }
                        this.$refs.asideRef.pendingDialog = true
                    }
                }
            } else if (event.ctrlKey && event.key === 'F4') {
                if (this.pageType === 'product') {
                    this.$refs.asideRef.cancelOrder()
                }
            } else if (event.ctrlKey && event.key === '-') {
                if (this.pageType === 'product') {
                    if (!this.itemId) {
                        this.$message({
                            showClose: true,
                            message: this.$t('noDelProduct'),
                            type: 'warning'
                        })
                        return;
                    }
                    this.$refs.asideRef.productDelete()
                }
            } else if (!event.ctrlKey && event.key === 'PageDown') {
                if (this.pageType === 'product') {
                    if (this.totalCount === 0) {
                        this.$message({
                            showClose: true,
                            message: this.$t('cartProNull'),
                            type: 'warning'
                        })
                        return;
                    }
                    this.togglePage('checkout')
                } else {
                    this.togglePage('product')
                }
            } else if (!event.ctrlKey && !event.altKey && event.key === 'End') {
                this.$refs.footerRef.cellShowMember()
            } else if (!event.ctrlKey && event.altKey && event.key === 'End') {
                this.$refs.footerRef.cellClearMember()
            } else if (!event.ctrlKey && event.key === 'Insert') {
                this.$refs.footerRef.dialogRowConfirm()
                if (this.pageType === 'product') {
                    this.$refs.asideRef.dialogRowConfirm()
                }
            } else if (event.altKey && event.key === 'r') {
                if (this.pageType === 'product') {
                    this.$refs.footerRef.temporaryDialog = true
                }
            } else if (event.ctrlKey && event.key === 'F7') {
                if (this.pageType === 'product') {
                    if (!this.itemId || this.ifCodeless) {
                        this.$message({
                            showClose: true,
                            message: this.$t('notOperProduct'),
                            type: 'warning'
                        })
                        return;
                    }
                    this.editDialog = true
                }
            } else if (!event.ctrlKey && event.key === 'Delete') {
                if (this.pageType === 'product') {
                    this.$refs.footerRef.productDialog = true
                }
            } else if (!event.ctrlKey && event.altKey && event.key === '-') {
                if (this.pageType === 'product') {
                    this.$refs.asideRef.dialogRowDelete()
                }
            } else if (!event.ctrlKey && event.altKey && event.key === 'm') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.cellRounding()
                }
            } else if (!event.ctrlKey && event.altKey && event.key === 'y') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.cellCheckOrder(100)
                }
            } else if (!event.ctrlKey && event.altKey && event.key === 'f') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.cellCheckOrder(102)
                }
            } else if (event.ctrlKey && event.key === '/') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.cellDiscount()
                }
            } else if (event.key === 'Enter') {
                event.preventDefault();
            } else if (!event.ctrlKey && event.key === 'F9') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.tooglePaymentFocus('cash')
                }
            } else if (!event.ctrlKey && event.key === 'F10') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.tooglePaymentFocus('card')
                }
            } else if (!event.ctrlKey && event.key === 'F11') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.tooglePaymentFocus('bizum')
                }
            } else if (!event.ctrlKey && event.key === 'F12') {
                if (this.pageType === 'checkout') {
                    this.$refs.asideRef.tooglePaymentFocus('voucher')
                }
            }
        },
        
        // 调整选中商品
        toogleCheckedProduct (direction) {
            if (direction === 'up') {
                if (this.itemIndex === 0) return;
                this.itemIndex--
            } else if (direction === 'down') {
                if (this.itemIndex >= this.productList.length - 1) return;
                this.itemIndex++
            }
            const row = this.productList[this.itemIndex]
            this.itemId = row.id
            this.itemCount = row.count
            this.itemPrice = row.finalPrice
            this.itemRemark = row.remark || ''
            this.itemImage = row.image
            this.ifCodeless = row.codeless
            // 初始化操作类型
            this.$refs.asideRef.productHandleType = ''
            // 扫码框得到焦点
            this.$refs.footerRef.scanCodeFocus()
        },
    },
    // 创建完成
    created() {
        this.toogleLayoutAside()
    },
    // 挂载完成
    mounted() {
        // 获取当前会话
        this.getCurrentSession()
        // 获取表格高度
        this.getTableHeight()
        // 监听键盘事件
        window.addEventListener("keydown", this.handleKeydown);
    },
    // 销毁之前
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeydown);
    }
};
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .container-main{
        height: 100%;
        .main-product{
            height: calc(100% - 190px);
            background-color: #fff;
            position: relative;
            .table{
                height: calc(100% - 110px);
                ::v-deep .el-table{
                    .el-table__header{
                        .el-table__cell{
                            min-height: 50px;
                        }
                        .cell{
                            font-weight: 500;
                            font-size: 18px;
                            color: #2E3B2C;
                        }
                    }
                    .el-table__body{
                        .el-table__cell{
                            min-height: 50px;
                            background-color: transparent;
                        }
                        .cell{
                            font-weight: 400;
                            font-size: 16px;
                            color: #000000;
                        }
                    }
                    .cell-price{
                        del{
                            font-size: 13px;
                            color: #000000;
                            margin-right: 10px;
                        }
                        .price{
                            font-size: 16px;
                            color: #FF0000;
                        }
                    }
                    .cell-count{
                        padding-left: 12px;
                        padding-right: 12px;
                        font-size: 16px;
                        color: #000000;
                        line-height: 25px;
                        &.checked{
                            border: 1px solid #FF0000;
                        }
                    }
                }
            }
            .product-remark{
                height: 50px;
                .remark{
                    padding-left: 20px;
                    padding-right: 20px;
                    line-height: 48px;
                    border: 1px solid #EFEFEF;
                    font-weight: 400;
                    font-size: 20px;
                    color: #000000;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .total{
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .total-item{
                    margin-right: 80px;
                    .label{
                        font-weight: 500;
                        font-size: 18px;
                        color: #2E3B2C;
                    }
                    .value{
                        margin-left: 6px;
                        font-weight: 600;
                        font-size: 30px;
                        color: #000000;
                    }
                }
            }
            .product-hint{
                position: absolute;
                left: 0;
                bottom: -28px;
                width: 100%;
                height: 28px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                overflow: hidden;
                .record{
                    flex-grow: 1;
                    padding-right: 30px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    span{
                        font-weight: 400;
                        font-size: 16px;
                        color: #000000;
                        line-height: 28px;
                    }
                }
                .count{
                    flex-shrink: 0;
                    font-weight: 400;
                    font-size: 20px;
                    color: #000000;
                    line-height: 28px;
                    text-align: right;
                }
            }
        }
        .main-footer{
            width: 100%;
            height: 190px;
            padding-top: 28px;
        }
    }
    .container-aside{
        height: 100%;
    }
    &.product-container{
        .container-main{
            width: calc(100% - 640px);
        }
        .container-aside{
            width: 620px;
        }
    }
    &.checkout-container{
        .container-main{
            width: calc(100% - 810px);
        }
        .container-aside{
            width: 780px;
        }
    }
}
</style>
