<template>
    <el-dialog :title="$t('allOrderDazhe')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent :hide-required-asterisk="true" ref="ruleForm" label-position="top">
                <el-form-item label="" prop="type">
                    <el-radio-group v-model="formData.type" @input="discountFocus">
                        <el-radio :label="101">{{ $t('zhekou') }}</el-radio>
                        <el-radio :label="102">{{ $t('markDown') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="discount">
                    <div class="discount">
                        <span class="sign">-</span>
                        <el-input
                            ref="discountRef"
                            v-model.trim="formData.discount"
                            @keyup.enter.native="submitForm()"
                            >
                        </el-input>
                        <span class="sign" v-if="formData.type === 101">%</span>
                        <span class="sign" v-else-if="formData.type === 102">€</span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       :disabled="disabled"
                       @click="submitForm()">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {validateFloat, validateInteger} from "@/utils/validate";
import {orderDiscount} from "@/api";
import {formatFloat} from "@/utils/common";

export default {
    name: "OrderDiscount",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        finalAmount: {
            type: Number,
            default: 0
        }
    },
    data() {
        const validatorFloat = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (this.formData.type === 101) {
                if (!validateInteger(value)) {
                    return callback(new Error(this.$t('disSupInteger')))
                }
                if (Number(value) >= 100) {
                    return callback(new Error(this.$t('inpNotRule')))
                }
            }
            if (this.formData.type === 102) {
                if (!validateFloat(value)) {
                    return callback(new Error(this.$t('inpNotRule')))
                }
                if (formatFloat(value) >= this.finalAmount) {
                    return callback(new Error(this.$t('inpNotRule')))
                }
            }
            callback();
        };
        return {
            dialogVisible: false,
            formData: {
                type: 101,
                discount: ''
            },
            rules: {
                type: [
                    { required: true, message: this.$t('selContentHint'), trigger: 'change' },
                ],
                discount: [
                    { required: true, validator: validatorFloat, trigger: 'blur' },
                ]
            },
            disabled: false
        };
    },
    // 计算属性
    computed: {},
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
            this.formData = {
                type: 101,
                discount: ''
            }
            this.discountFocus()
        },
        // 折扣框得到焦点
        discountFocus () {
            this.$nextTick(() => {
                this.$refs.discountRef.$el.querySelector('input').focus();
            })
        },
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.sendRequest()
                } else {
                    return false
                }
            })
        },
        
        // 发送
        sendRequest () {
            let params = {
                type: this.formData.type,
                discount: formatFloat(this.formData.discount)
            }
            this.disabled = true
            orderDiscount(params).then(res => {
                if (res.code === 20000) {
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
        resetForm () {
            this.$refs['ruleForm'].resetFields()
        },
        // 关闭弹窗
        dialogClose () {
            // 重置表单
            this.resetForm()
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
    margin-top: 20px;
    ::v-deep .el-form{
        .el-radio-group{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .el-radio{
                .el-radio__inner{
                    width: 26px;
                    height: 26px;
                }
                .el-radio__label{
                    font-weight: 400;
                    font-size: 26px;
                    color: #7B7B7B;
                }
                .el-radio__input.is-checked .el-radio__inner {
                    border-color: #387A45;
                    background: #387A45;
                }
            }
        }
        .discount{
            width: 100%;
            display: flex;
            justify-content: center;
            .sign{
                margin-left: 6px;
                margin-right: 6px;
                font-weight: 400;
                font-size: 30px;
                color: #000000;
            }
            .el-input{
                width: 134px;
                height: 50px;
                background: #FFFFFF;
                .el-input__inner{
                    width: 100%;
                    height: 100%;
                    border-radius: 5px 5px 5px 5px;
                    border: 1px solid #717171;
                    text-align: center;
                    font-weight: 400;
                    font-size: 30px;
                    color: #000000;
                }
            }
        }
        .el-form-item__error{
            right: 0;
            text-align: center;
        }
    }
}
</style>
