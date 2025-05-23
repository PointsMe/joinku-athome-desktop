<template>
    <el-dialog :title="$t('tempoProduct')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-width="auto">
                <!--<el-form-item :label="$t('productName')" prop="name">-->
                <!--    <el-input v-model="formData.name" ref="temporaryName"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('sellPrice')" prop="price">
                    <el-input
                        v-model.trim="formData.price"
                        id="temporary_price"
                        ref="priceRef"
                        @keydown.native="priceKeydown">
                        <template slot="append">€</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="IVA" prop="taxRate">
                    <el-select v-model="formData.taxRate" ref="taxRateRef" filterable @keyup.enter.native="submitForm()">
                        <el-option
                            v-for="item in taxRateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model.trim="formData.taxRate" @keyup.enter.native="submitForm()">-->
                    <!--    <template slot="append">%</template>-->
                    <!--</el-input>-->
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       size="small"
                       :disabled="disabled"
                       @click="submitForm()">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {validateZeroFloat} from "@/utils/validate";
import {formatFloat} from "@/utils/common";
import {mapState} from "vuex";

export default {
    name: "Username",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        }
    },
    data() {
        let validatorFloat = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (validateZeroFloat(value)) {
                callback()
            } else {
                callback(new Error(this.$t('inpNotRule')))
            }
        };
        return {
            dialogVisible: false,
            taxRateOptions: [],
            formData: {
                name: this.$t('tempoProduct'),
                price: '',
                taxRate: ''
            },
            rules: {
                // name: [
                //     { required: true, message: this.$t('inpContentHint'), trigger: "blur" }
                // ],
                price: [
                    { required: true, validator: validatorFloat, trigger: 'blur' }
                ],
                taxRate: [
                    { required: true, validator: validatorFloat, trigger: 'blur' }
                ]
            },
            disabled: false
        };
    },
    // 计算属性
    computed: {
        ...mapState({
            companyCountry: state => state.shopInfo.companyCountry   // 国家
        }),
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
            if (this.companyCountry === 'ES'){
                this.formData.taxRate = 21
            } else {
                this.formData.taxRate = 22
            }
            this.$nextTick(() => {
                this.$refs.priceRef.$el.querySelector('input').focus();
            })
        },
    
        // 价格
        priceKeydown (event) {
            if (event.key === 'Tab') {
                this.$refs.taxRateRef.$el.querySelector('input').focus();
            } else if (event.key === 'Enter') {
                this.submitForm()
            }
        },
        
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$emit('parent-update', {
                        name: this.formData.name.trim(),
                        price: formatFloat(this.formData.price),
                        taxRate: formatFloat(this.formData.taxRate)
                    })
                    this.dialogVisible = false
                } else {
                    return false
                }
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
        if (this.companyCountry === 'ES') {
            this.taxRateOptions = [
                {
                    value: 21,
                    label: '21%'
                },
                {
                    value: 11,
                    label: '11%'
                },
                {
                    value: 10,
                    label: '10%'
                },
                {
                    value: 5.2,
                    label: '5.2%'
                },
                {
                    value: 4,
                    label: '4%'
                },
                {
                    value: 0,
                    label: '0%'
                }
            ]
        } else {
            this.taxRateOptions = [
                {
                    value: 22,
                    label: '22%'
                },
                {
                    value: 10,
                    label: '10%'
                },
                {
                    value: 5.2,
                    label: '5.2%'
                },
                {
                    value: 0,
                    label: '0%'
                }
            ]
        }
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
::v-deep .el-form{
    .el-select{
        width: 100%;
    }
}
</style>
