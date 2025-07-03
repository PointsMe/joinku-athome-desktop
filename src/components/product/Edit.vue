<template>
    <el-dialog :title="$t('editProduct')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               top="5vh"
               custom-class="medium-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" label-position="top" ref="ruleForm" label-width="auto">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('productName')" prop="name">
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('productBarcode')" prop="barcode">
                            <el-input v-model.trim="formData.barcode"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('purchasePrice')" prop="purchasePrice">
                            <el-input v-model.trim="formData.purchasePrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('productCode')" prop="code">
                            <el-input v-model.trim="formData.code"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('alias')" prop="alias">
                            <el-input v-model="formData.alias"></el-input>
                        </el-form-item>
                        <!--<el-form-item :label="$t('stock')" prop="stock">-->
                        <!--    <el-input v-model.trim="formData.stock"></el-input>-->
                        <!--</el-form-item>-->
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="$t('sellPrice')" prop="sellPrice">
                            <el-input v-model.trim="formData.sellPrice"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('promotionalPrice')" prop="promotionalPrice">
                            <el-input v-model.trim="formData.promotionalPrice" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('invoicePrice')" prop="invoicePrice">
                            <el-input v-model.trim="formData.invoicePrice" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('wholesalePrice')" prop="wholesalePrice">
                            <el-input v-model.trim="formData.wholesalePrice" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('deliveryPrice')" prop="deliveryPrice">
                            <el-input v-model.trim="formData.deliveryPrice" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('friendlyPrice')" prop="friendlyPrice">
                            <el-input v-model.trim="formData.friendlyPrice" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('memberPrice')" prop="memberPrice">
                            <el-input v-model.trim="formData.memberPrice" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('internetPrice')" prop="internetPrice">
                            <el-input v-model.trim="formData.internetPrice" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('specialPrice')" prop="specialPrice">
                            <el-input v-model.trim="formData.specialPrice" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="$t('ifPartDiscount')" prop="discountable">
                    <el-radio-group v-model="formData.discountable">
                        <el-radio :label="true">{{ $t('yes') }}</el-radio>
                        <el-radio :label="false">{{ $t('no') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
                @click="dialogVisible = false">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="primary"
                :disabled="disabled"
                @click="submitForm('ruleForm')">
                {{ $t('save') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {queryProductDetail, updateProduct} from "@/api";
import {validateFloat, validateZeroFloat} from "@/utils/validate";
import {formatFloat} from "@/utils/common";

export default {
    name: "Edit",
    // 组件
    components: {},
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
        let validatorFloat = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (validateFloat(value)) {
                callback()
            } else {
                callback(new Error(this.$t('inpNotRule')))
            }
        };
        let validatorZeroFloat = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (validateZeroFloat(value)) {
                callback()
            } else {
                callback(new Error(this.$t('inpNotRule')))
            }
        };
        const validatorNullFloat = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback()
            }
            if (validateFloat(value)) {
                callback()
            } else {
                callback(new Error(this.$t('inpNotRule')))
            }
        };
        return {
            dialogVisible: false,
            formData: {
                name: '',
                code: '',
                barcode: '',
                stock: 0,
                alias: '',
                purchasePrice: '',
                sellPrice: '',
                wholesalePrice: '',
                memberPrice: '',
                promotionalPrice: '',
                deliveryPrice: '',
                internetPrice: '',
                invoicePrice: '',
                friendlyPrice: '',
                specialPrice: '',
                discountable: true
            },
            rules: {
                name: [{ required: true, message: this.$t('inpContentHint'), trigger: "blur" }],
                // stock: [{ required: true, validator: validatorStock, trigger: 'blur' }],
                purchasePrice: [{ required: true, validator: validatorZeroFloat, trigger: 'blur' }],
                sellPrice: [{ required: true, validator: validatorFloat, trigger: 'blur' }],
                wholesalePrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                memberPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                promotionalPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                deliveryPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                internetPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                invoicePrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                friendlyPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
                specialPrice: [{ required: false, validator: validatorNullFloat, trigger: 'blur' }],
            },
            priceEnums: [
                {
                    type: 101,
                    value: 'wholesalePrice'
                },
                {
                    type: 102,
                    value: 'memberPrice'
                },
                {
                    type: 103,
                    value: 'promotionalPrice'
                },
                {
                    type: 104,
                    value: 'deliveryPrice'
                },
                {
                    type: 105,
                    value: 'internetPrice'
                },
                {
                    type: 106,
                    value: 'invoicePrice'
                },
                {
                    type: 107,
                    value: 'friendlyPrice'
                },
                {
                    type: 108,
                    value: 'specialPrice'
                }
            ],
            disabled: false
        };
    },
    // 计算属性
    computed: {
    
    },
    // 监控data中的数据变化
    watch: {
        showDialog (val) {
            if (val) {
                this.initData()
            }
        },
    },
    // 方法集合
    methods: {
        // 初始化数据
        initData () {
            this.dialogVisible = true
            if (this.itemId) {
                this.$nextTick(() => {
                    this.getDetail()
                })
            }
        },
        
        // 获取详情
        getDetail () {
            let params = {
                id: this.itemId
            }
            queryProductDetail(params).then(res => {
                if (res.code === 20000) {
                    const resData = res.data
                    // 价格
                    let otherPrices = resData.otherPrices || []
                    let wholesalePrice = '';
                    let memberPrice = '';
                    let promotionalPrice = '';
                    let deliveryPrice = '';
                    let internetPrice = '';
                    let invoicePrice = '';
                    let friendlyPrice = '';
                    let specialPrice = '';
                    otherPrices.forEach(item => {
                        if (item.price || item.price === 0) {
                            let currentPrice = this.priceEnums.find(inItem => {
                                return inItem.type === item.type
                            })
                            if (currentPrice !== undefined) {
                                if (currentPrice.value === 'wholesalePrice') {
                                    wholesalePrice = item.price
                                } else if (currentPrice.value === 'memberPrice') {
                                    memberPrice = item.price
                                } else if (currentPrice.value === 'promotionalPrice') {
                                    promotionalPrice = item.price
                                } else if (currentPrice.value === 'deliveryPrice') {
                                    deliveryPrice = item.price
                                } else if (currentPrice.value === 'internetPrice') {
                                    internetPrice = item.price
                                } else if (currentPrice.value === 'invoicePrice') {
                                    invoicePrice = item.price
                                } else if (currentPrice.value === 'friendlyPrice') {
                                    friendlyPrice = item.price
                                } else if (currentPrice.value === 'specialPrice') {
                                    specialPrice = item.price
                                }
                            }
                        }
                    })
                    this.formData = {
                        name: resData.name,
                        code: resData.code,
                        barcode: resData.barcode,
                        stock: resData.stock,
                        alias: resData.alias || '',
                        purchasePrice: resData.purchasePrice,
                        sellPrice: resData.sellPrice,
                        wholesalePrice,
                        memberPrice,
                        promotionalPrice,
                        deliveryPrice,
                        internetPrice,
                        invoicePrice,
                        friendlyPrice,
                        specialPrice,
                        discountable: resData.discountable
                    }
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
        
        // 验证表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendRequest()
                } else {
                    return false
                }
            })
        },
        // 发送
        sendRequest () {
            // 价格
            let otherPrices = []
            this.priceEnums.forEach(item => {
                if (this.formData[item.value] || this.formData[item.value] === 0) {
                    otherPrices.push({
                        type: item.type,
                        price: formatFloat(this.formData[item.value])
                    })
                }
            })
            let params = {
                id: this.itemId,
                name: this.formData.name.trim(),
                code: this.formData.code,
                barcode: this.formData.barcode,
                // stock: this.formData.stock,
                alias: this.formData.alias.trim(),
                purchasePrice: formatFloat(this.formData.purchasePrice),
                sellPrice: formatFloat(this.formData.sellPrice),
                otherPrices,
                discountable: this.formData.discountable
            }
            this.disabled = true
            updateProduct(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.$emit('parent-update')
                    this.dialogVisible = false
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
                this.disabled = false
            })
        },
        // 重置表单
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        // 关闭弹窗
        dialogClose () {
            // 重置表单
            this.resetForm('ruleForm')
            this.$emit('parent-close')
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
    
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
.content{
    max-height: 660px;
    overflow-x: hidden;
    overflow-y: auto;
    ::v-deep .el-form{
        .el-form-item{
            .el-form-item__label{
                padding-bottom: 0;
            }
            .el-radio-group{
                .el-radio{
                    .el-radio__label{
                        font-weight: 400;
                        font-size: 15px;
                        color: #7B7B7B;
                    }
                    .el-radio__input.is-checked .el-radio__inner {
                        border-color: #387A45;
                        background: #387A45;
                    }
                }
            }
        }
    }
}
</style>
