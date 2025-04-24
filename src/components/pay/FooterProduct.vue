<template>
    <div class="footer-content">
        <div class="footer-left">
            <div class="search">
                <el-input
                    ref="keywords"
                    v-model="keywords"
                    id="scan_barcode"
                    @input.native="barcodeDebounce"
                    @keydown.native="keywordKeydown"
                    :placeholder="$t('productBarcode')"
                    clearable>
                </el-input>
                <el-button @click="productDialog = true">{{ $t('checkStock') }}</el-button>
                <el-button @click="codelessDialog = true">{{ $t('more') }}</el-button>
                <el-button @click="temporaryDialog = true">{{ $t('tempoProduct') }}</el-button>
            </div>
            <div class="list">
                <div class="item" v-for="item in fastCodelessList" :key="item.id">
                    <a href="javascript:void(0)" class="item-in" @click="clickCodeless(item)">
                        <span class="name">{{ item.name }}</span>
                        <span class="price">€&nbsp;{{ item.price }}</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-right">
            <div class="handle">
                <el-button type="primary" @click="openCashboxHandle">{{ $t('cashBox') }}</el-button>
            </div>
        </div>
        <!-- 选择商品 -->
        <FindProduct
            :showDialog="productDialog"
            ref="productRef"
            @parent-update="productUpdate"
            @parent-close="productClose" />
        <!-- 选择条码相同商品 -->
        <BarcodeProduct
            :showDialog="barcodeDialog"
            :productList="barcodeList"
            ref="barcodeRef"
            @parent-update="productUpdate"
            @parent-close="barcodeClose" />
        <!-- 无码商品 -->
        <CodelessProduct
            :showDialog="codelessDialog"
            :productList="codelessList"
            ref="codelessRef"
            @parent-update="clickCodeless"
            @parent-close="codelessClose" />
        <!-- 临时商品 -->
        <Temporary
            :showDialog="temporaryDialog"
            @parent-update="clickCodeless"
            @parent-close="temporaryClose" />
    </div>
</template>

<script>
// 选择商品
import FindProduct from "./FindProduct";
// 选择条码相同商品
import BarcodeProduct from "./BarcodeProduct";
// 无码商品
import CodelessProduct from "./CodelessProduct";
// 临时商品
import Temporary from "@/components/pay/Temporary";

import {
    addCartCodeless,
    addCartProduct, deleteCartProduct, orderDiscount,
    queryBarcodeProduct,
    queryCodelessProduct, updateCartProductCount,
    updateCartProductPrice
} from "@/api";
import {Debounce, formatFloat, formatUseFloat} from "@/utils/common";
import {validateFloat, validateInteger} from "@/utils/validate";
export default {
    name: "FooterProduct",
    // 组件
    components: {
        FindProduct,
        BarcodeProduct,
        CodelessProduct,
        Temporary,
    },
    props: {
        itemId: {
            type: String,
            default: ''
        },
        itemPrice: {
            type: Number,
            default: 0
        },
        orderData: {
            type: [Object, null],
            default: null
        }
    },
    data() {
        return {
            keywords: '',
            codelessList: [],
            productDialog: false,
            barcodeList: [],
            barcodeDialog: false,
            codelessDialog: false,
            temporaryDialog: false,
            count: 1,
            downCtrl: false,
        };
    },
    // 计算属性
    computed: {
        fastCodelessList () {
            if (this.codelessList.length <= 6) {
                return this.codelessList
            }  else {
                return this.codelessList.filter((item, index) => index < 6)
            }
        },
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 获取无码商品
        getCodelessProduct () {
            queryCodelessProduct().then(res => {
                if (Number(res.code) === 20000) {
                    this.codelessList = res.data || []
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
    
        // 点击无码商品
        clickCodeless (data) {
            let params = {
                name: data.name,
                sellPrice: data.price,
                taxRate: data.taxRate,
            }
            addCartCodeless(params).then(res => {
                if (Number(res.code) === 20000) {
                    this.$refs.keywords.$el.querySelector('input').focus();
                    // 添加商品
                    this.$emit('add-product', '')
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
        
        // 扫描条形码
        barcodeDebounce: Debounce(function () {
            if (!this.keywords || this.keywords.length < 6) {
                return
            }
            let params = {
                barcode: this.keywords
            }
            queryBarcodeProduct(params).then(res => {
                if (Number(res.code) === 20000) {
                    if (Array.isArray(res.data) && res.data.length === 1) {
                        this.productUpdate(res.data[0]);
                    } else if (Array.isArray(res.data) && res.data.length > 1) {
                        this.barcodeList = res.data
                        this.barcodeDialog = true
                    } else {
                        this.$message({
                            showClose: true,
                            message: this.$t('notFoundProduct'),
                            type: 'error'
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
            }).finally(() => {
                this.keywords = ''
                this.downCtrl = false
            })
        }, 100),
        
        // 添加商品
        productUpdate (data) {
            let params = {
                productId: data.id,
                count: this.count
            }
            addCartProduct(params).then(res => {
                if (Number(res.code) === 20000) {
                    // 添加商品
                    this.$emit('add-product', data.id)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            }).finally(() => {
                this.count = 1
                // 扫码框得到焦点
                this.scanCodeFocus()
            })
        },
    
        // 关闭商品框
        productClose () {
            this.productDialog = false
            this.scanCodeFocus()
        },
        barcodeClose () {
            this.barcodeDialog = false
            this.scanCodeFocus()
        },
        codelessClose () {
            this.codelessDialog = false
            this.scanCodeFocus()
        },
        temporaryClose () {
            this.temporaryDialog = false
            this.scanCodeFocus()
        },
        // 扫码框得到焦点
        scanCodeFocus () {
            this.$refs.keywords.$el.querySelector('input').focus();
        },
    
        // 开钱箱
        openCashboxHandle () {
            this.$emit('open-cashbox')
        },
    
        // 监听关键字输入框按键按下
        keywordKeydown (event) {
            if (event.ctrlKey) {
                this.downCtrl = true
            }
            if (event.key === '+') {
                let count = this.keywords
                if (validateFloat(count)) {
                    event.preventDefault();
                    this.count = formatFloat(count)
                    this.keywords = ''
                }
            } else if (event.key === 'Pause') {
                let count = this.keywords
                if (count === '0') {
                    event.preventDefault();
                    this.productDelete()
                    this.keywords = ''
                } else if (validateFloat(count)) {
                    event.preventDefault();
                    this.productCountChange(formatFloat(count))
                    this.keywords = ''
                }
            } else if (event.key === '/') {
                let value = this.keywords
                if (!validateFloat(value) || formatFloat(value) > 100) return;
                event.preventDefault();
                let val = formatUseFloat(value, 4)
                if (this.downCtrl) {
                    this.orderDiscount(val)
                } else {
                    this.productPriceChange(formatUseFloat(this.itemPrice * (1 - val / 100), 4))
                }
                this.keywords = ''
            } else if (event.key === 'PageUp') {
                let value = this.keywords
                if (!validateFloat(value)) return;
                event.preventDefault();
                this.productPriceChange(formatFloat(value))
                this.keywords = ''
            }
        },
        // 改数量
        productCountChange (count) {
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
        // 改价
        productPriceChange (price) {
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
        // 订单折扣
        orderDiscount (discount) {
            let params = {
                type: 101,
                discount
            }
            orderDiscount(params).then(res => {
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
            }).finally(() => {
                this.downCtrl = false
            })
        },
        // 切换弹框选中行
        toogleCheckedRow (direction) {
            if (this.productDialog) {
                this.$refs.productRef.toogleRow(direction)
            }
            if (this.barcodeDialog) {
                this.$refs.barcodeRef.toogleRow(direction)
            }
            if (this.codelessDialog) {
                this.$refs.codelessRef.toogleRow(direction)
            }
        },
        // 弹框选中项确定
        dialogRowConfirm () {
            if (this.productDialog) {
                this.$refs.productRef.confirmHandle()
            }
            if (this.barcodeDialog) {
                this.$refs.barcodeRef.confirmHandle()
            }
            if (this.codelessDialog) {
                this.$refs.codelessRef.confirmHandle()
            }
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        // 获取无码商品
        this.getCodelessProduct()
        // 扫码框得到焦点
        this.$nextTick(() => {
            this.scanCodeFocus()
        })
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.footer-content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .footer-left {
        flex-grow: 1;
        .search {
            display: flex;
            align-items: center;
            ::v-deep .el-input {
                width: 340px;
                height: 50px;
                background: #FFFFFF;
                margin-right: 20px;
                .el-input__inner{
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    border: 1px solid #385548;
                }
            }
            ::v-deep .el-button{
                height: 50px;
                padding: 0 20px;
                border-radius: 5px 5px 5px 5px;
                border: 1px solid #385548;
                font-weight: 400;
                font-size: 20px;
                color: #385548;
            }
        }
        
        .list {
            margin-top: 12px;
            width: 100%;
            display: flex;
            .item{
                width: 120px;
                height: 82px;
                margin-right: 12px;
                .item-in{
                    width: 100%;
                    height: 100%;
                    padding: 4px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #FFFFFF;
                    border-radius: 5px;
                    border: 1px solid #385548;
                }
                .name{
                    font-weight: 400;
                    font-size: 19px;
                    color: #385548;
                    line-height: 22px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    text-overflow: ellipsis;
                }
                .price{
                    margin-top: 4px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 500;
                    font-size: 18px;
                    color: #385548;
                }
                &:last-of-type{
                    margin-right: 0;
                }
            }
        }
    }
    .footer-right{
        flex-shrink: 0;
        padding-top: 10px;
        .handle{
            margin-top: 9px;
            ::v-deep .el-button{
                width: 152px;
                height: 127px;
                padding: 0 6px;
                background: #146043;
                font-weight: 600;
                font-size: 25px;
                color: #FFFFFF;
                white-space: normal !important;
                word-break: break-word;
            }
        }
    }
}
</style>
