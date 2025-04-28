<template>
    <el-dialog
        :title="$t('orderDetail')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="huge-dialog"
        top="5vh">
        <div class="content">
            <div class="product" style="height: 520px">
                <el-table
                    :data="productList"
                    ref="multipleTable"
                    border
                    row-key="id"
                    @selection-change="handleSelectionChange"
                    style="width: 100%"
                    max-height="520">
                    <el-table-column
                        type="selection"
                        align="center"
                        :selectable="rowSelectable"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="160"
                        :label="$t('nameCode')">
                        <template slot-scope="scope">
                            <div class="cell-desc">
                                <p class="desc-title">{{scope.row.name}}</p>
                                <p class="desc-text">{{scope.row.code}}</p>
                                <p class="desc-text">{{scope.row.barcode}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="finalCount"
                        align="center"
                        min-width="100"
                        :label="$t('totalNum')">
                    </el-table-column>
                    <el-table-column
                        prop="settlePrice"
                        min-width="120"
                        align="center"
                        :label="$t('price')">
                        <template slot-scope="scope">
                            <div class="cell-price" v-if="scope.row.settlePrice !== scope.row.originalPrice">
                                <del>{{ scope.row.originalPrice }}&nbsp;€</del>
                                <span class="price">{{ scope.row.settlePrice }}&nbsp;€</span>
                            </div>
                            <span v-else>{{ scope.row.settlePrice }}&nbsp;€</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="settleAmount"
                        align="center"
                        min-width="100"
                        :label="$t('paidAmount')">
                        <template slot-scope="scope">
                            <span>{{ scope.row.settleAmount }}&nbsp;€</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="count"
                        align="center"
                        min-width="100"
                        :label="$t('refundNum')">
                        <template slot-scope="scope">
                            <div :class="{ 'input-error': !checkCount(scope.row) }">
                                <el-input
                                    v-model="scope.row.count"
                                    :disabled="scope.row.disabled">
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        align="center"
                        min-width="100"
                        :label="$t('refundAmount')">
                        <template slot-scope="scope">
                            <div :class="{ 'input-error': !checkAmount(scope.row) }">
                                <el-input
                                    v-model="scope.row.amount"
                                    :disabled="scope.row.disabled">
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="bill">
                <div class="card">
                    <div class="desc">
                        <el-row :gutter="20">
                            <el-col :span="15">
                                <p class="desc-item">
                                    <span class="label">{{ $t('orderNo') }}&nbsp;</span>
                                    <span class="value">{{ number }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('orderTime') }}&nbsp;</span>
                                    <span class="value">{{ createdAt | filterTime }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('member') }}&nbsp;</span>
                                    <span class="value" v-if="member">{{ member.username }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('operator') }}&nbsp;</span>
                                    <span class="value">{{ operatorName }}</span>
                                </p>
                            </el-col>
                            <el-col :span="9">
                                <p class="desc-item">
                                    <span class="label">{{ $t('productAmount') }}&nbsp;(€)&nbsp;</span>
                                    <span class="value">{{ itemTotalAmount }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('productDiscount') }}&nbsp;(€)&nbsp;</span>
                                    <span class="value">{{ itemDiscountAmount }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('orderDiscount') }}&nbsp;(€)&nbsp;</span>
                                    <span class="value">{{ orderDiscountAmount }}</span>
                                </p>
                                <p class="desc-item">
                                    <span class="label">{{ $t('cope') }}&nbsp;(€)&nbsp;</span>
                                    <span class="value">{{ finalAmount }}</span>
                                </p>
                            </el-col>
                        </el-row>
                        <p class="desc-item">
                            <span class="label">{{ $t('remark') }}&nbsp;</span>
                            <span class="value">{{ remark }}</span>
                        </p>
                    </div>
                    <div class="pay">
                        <p class="pay-item" v-for="item in payments" :key="item.paymode">
                            <span class="label" v-if="item.paymode === 101">{{ $t('cash') }}</span>
                            <span class="label" v-else-if="item.paymode === 102">{{ $t('swipingCard') }}</span>
                            <span class="label" v-else-if="item.paymode === 106">BIZUM</span>
                            <span class="label" v-else-if="item.paymode === 103">{{ $t('mealVoucher') }}</span>
                            <span class="label" v-else-if="item.paymode === 104">{{ $t('notPaid') }}</span>
                            <span class="label" v-else-if="item.paymode === 105">{{ $t('voucher') }}</span>
                            <span class="value">{{ item.amount }}</span>
                        </p>
                        <p class="pay-item pay-total">
                            <span class="label">{{ $t('paidUp') }}</span>
                            <span class="value">{{ paidAmount }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-handle">
            <div class="handle-left">
                <el-button
                    type="primary"
                    :disabled="multipleSelection.length === 0 || refundDisabled"
                    @click="refundHandle"
                    v-if="perms.includes('ord.refund.create')">
                    {{$t('refundMoney')}}
                </el-button>
                <el-button
                    type="primary"
                    @click="invoiceHandle"
                    v-if="receipt === 100 || receipt === 101">
                    {{$t('invoice')}}
                </el-button>
                <el-button
                    type="primary"
                    :disabled="taxDisabled"
                    @click="taxHandle"
                    v-if="receipt === 100">
                    {{$t('taxReceipt')}}
                </el-button>
            </div>
            <div class="handle-right">
                <el-button
                    type="info"
                    @click="printBillHandle()">
                    {{$t('printBill')}}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>

import {createRefundOrder, queryOrderDetail, updateOrderReceipt} from "@/api";
import {validateFloat, validateInteger} from "@/utils/validate";
import {formatFloat} from "@/utils/common";
import moment from "moment";
import {queryPrinterList} from "@/utils/ipc";
import {mapMutations, mapState} from "vuex";
import {epsonTaxPrint} from "@/utils/printer";
import JsBarcode from 'jsbarcode'

export default {
    name: "Detail",
    // 组件
    components: {
    
    },
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        itemId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            receipt: 100,
            receiptNumber: '',
            productList: [],
            number: '',
            createdAt: '',
            member: null,
            operatorName: '',
            itemTotalAmount: 0,
            itemDiscountAmount: 0,
            finalAmount: 0,
            orderDiscountAmount: 0,
            totalDiscountAmount: 0,
            remark: '',
            payments: [],
            paidAmount: 0,
            multipleSelection: [],
            enablePreprint: false,
            enableAliasPrint: false,
            refundDisabled: false,
            taxDisabled: false,
        };
    },
    // 计算属性
    computed: {
        ...mapState(['shopInfo', 'perms', 'userName']),
    },
    // 监控data中的数据变化
    watch: {
        showDialog (val) {
            if (val) {
                this.initData()
            }
        }
    },
    // 方法集合
    methods: {
        ...mapMutations(['savePrinterName']),
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.getDetail()
        },
        
        // 获取详情
        getDetail () {
            let params = {
                id: this.itemId
            }
            queryOrderDetail(params).then(res => {
                if (res.code === 20000) {
                    this.receipt = res.data.receipt
                    this.receiptNumber = res.data.receiptNumber || ''
                    const items = res.data.items || []
                    this.productList = items.map(item => {
                        let maxCount = item.finalCount - item.refundCount
                        let maxAmount = item.settleAmount - item.refundAmount
                        let disabled = item.refundCount >= item.finalCount
                        return {
                            ...item,
                            maxCount,
                            disabled,
                            count: maxCount,
                            maxAmount,
                            amount: item.settleAmount - item.refundAmount,
                        }
                    })
                    this.number = res.data.number
                    this.createdAt = res.data.createdAt
                    this.member = res.data.member
                    this.operatorName = res.data.operator ? res.data.operator.username : ''
                    this.itemTotalAmount = res.data.itemTotalAmount
                    this.itemDiscountAmount = res.data.itemDiscountAmount
                    this.orderDiscountAmount = res.data.orderDiscountAmount
                    this.totalDiscountAmount = res.data.totalDiscountAmount
                    this.finalAmount = res.data.finalAmount
                    this.remark = res.data.remark
                    this.payments = res.data.payments || []
                    this.paidAmount = res.data.paidAmount
                    this.enablePreprint = res.data.cashierSetting.enablePreprint
                    this.enableAliasPrint = res.data.cashierSetting.enableAliasPrint
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
        // 更新收据
        updateReceipt () {
            return new Promise((resolve, reject) => {
                let params = {
                    id: this.itemId
                }
                queryOrderDetail(params).then(res => {
                    if (res.code === 20000) {
                        this.receipt = res.data.receipt
                        this.receiptNumber = res.data.receiptNumber || ''
                        const items = res.data.items || []
                        this.productList = items.map(item => {
                            let maxCount = item.finalCount - item.refundCount
                            let maxAmount = item.settleAmount - item.refundAmount
                            let disabled = item.refundCount >= item.finalCount
                            return {
                                ...item,
                                maxCount,
                                disabled,
                                count: maxCount,
                                maxAmount,
                                amount: item.settleAmount - item.refundAmount,
                            }
                        })
                        this.number = res.data.number
                        this.createdAt = res.data.createdAt
                        this.member = res.data.member
                        this.operatorName = res.data.operator ? res.data.operator.username : ''
                        this.itemTotalAmount = res.data.itemTotalAmount
                        this.itemDiscountAmount = res.data.itemDiscountAmount
                        this.orderDiscountAmount = res.data.orderDiscountAmount
                        this.totalDiscountAmount = res.data.totalDiscountAmount
                        this.finalAmount = res.data.finalAmount
                        this.remark = res.data.remark
                        this.payments = res.data.payments || []
                        this.paidAmount = res.data.paidAmount
                        this.enablePreprint = res.data.cashierSetting.enablePreprint
                        this.enableAliasPrint = res.data.cashierSetting.enableAliasPrint
                        resolve()
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        })
                        reject()
                    }
                }).catch(error => {
                    this.$message.error(error);
                    reject()
                })
            });
        },
        
        // 是否可勾选
        rowSelectable (row, index) {
            return !row.disabled;
        },
    
        // 校验数量
        checkCount (row) {
            if (row.disabled) return true
            if (!validateFloat(row.count)) return false
            return Number(row.count) <= row.maxCount;
        },
        // 校验金额
        checkAmount (row) {
            if (row.disabled) return true
            if (!validateFloat(row.amount)) return false
            return formatFloat(row.amount) <= row.maxAmount;
        },
        // 选择商品
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 退单
        refundHandle () {
            if (!this.checkRefundItem()) return;
            let items = this.multipleSelection.map(item => {
                return {
                    orderItemId: item.id,
                    count: item.count,
                    amount: item.amount
                }
            })
            let params = {
                orderId: this.itemId,
                items,
                remark: null
            }
            this.refundDisabled = true
            createRefundOrder(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.getDetail()
                    // 生成条码
                    this.createBarcode(res.data.id, res.data.amount)
                    // 更新订单
                    this.updateOrder()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.refundDisabled = false
            })
        },
        // 校验退款项
        checkRefundItem () {
            return this.multipleSelection.every((item, index, array) => {
                return validateFloat(item.count) && Number(item.count) <= item.maxCount && validateFloat(item.amount) && formatFloat(item.amount) <= item.maxAmount
            });
        },
        // 生成条形码
        createBarcode (code, price) {
            if (!code) return ''
            let barcodeOptions = {
                format: "CODE128",//条形码的格式
                width: 2,//线宽
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
            this.printBarcode(url, price)
        },
        // 打印条形码
        printBarcode (url, price) {
            queryPrinterList().then(res => {
                if (res.length !== 0) {
                    res.forEach((item) => {
                        if (item.isDefault) {
                            this.savePrinterName(item.name)
                        }
                    });
                    const webview = document.querySelector('#printBarcode');
                    webview.send('webview-print-render', {
                        price,
                        img: url
                    }); //将数据发送至webview
                } else {
                    this.$message({
                        showClose: true,
                        message: this.$t('notPrinter'),
                        type: 'error'
                    })
                }
            })
        },
    
        // 打印账单
        printBillHandle () {
            if (this.receipt === 100) {
                this.prePressPrint('preprint')
            } else if (this.receipt === 101) {
                this.prePressPrint('tax')
            } else if (this.receipt === 102) {
                this.prePressPrint('invoice')
            }
        },
    
        // 预打
        prePressPrint (printType = 'preprint') {
            let items = this.productList.map(item => {
                return {
                    ...item,
                    count: item.finalCount
                }
            })
            let taxObj = this.taxGroupBy(items)
            let taxList = []
            let taxAmountList = []
            for (let key in taxObj) {
                let settleAmount = taxObj[key].reduce((pre, next) => {
                    return pre + next.settleAmount
                }, 0)
                let vatAmount = taxObj[key].reduce((pre, next) => {
                    return pre + next.vatAmount
                }, 0)
                taxAmountList.push(vatAmount)
                taxList.push({
                    taxRate: Number(key),
                    finalNetAmount:  settleAmount - vatAmount,
                    vatAmount: vatAmount,
                    settleAmount: settleAmount,
                })
            }
            let taxAmount = taxAmountList.reduce((x, y) => {
                return x + y;
            })
            let snf = localStorage.getItem('snf').padStart(4, '0')
            let printData = {
                printType,
                receiptNumber: this.receiptNumber,
                name: this.shopInfo.name,
                company: this.shopInfo.companyName || '',
                address: this.shopInfo.address,
                pcg: `${this.shopInfo.zipcode} ${this.shopInfo.city} ${this.shopInfo.provinceName}`,
                country: this.shopInfo.countryName,
                vatNumber: this.shopInfo.vatNumber,
                taxCode: this.shopInfo.taxCode,
                operatorName: this.userName,
                items: this.productList,
                taxList,
                taxAmount,
                payments: this.payments,
                itemTotalAmount: this.itemTotalAmount,
                itemDiscountAmount: this.itemDiscountAmount,
                orderDiscountAmount: this.orderDiscountAmount,
                finalAmount: this.finalAmount,
                time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                snf,
                member: this.member
            }
            queryPrinterList().then(res => {
                if (res.length !== 0) {
                    res.forEach((item) => {
                        if (item.isDefault) {
                            this.savePrinterName(item.name)
                        }
                    });
                    if (this.shopInfo.countryCode === 'IT') {
                        let webview = document.querySelector('#preprintIt')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ZH') {
                        let webview = document.querySelector('#preprintZh')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'EN') {
                        let webview = document.querySelector('#preprintEn')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'FR') {
                        let webview = document.querySelector('#preprintFr')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'DE') {
                        let webview = document.querySelector('#preprintDe')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ES' || this.shopInfo.countryCode === 'CA') {
                        let webview = document.querySelector('#preprintEs')
                        webview.send('webview-print-render', printData)
                    } else {
                        let webview = document.querySelector('#preprintEn')
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
        
        // 税票
        taxHandle () {
            let params = {
                id: this.itemId,
                receipt: 101,
            }
            this.taxDisabled = true
            updateOrderReceipt(params).then(res => {
                if (res.code === 20000) {
                    this.updateReceipt().then(() => {
                        if (this.shopInfo.countryCode === 'ES') {
                            // 预打
                            this.prePressPrint('tax')
                        } else {
                            this.taxPrint();
                        }
                    })
                    // 更新订单
                    this.updateOrder()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err);
            }).finally(() => {
                this.taxDisabled = false
            })
        },
        taxPrint () {
            let taxPrinterType = localStorage.getItem("taxPrinterType")
            let taxPrinterIp = localStorage.getItem("taxPrinterIp")
            if (!taxPrinterType) {
                this.$message({
                    showClose: true,
                    message: this.$t('noSelTax'),
                    type: 'warning'
                });
                return
            }
            let items = this.productList.map(item => {
                return {
                    ...item,
                    count: item.finalCount
                }
            })
            let cashAmount = 0
            let cardAmount = 0
            let bizumAmount = 0
            let ticketAmount = 0
            let unpaidAmount = 0
            let voucherAmount = 0
            this.payments.forEach(item => {
                if (item.paymode === 101) {
                    cashAmount = item.amount
                } else if (item.paymode === 102) {
                    cardAmount = item.amount
                } else if (item.paymode === 106) {
                    bizumAmount = item.amount
                } else if (item.paymode === 103) {
                    ticketAmount = item.amount
                } else if (item.paymode === 104) {
                    unpaidAmount = item.amount
                } else if (item.paymode === 105) {
                    voucherAmount = item.amount
                }
            })
            let taxData = {
                shopId: this.shopInfo.id,
                items,
                cashAmount,
                cardAmount,
                bizumAmount,
                ticketAmount,
                unpaidAmount,
                voucherAmount,
                discountAmount: this.totalDiscountAmount, // 打折金额
                lotteryCode: '',
                writeType: taxPrinterType,
                enableAliasPrint: this.enableAliasPrint
            };
            if (taxPrinterType === 'epsonWeb') {
                if (!taxPrinterIp) {
                    this.$message({
                        showClose: true,
                        message: this.$t('noTaxIp'),
                        type: 'warning'
                    });
                    return;
                }
                this.$epsonPrinter.taxPrint(taxPrinterIp, taxData).then((dt) => {
                    if (!dt) {
                        // 打印失败
                        this.$alert(this.$t('hintPrinterError'), this.$t('hint'), {
                            confirmButtonText: this.$t('confirm'),
                            callback: action => {}
                        });
                    }
                });
            } else if (taxPrinterType === 'epson') {
                epsonTaxPrint(taxData)
            }
        },
        
        // 发票
        invoiceHandle () {
            this.$emit('invoice-handle')
        },
        // 发票校验
        invoiceCheck (invoiceBuyer) {
            let params = {
                id: this.itemId,
                receipt: 102,
                invoiceBuyer
            }
            updateOrderReceipt(params).then(res => {
                if (res.code === 20000) {
                    this.updateReceipt().then(() => {
                        if (this.enablePreprint) {
                            // 预打
                            this.prePressPrint('invoice')
                        } else {
                            this.invoicePrint(invoiceBuyer);
                        }
                    })
                    // 更新订单
                    this.updateOrder()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err);
            })
        },
        invoicePrint (invoiceBuyer) {
            // 发票名称
            let invoiceName = invoiceBuyer.type === 102 ? `${invoiceBuyer.firstName} ${invoiceBuyer.lastName}` : invoiceBuyer.name
            let invoiceData = {
                name: invoiceName,
                address: invoiceBuyer.address,
                zipcode: invoiceBuyer.zipcode,
                city: invoiceBuyer.city,
                country: invoiceBuyer.countryName,
                province: invoiceBuyer.provinceName,
                vatNumber: invoiceBuyer.vatNumber,
                taxCode: invoiceBuyer.taxCode,
            }
            // 菜品
            let taxObj = this.taxGroupBy(this.productList)
            let taxList = []
            let taxAmountList = []
            for (let key in taxObj) {
                let settleAmount = taxObj[key].reduce((pre, next) => {
                    return pre + next.settleAmount
                }, 0)
                let vatAmount = taxObj[key].reduce((pre, next) => {
                    return pre + next.vatAmount
                }, 0)
                taxAmountList.push(vatAmount)
                taxList.push({
                    taxRate: Number(key),
                    finalNetAmount:  settleAmount - vatAmount,
                    vatAmount: vatAmount,
                    settleAmount: settleAmount,
                })
            }
            let taxAmount = taxAmountList.reduce((x, y) => {
                return x + y;
            })
            let snf = localStorage.getItem('snf').padStart(4, '0')
            let printData = {
                receiptNumber: this.receiptNumber,
                name: this.shopInfo.name,
                company: this.shopInfo.companyName,
                address: this.shopInfo.address,
                pcg: `${this.shopInfo.zipcode} ${this.shopInfo.city} ${this.shopInfo.provinceName}`,
                country: this.shopInfo.countryName,
                vatNumber: this.shopInfo.vatNumber,
                taxCode: this.shopInfo.taxCode,
                operatorName: this.userName,
                items: this.productList,
                taxList,
                taxAmount,
                payments: this.payments,
                itemTotalAmount: this.itemTotalAmount,
                itemDiscountAmount: this.itemDiscountAmount,
                orderDiscountAmount: this.orderDiscountAmount,
                finalAmount: this.finalAmount,
                time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                invoiceData,
                snf,
                member: this.member
            }
            queryPrinterList().then(res => {
                if (res.length !== 0) {
                    res.forEach((item) => {
                        if (item.isDefault) {
                            this.savePrinterName(item.name)
                        }
                    });
                    if (this.shopInfo.countryCode === 'IT') {
                        let webview = document.querySelector('#printInvoiceIt')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ZH') {
                        let webview = document.querySelector('#printInvoiceZh')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'EN') {
                        let webview = document.querySelector('#printInvoiceEn')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'FR') {
                        let webview = document.querySelector('#printInvoiceFr')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'DE') {
                        let webview = document.querySelector('#printInvoiceDe')
                        webview.send('webview-print-render', printData)
                    } else if (this.shopInfo.countryCode === 'ES' || this.shopInfo.countryCode === 'CA') {
                        let webview = document.querySelector('#printInvoiceEs')
                        webview.send('webview-print-render', printData)
                    } else {
                        let webview = document.querySelector('#printInvoiceEn')
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
        
        // 分组
        taxGroupBy(arr) {
            let list = arr.sort((a, b) => b.taxRate - a.taxRate);
            return list.reduce((acc, item) => {
                let groupKey = item['taxRate'];
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(item);
                return acc;
            }, {});
        },
        
        // 更新订单
        updateOrder () {
            this.$emit('parent-update')
        },
        // 关闭弹窗
        dialogClose () {
            this.$emit('parent-close')
        }
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
.content{
    width: 100%;
    min-height: 570px;
    padding-top: 50px;
    display: flex;
    .product{
        width: 800px;
        flex-shrink: 0;
        ::v-deep .el-table{
            .el-table__header{
                .el-table__cell{
                    min-height: 50px;
                }
                .cell{
                    font-weight: 500;
                    font-size: 15px;
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
                    font-size: 18px;
                    color: #000000;
                }
                .el-input{
                    .el-input__inner{
                        font-size: 18px;
                        color: #000000;
                        text-align: center;
                    }
                }
            }
            .cell-desc {
                width: 100%;
                .desc-title{
                    font-weight: 500;
                    font-size: 18px;
                    color: #000000;
                    text-align: left;
                }
                .desc-text {
                    font-weight: 400;
                    font-size: 18px;
                    color: #6F6F6F;
                    text-align: left;
                }
            }
            .cell-price {
                del{
                    font-size: 14px;
                    color: #000000;
                    margin-right: 10px;
                }
                .price{
                    font-size: 18px;
                    color: #FF0000;
                }
            }
            .input-error {
                .el-input__inner {
                    border: 1px solid #FF0000;
                }
            }
        }
    }
    .bill{
        flex-grow: 1;
        height: 100%;
        padding-left: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        .card{
            width: 100%;
            .desc{
                padding: 8px 16px 6px;
                border: 1px solid #CECECE;
                .desc-item{
                    line-height: 24px;
                    margin-bottom: 5px;
                    .label{
                        font-weight: 500;
                        font-size: 15px;
                        color: #383838;
                    }
                    .value{
                        font-weight: 400;
                        font-size: 15px;
                        color: #383838;
                    }
                }
            }
            .pay{
                padding: 6px 16px 8px;
                border-left: 1px solid #CECECE;
                border-right: 1px solid #CECECE;
                border-bottom: 1px solid #CECECE;
                .pay-item{
                    width: 100%;
                    height: 21px;
                    margin-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .label{
                        font-weight: 500;
                        font-size: 15px;
                        color: #383838;
                    }
                    .value{
                        font-weight: 400;
                        font-size: 15px;
                        color: #383838;
                    }
                }
                .pay-total{
                    padding-top: 5px;
                    border-top: 1px dashed #CECECE;
                }
            }
        }
    }
}
.footer-handle{
    padding-top: 20px;
    padding-bottom: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
