<template>
    <el-dialog :title="$t('swipingCard')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
           <p class="hint">
               <i class="star">*</i>
               {{ $t('amount') }}&nbsp;(Max: {{maxAmount}})
           </p>
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-position="top">
                <el-form-item label="" prop="amount">
                    <el-input
                        v-model="formData.amount"
                        ref="amountRef"
                        @keydown.enter.native="submitForm">
                        <template slot="append">€</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       :disabled="disabled"
                       @click="submitForm">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {validateFloat} from "@/utils/validate";
import {formatFloat, formatFloatFloor} from "@/utils/common";

export default {
    name: "SwipingCard",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        roundingAmount: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        let validatorAmount = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (!validateFloat(value)) {
                callback(new Error(this.$t('inpNotRule')))
            }
            if (formatFloat(value) > this.maxAmount) {
                callback(new Error(this.$t('inpNotRule')))
            }
            callback()
        };
        return {
            dialogVisible: false,
            maxAmount: 0,
            formData: {
                amount: ''
            },
            rules: {
                amount: [
                    { required: true, validator: validatorAmount, trigger: 'blur' }
                ]
            },
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
            if (this.roundingAmount) {
                this.maxAmount = Math.abs(this.roundingAmount)
            } else {
                this.maxAmount = 0
            }
            this.$nextTick(() => {
                this.formData.amount = this.maxAmount
                this.$refs.amountRef.$el.querySelector('input').focus();
            })
        },
    
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const amount = formatFloatFloor(this.formData.amount)
                    this.$emit('parent-update', amount)
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
    .hint{
        line-height: 35px;
        font-size: 14px;
        color: #606266;
        .star{
            color: #F56C6C;
            margin-right: 3px;
        }
    }
}
</style>
