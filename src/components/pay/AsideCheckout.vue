<template>
    <div class="aside-content">
        <a href="javascript:void(0)" class="close" @click="closeCheckout">
            <i class="el-icon-close"></i>
        </a>
        <div class="chunk">
            <h3 class="chunk-title">{{ $t('checkOut') }}</h3>
            <div class="chunk-bill">
                <div class="bill-item">
                    <span class="label">{{ $t('productAmount') }}</span>
                    <span class="value">{{ itemTotalAmount | filteFloat }}</span>
                </div>
                <div class="bill-item" v-if="orderData && orderData.itemDiscountAmount">
                    <span class="label">{{ $t('productDiscount') }}</span>
                    <span class="value discount" v-if="orderData.itemDiscountAmount > 0">-{{ orderData.itemDiscountAmount | filteFloat }}</span>
                    <span class="value discount" v-else-if="orderData.itemDiscountAmount < 0">+{{ Math.abs(orderData.itemDiscountAmount) | filteFloat }}</span>
                </div>
                <div class="bill-item" v-if="orderData && orderData.manualDiscount">
                    <span class="label">{{ $t('orderDiscount') }}</span>
                    <div class="value discount">
                        <span class="value-hint"
                            v-if="orderData.manualDiscount.type === 101">
                            ({{ orderData.manualDiscount.value }}%)
                        </span>
                        <span v-if="orderData">-{{ orderData.manualDiscount.amount | filteFloat }}</span>
                    </div>
                </div>
                <div class="bill-item" v-if="orderData && orderData.roundingDiscount">
                    <span class="label">{{ $t('rounding') }}</span>
                    <span class="value discount">-{{ orderData.roundingDiscount.amount | filteFloat }}</span>
                </div>
                <div class="bill-item" v-if="orderData && orderData.pointsDiscount && orderData.pointsDiscount.deductAmount > 0">
                    <span class="label">{{ $t('pointDeduction') }}</span>
                    <span class="value discount">-{{ orderData.pointsDiscount.deductAmount | filteFloat }}</span>
                </div>
                <div class="bill-item" v-if="orderData && orderData.couponDiscount">
                    <span class="label">{{ $t('coupon') }}</span>
                    <span class="value discount" v-if="orderData.couponDiscount.amount > 0">-{{ orderData.couponDiscount.amount | filteFloat }}</span>
                    <span class="value discount" v-else-if="orderData.couponDiscount.amount < 0">+{{ Math.abs(orderData.couponDiscount.amount) | filteFloat }}</span>
                </div>
            </div>
            <div class="chunk-payment">
                <div class="payment-left">
                    <div class="list">
                        <div class="item cope">
                            <el-input v-model="copeAmount" readonly>
                                <template slot="prepend">{{ $t('cope') }}</template>
                            </el-input>
                        </div>
                        <div class="item">
                            <el-input
                                v-model="cashAmount"
                                ref="cashRef"
                                @focus="paymentFocus('cash')"
                                @input="cashInput"
                                @keydown.native="(e) => paymentKeydown(e, 'cash')"
                                clearable>
                                <template slot="prepend">{{ $t('cash') }}</template>
                            </el-input>
                        </div>
                        <div class="item">
                            <el-input
                                v-model="cardAmount"
                                ref="cardRef"
                                @input="cardInput"
                                @focus="paymentFocus('card')"
                                @keydown.native="(e) => paymentKeydown(e, 'card')"
                                clearable>
                                <template slot="prepend">{{ $t('swipingCard') }}</template>
                            </el-input>
                        </div>
                        <div class="item" v-if="paymodes.includes(106)">
                            <el-input
                                v-model="bizumAmount"
                                ref="bizumRef"
                                @input="bizumInput"
                                @focus="paymentFocus('bizum')"
                                @keydown.native="(e) => paymentKeydown(e, 'bizum')"
                                clearable>
                                <template slot="prepend">BIZUM</template>
                            </el-input>
                        </div>
                        <div class="item" v-if="paymodes.includes(103)">
                            <el-input
                                v-model="ticketAmount"
                                ref="ticketRef"
                                @focus="paymentFocus('ticket')"
                                @keydown.native="(e) => paymentKeydown(e, 'ticket')"
                                clearable>
                                <template slot="prepend">{{ $t('mealVoucher') }}</template>
                            </el-input>
                        </div>
                        <div class="item" v-if="paymodes.includes(105)">
                            <el-input
                                v-model="voucherBarcode"
                                ref="voucherRef"
                                @focus="paymentFocus('voucher')"
                                @input.native="voucherDebounce"
                                clearable>
                                <template slot="prepend">{{ $t('voucher') }}</template>
                            </el-input>
                            <div class="vouchers">
                                <el-tag
                                    v-for="(tag, $index) in voucherList"
                                    :key="tag.id"
                                    size="mini"
                                    closable
                                    @close="voucherClose($index)">
                                    {{ tag.name }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="item" v-if="paymodes.includes(104)">
                            <el-input
                                v-model="unpaidAmount"
                                ref="unpaidRef"
                                @focus="paymentFocus('unpaid')"
                                @keydown.native="(e) => paymentKeydown(e, 'unpaid')"
                                clearable>
                                <template slot="prepend">{{ $t('notPaid') }}</template>
                            </el-input>
                        </div>
                    </div>
                    <div class="closing">
                        <span>{{ $t('giveChange') }}</span>
                        <span>{{ roundingAmount | filteFloat }}</span>
                    </div>
                </div>
                <div class="payment-right">
                    <div class="btn">
                        <el-button @click="discountDialog = true" v-if="perms.includes('cs.ord.off') && orderData && !orderData.manualDiscount">{{ $t('allOrderDazhe') }}</el-button>
                        <el-button @click="cancelOrderDisHandle" v-else-if="perms.includes('cs.ord.off')">{{ $t('cancelOrderDazhe') }}</el-button>
                    </div>
                    <div class="btn">
                        <el-button
                            @click="roundingHandle"
                            v-if="perms.includes('cs.ord.rounding') && orderData && !orderData.roundingDiscount">
                            {{ $t('rounding') }}
                        </el-button>
                        <el-button
                            @click="cancelRoundingHandle"
                            v-else-if="perms.includes('cs.ord.rounding')">
                            {{ $t('cancelRounding') }}
                        </el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="remarkHandle">{{ $t('remark') }}</el-button>
                    </div>
                    <div class="code">
                        <el-input v-model.trim="lotteryCode" :placeholder="$t('lotteryCode')" clearable></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-footer">
            <div class="code">
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('1')">1</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('2')">2</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('3')">3</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-b" @click="clickCode('delete')">
                            <i class="iconfont icon-remove"></i>
                        </a>
                    </div>
                </div>
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('4')">4</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('5')">5</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('6')">6</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-b" @click="clickCode('dot')">
                            <i class="iconfont icon-dot"></i>
                        </a>
                    </div>
                </div>
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('7')">7</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('8')">8</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('9')">9</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in" @click="clickCode('0')">0</a>
                    </div>
                </div>
            </div>
            <div class="btns">
                <div class="btn prerat" v-if="orderData && orderData.cashierSetting && orderData.cashierSetting.enableSettle">
                    <el-button @click="cellCheckOrder(100)" :disabled="preDisabled">{{ $t('preratting') }}</el-button>
                </div>
                <div class="btn invoice">
                    <el-button @click="cellCheckOrder(102)">{{ $t('invoice') }}</el-button>
                </div>
                <div class="btn tax">
                    <el-button @click="cellCheckOrder(101)" :disabled="preDisabled">{{ $t('taxReceipt') }}</el-button>
                </div>
            </div>
        </div>
        <!-- 整单折扣 -->
        <OrderDiscount
            :showDialog="discountDialog"
            :finalAmount="finalAmount"
            @parent-update="updateOrder(false)"
            @parent-close="discountDialog = false"/>
        <!-- 发票 -->
        <Invoice
            :showDialog="invoiceDialog"
            :memberId="memberId"
            @parent-update="invoiceCheck"
            @parent-close="invoiceDialog = false"/>
        <!-- 订单备注 -->
        <OrderRemark
            :showDialog="remarkDialog"
            :orderRemark="orderRemark"
            @parent-update="updateOrder(true)"
            @parent-close="remarkDialog = false"/>
        <!-- 刷卡支付 -->
        <CardPay
            :showDialog="posPayDialog"
            :posAmount="posAmount"
            :paymentIntentId="paymentIntentId"
            :paySessionId="paySessionId"
            @parent-update="posPaySuccess"
            @parent-close="posPayDialog = false"/>
    </div>
</template>

<script>
// 整单折扣
import OrderDiscount from "@/components/pay/OrderDiscount";
// 发票
import Invoice from "@/components/pay/Invoice";
// 订单备注
import OrderRemark from "@/components/pay/OrderRemark";
// 刷卡支付
import CardPay from '@/components/pay/CardPay'
import {mapMutations, mapState} from "vuex";
import {
    Debounce,
    formatFloat,
    formatFloatFloor,
    formatUseDot,
    formatCalculateFloat
} from "@/utils/common";
import {
    cancelOrderDiscount,
    cancelOrderRounding,
    checkSession,
    orderRounding,
    queryVoucherUseState
} from "@/api";
import {
    createPayIntent,
    createPaySession, queryTerminalStatus
} from "@/api/dojo";
import moment from "moment";
import {queryPrinterList} from "@/utils/ipc";
import {validateFloat, validateZeroFloat} from "@/utils/validate";
import {epsonTaxPrint} from "@/utils/printer";
import uuidv4 from 'uuid/v4';
export default {
    name: "AsideCheckout",
    // 组件
    components: {
        OrderDiscount,
        Invoice,
        OrderRemark,
        CardPay
    },
    props: {
        orderData: {
            type: [Object, null],
            default: null
        },
        productList: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            finalAmount: 0,
            copeAmount: '',
            cashAmount: '',
            cardAmount: '',
            bizumAmount: '',
            ticketAmount: '',
            voucherBarcode: '',
            voucherList: [],
            unpaidAmount: '',
            roundingAmount: 0,
            discountDialog: false,
            lotteryCode: '',
            preDisabled: false,
            invoiceDialog: false,
            memberId: '',
            paymentType: 'cash',
            remarkDialog: false,
            orderRemark: '',
            isFirstCash: true,
            isFirstCard: true,
            isFirstBizum: true,
            isAuto: true,
            receiptType: 100,   // 票据类型  100：待开发票  101：税票   102：发票
            posAmount: 0,
            paymentIntentId: '',   // 支付意图ID
            paySessionId: '',   // 支付会话ID
            posPayDialog: false,
        };
    },
    // 计算属性
    computed: {
        ...mapState(['paymodes', 'shopInfo', 'perms', 'userName']),
        ...mapState({
            enabledDojo: state => state.dojoConfig.enabled   // 启用Dojo
        }),
        itemTotalAmount () {
            if (this.orderData) {
                return formatCalculateFloat(this.orderData.itemFinalAmount + this.orderData.itemDiscountAmount, 4)
            } else {
                return 0
            }
        }
    },
    // 监控data中的数据变化
    watch: {
        cashAmount () {
            this.calcRounding();
        },
        cardAmount () {
            this.calcRounding();
        },
        bizumAmount () {
            this.calcRounding();
        },
        ticketAmount () {
            this.calcRounding();
        },
        unpaidAmount () {
            this.calcRounding();
        },
    },
    // 方法集合
    methods: {
        ...mapMutations(['savePrinterName', 'saveRecordPayment']),
        
        // 初始化付款金额
        initPayAmount () {
            if (!this.orderData) return;
            this.finalAmount = formatFloatFloor(this.orderData.finalAmount)
            this.copeAmount = formatUseDot(this.finalAmount)
            this.cashAmount = this.copeAmount
            this.cardAmount = ''
            this.bizumAmount = ''
            this.ticketAmount = ''
            this.voucherBarcode = ''
            this.voucherList = []
            this.unpaidAmount = ''
            this.roundingAmount = 0
            this.lotteryCode = ''
            this.paymentType = 'cash'
            this.$nextTick(() => {
                this.$refs.cashRef.$el.querySelector('input').focus();
            })
        },
        
        // 输入现金金额
        cashInput (val) {
            if (!this.isFirstCash) return
            this.cashAmount = val.slice(-1)
            this.isFirstCash = false;
        },
        // 输入刷卡金额
        cardInput (val) {
            if (!this.isFirstCard) return
            this.cardAmount = val.slice(-1)
            this.isFirstCard = false;
        },
        // 输入bizum金额
        bizumInput (val) {
            if (!this.isFirstBizum) return
            this.bizumAmount = val.slice(-1)
            this.isFirstBizum = false;
        },
        
        // 校验编码是否重复
        voucherDebounce: Debounce(function () {
            if (!this.voucherBarcode) return;
            let temp = this.voucherList.find(item => item.barcode === this.voucherBarcode)
            if (temp !== undefined) {
                this.$message({
                    showClose: true,
                    message: this.$t('vouRepeatAdd'),
                    type: 'warning'
                });
                this.voucherBarcode = ''
                return
            }
            this.getVoucherDetail(this.voucherBarcode)
        }, 300),
        // 获取抵用券详情
        getVoucherDetail (barcode) {
            let params = {
                id: barcode
            }
            queryVoucherUseState(params).then(res => {
                if (res.code === 20000) {
                    let temp = this.voucherList.find(item => item.id === res.data.id)
                    if (temp !== undefined) {
                        this.$message({
                            showClose: true,
                            message: this.$t('vouRepeatAdd'),
                            type: 'warning'
                        });
                        return
                    }
                    let amountValue = res.data.amount.toString().replace('.', ',')
                    this.voucherList.push({
                        id: res.data.id,
                        amount: res.data.amount,
                        name: `${res.data.id} (${amountValue}€)`
                    })
                    this.calcRounding();
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
                this.voucherBarcode = ''
            })
        },
        // 删除抵用券
        voucherClose (index) {
            this.voucherList.splice(index, 1)
            this.calcRounding();
        },
    
        // 计算找零
        calcRounding () {
            if (!this.checkPayments()) {
                this.roundingAmount = ''
                return
            }
            const cashAmount = formatFloatFloor(this.cashAmount)
            const cardAmount = formatFloatFloor(this.cardAmount)
            const bizumAmount = formatFloatFloor(this.bizumAmount)
            const ticketAmount = formatFloatFloor(this.ticketAmount)
            const unpaidAmount = formatFloatFloor(this.unpaidAmount)
            const voucherAmount = this.voucherList.reduce((pre, next) => {
                return pre + next.amount;
            }, 0)
            const finalAmount = formatFloatFloor(this.orderData.finalAmount)
            // 找零
            const roundingAmount = cashAmount + cardAmount + bizumAmount + ticketAmount + unpaidAmount + voucherAmount - finalAmount
            this.roundingAmount = formatCalculateFloat(roundingAmount)
        },
    
        // 支付框按键按下
        paymentKeydown (event, type) {
            if(event.key === 'Tab') {
                this.cashAmount = ''
                this.cardAmount = ''
                this.bizumAmount = ''
                this.ticketAmount = ''
                this.voucherBarcode = ''
                this.voucherList = []
                this.unpaidAmount = ''
                this.roundingAmount = 0
                if (type === 'cash') {
                    this.cashAmount = this.copeAmount
                } else if (type === 'card') {
                    this.cardAmount = this.copeAmount
                } else if (type === 'bizum') {
                    this.bizumAmount = this.copeAmount
                } else if (type === 'ticket') {
                    this.ticketAmount = this.copeAmount
                } else if (type === 'unpaid') {
                    this.unpaidAmount = this.copeAmount
                }
            } else if (event.key === 'Enter') {
                if(this.preDisabled) return;
                this.cellCheckOrder(101)
            }
        },
    
        // 取消订单折扣
        cancelOrderDisHandle () {
            cancelOrderDiscount().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.updateOrder(false)
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
        
        // 抹零
        roundingHandle () {
            orderRounding().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.updateOrder(false)
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
        // 取消抹零
        cancelRoundingHandle () {
            cancelOrderRounding().then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.updateOrder(false)
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
    
        // 备注
        remarkHandle () {
            if (!this.orderData) return
            this.orderRemark = this.orderData.remark || ''
            this.remarkDialog = true
        },
        
        // 预打校验
        prePressCheck () {
            let { payments, vouchers } = this.disposePayments()
            let params = {
                receipt: 100,
                payments: payments
            }
            if (vouchers.length > 0) {
                params.vouchers = vouchers
            }
            this.preDisabled = true
            checkSession(params).then(res => {
                if (res.code === 20000) {
                    // 开钱箱
                    this.$emit('open-cashbox')
                    // 打印
                    if (this.roundingAmount > 0) {
                        this.prePressPrint([...payments, {
                            paymode: 0,
                            amount: this.roundingAmount
                        }], 'preprint')
                    } else {
                        this.prePressPrint(payments, 'preprint')
                    }
                    // 保存买单信息
                    this.saveRecordPayment({
                        finalAmount: formatFloatFloor(this.orderData.finalAmount),
                        payments,
                        roundingAmount: this.roundingAmount
                    })
                    // 更新订单
                    this.updateOrder(false)
                    // 关闭买单
                    this.closeCheckout()
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
                this.preDisabled = false
            })
        },
        // 预打
        prePressPrint (payments, printType = 'preprint', receiptNumber = '') {
            // 商品
            let items = []
            this.productList.forEach(item => {
                if (item.ifRuleDiscountItem) {
                    let newList = item.prices.map(inItem => {
                        return {
                            ...item,
                            originalPrice: item.sellPrice,
                            finalPrice: inItem.price,
                            settlePrice: inItem.price,
                            count: inItem.count,
                            finalAmount: inItem.total
                        }
                    })
                    items = [...items, ...newList]
                } else {
                    items.push({
                        ...item,
                        originalPrice: item.sellPrice
                    })
                }
            })
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
            let printData = {
                printType,
                receiptNumber,
                name: this.shopInfo.name,
                company: this.shopInfo.companyName || '',
                address: this.shopInfo.address,
                pcg: `${this.shopInfo.zipcode} ${this.shopInfo.city} ${this.shopInfo.provinceName}`,
                country: this.shopInfo.countryName,
                vatNumber: this.shopInfo.vatNumber,
                taxCode: this.shopInfo.taxCode,
                contactPhone: this.shopInfo.contactPhone,
                operatorName: this.userName,
                items,
                taxList,
                taxAmount,
                payments,
                itemTotalAmount: this.itemTotalAmount,
                itemDiscountAmount: this.orderData.itemDiscountAmount,
                orderDiscountAmount: this.orderData.orderDiscountAmount,
                finalAmount: formatFloatFloor(this.orderData.finalAmount),
                time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                member: this.orderData.member,
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
    
        // 发票校验
        invoiceCheck (invoiceBuyer) {
            let { payments, vouchers } = this.disposePayments()
            let params = {
                receipt: 102,
                payments,
                invoiceBuyer
            }
            if (vouchers.length > 0) {
                params.vouchers = vouchers
            }
            checkSession(params).then(res => {
                if (res.code === 20000) {
                    // 开钱箱
                    this.$emit('open-cashbox')
                    // 打印
                    if (this.orderData.cashierSetting.enablePreprint) {
                        if (this.roundingAmount > 0) {
                            this.prePressPrint([...payments, {
                                paymode: 0,
                                amount: this.roundingAmount
                            }], 'invoice', res.data.receiptNumber)
                        } else {
                            this.prePressPrint(payments, 'invoice', res.data.receiptNumber)
                        }
                    } else {
                        if (this.roundingAmount > 0) {
                            this.invoicePrint([...payments, {
                                paymode: 0,
                                amount: this.roundingAmount
                            }], invoiceBuyer, res.data.receiptNumber)
                        } else {
                            this.invoicePrint(payments, invoiceBuyer, res.data.receiptNumber)
                        }
                    }
                    // 保存买单信息
                    this.saveRecordPayment({
                        finalAmount: formatFloatFloor(this.orderData.finalAmount),
                        payments,
                        roundingAmount: this.roundingAmount
                    })
                    // 更新订单
                    this.updateOrder(false)
                    // 关闭买单
                    this.closeCheckout()
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
        invoicePrint (payments, invoiceBuyer, receiptNumber = '') {
            // 发票名称
            let invoiceData = {
                name: invoiceBuyer.name,
                address: invoiceBuyer.address,
                zipcode: invoiceBuyer.zipcode,
                city: invoiceBuyer.city,
                country: invoiceBuyer.country,
                province: invoiceBuyer.province,
                vatNumber: invoiceBuyer.vatNumber,
                taxCode: invoiceBuyer.taxCode,
                contactPhone: invoiceBuyer.contactPhone
            }
            // 商品
            let items = []
            this.productList.forEach(item => {
                if (item.ifRuleDiscountItem) {
                    let newList = item.prices.map(inItem => {
                        return {
                            ...item,
                            originalPrice: item.sellPrice,
                            finalPrice: inItem.price,
                            settlePrice: inItem.price,
                            count: inItem.count,
                            finalAmount: inItem.total
                        }
                    })
                    items = [...items, ...newList]
                } else {
                    items.push({
                        ...item,
                        originalPrice: item.sellPrice
                    })
                }
            })
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
            let printData = {
                receiptNumber,
                name: this.shopInfo.name,
                company: this.shopInfo.companyName || '',
                address: this.shopInfo.address,
                pcg: `${this.shopInfo.zipcode} ${this.shopInfo.city} ${this.shopInfo.provinceName}`,
                country: this.shopInfo.countryName,
                vatNumber: this.shopInfo.vatNumber,
                taxCode: this.shopInfo.taxCode,
                contactPhone: this.shopInfo.contactPhone,
                operatorName: this.userName,
                items,
                taxList,
                taxAmount,
                payments,
                itemTotalAmount: this.itemTotalAmount,
                itemDiscountAmount: this.orderData.itemDiscountAmount,
                orderDiscountAmount: this.orderData.orderDiscountAmount,
                finalAmount: formatFloatFloor(this.orderData.finalAmount),
                time: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                invoiceData,
                member: this.orderData.member
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
    
        // 税票校验
        taxCheck () {
            let { payments, vouchers } = this.disposePayments()
            let params = {
                receipt: 101,
                payments
            }
            if (vouchers.length > 0) {
                params.vouchers = vouchers
            }
            this.preDisabled = true
            checkSession(params).then(res => {
                if (res.code === 20000) {
                    // 开钱箱
                    this.$emit('open-cashbox')
                    // 打印
                    if (this.shopInfo.countryCode === 'ES') {
                        if (this.roundingAmount > 0) {
                            this.prePressPrint([...payments, {
                                paymode: 0,
                                amount: this.roundingAmount
                            }], 'tax', res.data.receiptNumber)
                        } else {
                            this.prePressPrint(payments, 'tax', res.data.receiptNumber)
                        }
                    } else {
                        this.taxPrint();
                    }
                    // 保存买单信息
                    this.saveRecordPayment({
                        finalAmount: formatFloatFloor(this.orderData.finalAmount),
                        payments,
                        roundingAmount: this.roundingAmount
                    })
                    // 更新订单
                    this.updateOrder(false)
                    // 关闭买单
                    this.closeCheckout()
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
                this.preDisabled = false
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
            // 商品
            let items = []
            this.productList.forEach(item => {
                if (item.ifRuleDiscountItem) {
                    let newList = item.prices.map(inItem => {
                        return {
                            ...item,
                            originalPrice: item.sellPrice,
                            finalPrice: inItem.price,
                            settlePrice: inItem.price,
                            count: inItem.count,
                            finalAmount: inItem.total
                        }
                    })
                    items = [...items, ...newList]
                } else {
                    items.push({
                        ...item,
                        originalPrice: item.sellPrice
                    })
                }
            })
            const voucherAmount = this.voucherList.reduce((pre, next) => {
                return pre + next.amount;
            }, 0)
            let orderData = JSON.parse(JSON.stringify(this.orderData))
            let taxData = {
                shopId: this.shopInfo.id,
                items,
                cashAmount: formatFloatFloor(this.cashAmount),
                cardAmount: formatFloatFloor(this.cardAmount),
                bizumAmount: formatFloatFloor(this.bizumAmount),
                ticketAmount: formatFloatFloor(this.ticketAmount),
                unpaidAmount: formatFloatFloor(this.unpaidAmount),
                voucherAmount: formatCalculateFloat(voucherAmount),
                discountAmount: orderData.orderDiscountAmount, // 打折金额
                lotteryCode: this.lotteryCode,
                writeType: taxPrinterType,
                enableAliasPrint: orderData.cashierSetting.enableAliasPrint
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
    
        // 校验支付方式
        checkPayments () {
            if (this.cashAmount && !validateZeroFloat(this.cashAmount)) {
                return false
            }
            if (this.cardAmount && !validateZeroFloat(this.cardAmount)) {
                return false
            }
            if (this.bizumAmount && !validateZeroFloat(this.bizumAmount)) {
                return false
            }
            if (this.ticketAmount && !validateZeroFloat(this.ticketAmount)) {
                return false
            }
            if (this.unpaidAmount && !validateZeroFloat(this.unpaidAmount)) {
                return false
            }
            return true
        },
        // 处理支付方式
        disposePayments () {
            // 支付方式
            let payments = []
            if (this.cashAmount && validateFloat(this.cashAmount)) {
                let obj = {
                    paymode: 101,
                    amount: formatFloatFloor(this.cashAmount)
                }
                payments.push(obj);
            }
            if (this.cardAmount && validateFloat(this.cardAmount)) {
                let obj = {
                    paymode: 102,
                    amount: formatFloatFloor(this.cardAmount)
                }
                payments.push(obj);
            }
            if (this.bizumAmount && validateFloat(this.bizumAmount)) {
                let obj = {
                    paymode: 106,
                    amount: formatFloatFloor(this.bizumAmount)
                }
                payments.push(obj);
            }
            if (this.ticketAmount && validateFloat(this.ticketAmount)) {
                let obj = {
                    paymode: 103,
                    amount: formatFloatFloor(this.ticketAmount)
                }
                payments.push(obj);
            }
            if (this.unpaidAmount && validateFloat(this.unpaidAmount)) {
                let obj = {
                    paymode: 104,
                    amount: formatFloatFloor(this.unpaidAmount)
                }
                payments.push(obj);
            }
            // 抵用券
            let vouchers = []
            if (this.voucherList.length > 0) {
                const voucherAmount = this.voucherList.reduce((pre, next) => {
                    return pre + next.amount;
                }, 0)
                vouchers = this.voucherList.map(item => {
                    return {
                        voucherId: item.id
                    }
                })
                let obj = {
                    paymode: 105,
                    amount: formatCalculateFloat(voucherAmount)
                }
                payments.push(obj);
            }
            return {
                payments,
                vouchers
            }
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
    
        // 当前支付方式
        paymentFocus (type) {
            this.paymentType = type
        },
        // 点击按键
        clickCode (code) {
            if (code === 'delete') {
                this.popPaymentAmount()
            } else if (code === 'dot') {
                this.pushPaymentAmount(',')
            } else {
                this.pushPaymentAmount(code)
            }
        },
        // 删除支付金额项
        popPaymentAmount () {
            switch (this.paymentType) {
                case 'cash':
                    this.cashAmount = this.cashAmount.slice(0, -1)
                    this.$refs.cashRef.$el.querySelector('input').focus();
                    break;
                case 'card':
                    this.cardAmount = this.cardAmount.slice(0, -1)
                    this.$refs.cardRef.$el.querySelector('input').focus();
                    break;
                case 'bizum':
                    this.bizumAmount = this.bizumAmount.slice(0, -1)
                    this.$refs.bizumRef.$el.querySelector('input').focus();
                    break;
                case 'ticket':
                    this.ticketAmount = this.ticketAmount.slice(0, -1)
                    this.$refs.ticketRef.$el.querySelector('input').focus();
                    break;
                case 'unpaid':
                    this.unpaidAmount = this.unpaidAmount.slice(0, -1)
                    this.$refs.unpaidRef.$el.querySelector('input').focus();
                    break;
            }
        },
        // 添加支付金额项
        pushPaymentAmount (code) {
            switch (this.paymentType) {
                case 'cash':
                    this.cashAmount = this.cashAmount + code
                    this.$refs.cashRef.$el.querySelector('input').focus();
                    break;
                case 'card':
                    this.cardAmount = this.cardAmount + code
                    this.$refs.cardRef.$el.querySelector('input').focus();
                    break;
                case 'bizum':
                    this.bizumAmount = this.bizumAmount + code
                    this.$refs.bizumRef.$el.querySelector('input').focus();
                    break;
                case 'ticket':
                    this.ticketAmount = this.ticketAmount + code
                    this.$refs.ticketRef.$el.querySelector('input').focus();
                    break;
                case 'unpaid':
                    this.unpaidAmount = this.unpaidAmount + code
                    this.$refs.unpaidRef.$el.querySelector('input').focus();
                    break;
            }
        },
        
        // 调整支付焦点
        tooglePaymentFocus (type) {
            if (this.isFirstCash && this.isAuto) {
                this.cashAmount = ''
            }
            this.isAuto = false
            switch (type) {
                case 'cash':
                    this.paymentType = type
                    this.$refs.cashRef.$el.querySelector('input').focus();
                    this.cashAmount = this.calcRemainAmount()
                    this.isFirstCash = true
                    break;
                case 'card':
                    this.paymentType = type
                    this.$refs.cardRef.$el.querySelector('input').focus();
                    this.cardAmount = this.calcRemainAmount()
                    this.isFirstCard = true
                    break;
                case 'bizum':
                    if (!this.paymodes.includes(106)) return;
                    this.paymentType = type
                    this.$refs.bizumRef.$el.querySelector('input').focus();
                    this.bizumAmount = this.calcRemainAmount()
                    this.isFirstBizum = true
                    break;
                case 'ticket':
                    this.paymentType = type
                    if (!this.paymodes.includes(103)) return;
                    this.$refs.ticketRef.$el.querySelector('input').focus();
                    this.ticketAmount = this.calcRemainAmount()
                    break;
                case 'voucher':
                    if (!this.paymodes.includes(105)) return;
                    this.paymentType = type
                    this.$refs.voucherRef.$el.querySelector('input').focus();
                    break;
                case 'unpaid':
                    if (!this.paymodes.includes(104)) return;
                    this.paymentType = type
                    this.$refs.unpaidRef.$el.querySelector('input').focus();
                    this.unpaidAmount = this.calcRemainAmount()
                    break;
            }
        },
        // 计算找零
        calcRemainAmount () {
            switch (this.paymentType) {
                case 'cash':
                    this.cashAmount = ''
                    break;
                case 'card':
                    this.cardAmount = ''
                    break;
                case 'bizum':
                    this.bizumAmount = ''
                    break;
                case 'ticket':
                    this.ticketAmount = ''
                    break;
                case 'unpaid':
                    this.unpaidAmount = ''
                    break;
            }
            if (!this.checkPayments()) return ''
            const cashAmount = formatFloatFloor(this.cashAmount)
            const cardAmount = formatFloatFloor(this.cardAmount)
            const bizumAmount = formatFloatFloor(this.bizumAmount)
            const ticketAmount = formatFloatFloor(this.ticketAmount)
            const unpaidAmount = formatFloatFloor(this.unpaidAmount)
            const voucherAmount = this.voucherList.reduce((pre, next) => {
                return pre + next.amount;
            }, 0)
            const finalAmount = formatFloatFloor(this.orderData.finalAmount)
            // 剩余金额
            const roundingAmount = finalAmount - cashAmount - cardAmount - bizumAmount - ticketAmount - unpaidAmount - voucherAmount
            return formatCalculateFloat(roundingAmount)
        },
    
        // 抹零
        cellRounding () {
            if (!this.perms.includes('cs.ord.rounding')) return;
            if (this.orderData.roundingDiscount) {
                // 取消抹零
                this.cancelRoundingHandle()
            } else {
                // 抹零
                this.roundingHandle()
            }
        },
        
        // 买单
        cellCheckOrder (type) {
            if(this.preDisabled) return;
            // 是否开启预打
            if (type === 100 && (!this.orderData.cashierSetting || !this.orderData.cashierSetting.enableSettle)) return;
            if (!this.checkPayments()) {
                this.$message({
                    showClose: true,
                    message: this.$t('payAmoNotRule'),
                    type: 'warning'
                });
                return
            }
            if (this.roundingAmount < 0) {
                this.$message({
                    showClose: true,
                    message: this.$t('payMinFinal'),
                    type: 'warning'
                });
                return
            }
            // pos机ID
            const posId = localStorage.getItem("posId")
            if (this.cardAmount && formatFloatFloor(this.cardAmount) > 0 && this.enabledDojo && !!posId) {
                this.receiptType = type
                this.posAmount = formatFloatFloor(this.cardAmount)
                this.getTerminalStatus()
                // this.startPosPay()
                return;
            }
            if (type === 100) {
                // 预打
                this.prePressCheck()
            } else if (type === 101) {
                // 税票
                this.taxCheck()
            } else if (type === 102) {
                // 发票
                this.cellInvoice()
            }
        },
        // 获取终端状态
        getTerminalStatus () {
            const terminalId = localStorage.getItem("posId")
            this.preDisabled = true
            queryTerminalStatus(terminalId).then(res => {
                const status = res.status
                if (status === 'Available') {
                    this.startPosPay()
                } else if (status === 'Offline') {
                    this.$message({
                        showClose: true,
                        message: this.$t('mposDisable'),
                        type: 'warning'
                    });
                } else if (status === 'InUse') {
                    this.$message({
                        showClose: true,
                        message: this.$t('mposInuseHint'),
                        type: 'warning'
                    });
                }
            }).catch(err => {
                this.$message.error(err);
            }).finally(() => {
                this.preDisabled = false
            })
        },
        // 发起支付意图
        startPosPay () {
            let params = {
                captureMode: 'Auto',
                amount: {
                    value: this.posAmount * 100,
                    currencyCode: 'EUR'
                },
                reference: uuidv4(),
                description: uuidv4()
            }
            this.preDisabled = true
            createPayIntent(params).then(res => {
                if (!res || !res.id) return
                this.paymentIntentId = res.id
                this.startPaySession()
            }).catch(err => {
                this.$message.error(err);
            }).finally(() => {
                this.preDisabled = false
            })
        },
        
        // 创建支付会话
        startPaySession () {
            let params = {
                terminalId: localStorage.getItem("posId"),
                details: {
                    sale: {
                        paymentIntentId: this.paymentIntentId
                    },
                    sessionType: 'Sale'
                }
            }
            this.preDisabled = true
            createPaySession(params).then(res => {
                if (!res || !res.id) return
                this.paySessionId = res.id
                this.posPayDialog = true
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.preDisabled = false
            })
        },
        
        // 支付成功
        posPaySuccess () {
            if (this.receiptType === 100) {
                // 预打
                this.prePressCheck()
            } else if (this.receiptType === 101) {
                // 税票
                this.taxCheck()
            } else if (this.receiptType === 102) {
                // 发票
                this.cellInvoice()
            }
        },
       
        // 发票
        cellInvoice () {
            this.memberId = this.orderData && this.orderData.member ? this.orderData.member.id : ''
            this.invoiceDialog = true
        },
        // 整单折扣
        cellDiscount () {
            if (!this.perms.includes('cs.ord.off')) return;
            this.discountDialog = true
        },
        // 更新订单
        updateOrder (b = false) {
            // 更新会话
            this.$emit('session-update', b)
        },
        
        // 关闭买单
        closeCheckout () {
            this.$emit('toggle-page', 'product')
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        this.initPayAmount()
    },
    // 组件被激活
    activated() {
    
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
    position: relative;
    .close{
        position: absolute;
        top: 30px;
        right: 26px;
        i{
            font-size: 34px;
            color: #000000;
            font-weight: 600;
        }
    }
    .chunk{
        width: 100%;
        height: 696px;
        padding: 22px 32px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        .chunk-title{
            width: 100%;
            height: 42px;
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 30px;
            color: #000000;
        }
        .chunk-bill{
            margin-top: 45px;
            width: 100%;
            height: 150px;
            overflow-y: auto;
            .bill-item{
                width: 100%;
                height: 36px;
                display: flex;
                justify-content: space-between;
                .label{
                    font-weight: 400;
                    font-size: 25px;
                    color: #000000;
                }
                .value{
                    font-weight: 400;
                    font-size: 25px;
                    color: #000000;
                    .value-hint{
                        margin-right: 6px;
                    }
                    &.discount{
                        color: #FF0000;
                    }
                }
            }
        }
        .chunk-payment{
            width: 100%;
            display: flex;
            justify-content: space-between;
            .payment-left{
                width: 492px;
                .list{
                    .item{
                        margin-bottom: 12px;
                        ::v-deep .el-input {
                            width: 100%;
                            height: 50px;
                            background: #FFFFFF;
                            .el-input-group__prepend{
                                width: 152px;
                                padding: 0 6px;
                                font-weight: 600;
                                font-size: 20px;
                                color: #FFFFFF;
                                text-align: center;
                                background: #A5A5A5;
                                border-radius: 5px 0px 0px 5px;
                            }
                            .el-input__inner{
                                width: 100%;
                                height: 100%;
                                border-radius: 5px 0px 0px 5px;
                                border: 1px solid #E2E2E2;
                                font-weight: 500;
                                font-size: 22px;
                                color: #000000;
                                text-align: right;
                            }
                        }
                        .vouchers{
                            width: 100%;
                            padding-top: 5px;
                            display: flex;
                            flex-wrap: wrap;
                            .el-tag{
                                margin-right: 10px;
                            }
                        }
                        &.cope{
                            ::v-deep .el-input {
                                .el-input-group__prepend{
                                    background: #FF9300;
                                }
                            }
                        }
                    }
                }
                .closing{
                    width: 100%;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span{
                        font-weight: 400;
                        font-size: 20px;
                        color: #000000;
                    }
                }
            }
            .payment-right{
                width: calc(100% - 508px);
                .btn{
                    margin-bottom: 12px;
                }
                ::v-deep .el-button{
                    width: 100%;
                    height: 50px;
                    padding-top: 0;
                    padding-bottom: 0;
                    background: #585858;
                    border-radius: 5px 5px 5px 5px;
                    font-weight: 600;
                    font-size: 20px;
                    color: #FFFFFF;
                    white-space: normal !important;
                    word-break: break-word;
                }
                .code{
                    ::v-deep .el-input {
                        width: 100%;
                        height: 50px;
                        background: #FFFFFF;
                        .el-input__inner{
                            width: 100%;
                            height: 100%;
                            border-radius: 5px 0px 0px 5px;
                            border: 1px solid #E2E2E2;
                            font-weight: 400;
                            font-size: 20px;
                            color: #000000;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
    .content-footer{
        width: 100%;
        height: calc(100% - 728px);
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
        .code{
            width: calc(100% - 172px);
            height: 100%;
            border: 1px solid #707070;
            background-color: #FFFFFF;
            .code-row{
                width: 100%;
                height: 33.33%;
                display: flex;
                .item{
                    width: 25%;
                    height: 100%;
                    .item-in{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 400;
                        font-size: 24px;
                        color: #000000;
                        .iconfont{
                            font-size: 30px;
                        }
                    }
                }
            }
        }
        .btns{
            width: 152px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .btn{
                height: 30%;
                .el-button{
                    width: 100%;
                    height: 100%;
                    box-shadow: inset 0px 3px 6px 1px rgba(0,0,0,0.16);
                    border-radius: 5px 5px 5px 5px;
                    font-weight: 600;
                    font-size: 20px;
                    color: #FFFFFF;
                    white-space: normal !important;
                    word-break: break-word;
                }
                &.prerat .el-button{
                    background: #585858;
                }
                &.invoice .el-button{
                    background: #75B781;
                }
                &.tax .el-button{
                    background: #FF9300;
                }
            }
        }
    }
}
.border-r {
    position: relative;
}

.border-r::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #707070;
    content: "";
}
.border-b {
    position: relative;
}

.border-b::before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #707070;
    content: "";
}
</style>
