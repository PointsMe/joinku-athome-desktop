<template>
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <div class="amounts">
                <el-tag
                    v-for="(item, index) in amountList"
                    :key="index"
                    closable
                    @close="handleClose(index)">
                    {{item.label}}
                </el-tag>
            </div>
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-position="top">
                <el-form-item :label="$t('amount')" prop="amount">
                    <el-col :span="20">
                        <el-input
                            v-model="formData.amount"
                            ref="amountRef"
                            @keydown.enter.native="submitForm">
                            <template slot="append">€</template>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:void(0)" class="icon" @click="submitForm">
                            <i class="el-icon-circle-plus-outline"></i>
                        </a>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       :disabled="disabled"
                       @click="confirmHandle">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {validateFloat} from "@/utils/validate";
import {countPropertyTotal, formatFloat, formatFloatFloor, formatUseDot} from "@/utils/common";

export default {
    name: "AmountCalculate",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        amountType: {
            type: String,
            default: ''
        }
    },
    data() {
        let validatorFloat = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (validateFloat(value)) {
                callback()
            } else {
                callback(new Error(this.$t('inpNotRule')))
            }
        };
        return {
            dialogVisible: false,
            cashAmounts: [],
            cardAmounts: [],
            formData: {
                amount: ''
            },
            rules: {
                amount: [
                    { required: true, validator: validatorFloat, trigger: 'blur' }
                ]
            },
            disabled: false
        };
    },
    // 计算属性
    computed: {
        amountList () {
            if (this.amountType === 'cash') {
                return this.cashAmounts
            } else if (this.amountType === 'card') {
                return this.cardAmounts
            } else {
                return []
            }
        },
        dialogTitle () {
            if (this.amountType === 'cash') {
                return this.$t('cash')
            } else if (this.amountType === 'card') {
                return this.$t('swipingCard')
            } else {
                return ''
            }
        }
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
            this.$nextTick(() => {
                this.$refs.amountRef.$el.querySelector('input').focus();
            })
        },
    
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const amount = formatFloat(this.formData.amount)
                    const label = `€${formatUseDot(this.formData.amount)}`
                    if (this.amountType === 'cash') {
                        this.cashAmounts.push({
                            label,
                            value: amount
                        })
                    } else if (this.amountType === 'card') {
                        this.cardAmounts.push({
                            label,
                            value: amount
                        })
                    }
                    this.formData.amount = ''
                } else {
                    return false
                }
            })
        },
        // 删除
        handleClose (index) {
            if (this.amountType === 'cash') {
                this.cashAmounts.splice(index, 1)
            } else if (this.amountType === 'card') {
                this.cardAmounts.splice(index, 1)
            }
        },
        // 确定
        confirmHandle () {
            const totalAmount = countPropertyTotal(this.amountList, 'value')
            this.$emit('parent-update', formatFloatFloor(totalAmount))
            this.dialogVisible = false
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
    .amounts{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .el-tag{
            margin: 4px 8px;
        }
    }
    ::v-deep .el-form{
        .el-form-item__label{
            padding-bottom: 0;
        }
    }
    .icon{
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        i{
            font-size: 26px;
            color: #146043;
            font-weight: 500;
        }
    }
}
</style>
