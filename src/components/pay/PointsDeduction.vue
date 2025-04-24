<template>
    <el-dialog :title="$t('pointDeduction')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('totalPoints')" prop="totalPoints">
                    <span>{{ formData.totalPoints }}</span>
                </el-form-item>
                <el-form-item :label="$t('availablePoints')" prop="availablePoints">
                    <span>{{ formData.availablePoints }}</span>
                </el-form-item>
                <el-form-item :label="$t('deductPoints')" prop="deductPoints">
                    <el-select
                        v-model="formData.deductPoints"
                        clearable
                        :placeholder="$t('selContentHint')">
                        <el-option
                            v-for="item in deductOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <p class="hint">
                        <span>{{ $t('minDeductCount') }}:&nbsp;{{ formData.minDeductCount }}</span>
                        <span>{{ $t('maxDeductCount') }}:&nbsp;{{ formData.maxDeductCount }}</span>
                    </p>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       size="small"
                       :disabled="disabled"
                       @click="submitForm('ruleForm')">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {mapMutations, mapState} from "vuex";
import {sessionPointsDeduct, updateUserName} from "@/api";

export default {
    name: "Username",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        pointsDiscount: {
            type: Object,
            default: () => ({
                enabled: false,
                totalPoints: 0,
                availablePoints: 0,
                deductPoints: 0,
                deductAmount: 0,
                deductFactor: 0,
                minDeductCount: 0,
                maxDeductCount: 0,
                maxDeductPercent: 0
            })
        }
    },
    data() {
        return {
            dialogVisible: false,
            formData: {
                totalPoints: '',
                availablePoints: '',
                deductPoints: '',
                minDeductCount: '',
                maxDeductCount: ''
            },
            rules:{
                deductPoints: [
                    { required: true, trigger: "change", message: this.$t('selContentHint') }
                ]
            },
            deductOptions:[],
            disabled: false
        };
    },
    // 计算属性
    computed: {
        ...mapState(['userName']),
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
        ...mapMutations(['saveUsername']),
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.formData = {
                totalPoints: this.pointsDiscount.totalPoints || 0,
                availablePoints: this.pointsDiscount.availablePoints || 0,
                deductPoints: this.pointsDiscount.deductPoints || '',
                minDeductCount: this.pointsDiscount.minDeductCount || 0,
                maxDeductCount: this.pointsDiscount.maxDeductCount || 0
            }
            this.formData.totalPoints = this.pointsDiscount.totalPoints || 0
            this.formData.availablePoints = this.pointsDiscount.availablePoints || 0
            this.formData.deductPoints = this.pointsDiscount.deductPoints || ''
            this.formData.minDeductCount = this.pointsDiscount.minDeductCount || 0
            this.formData.maxDeductCount = this.pointsDiscount.maxDeductCount || 0
            let deductFactor = this.pointsDiscount.deductFactor || 1
            let minDeductCount = this.formData.minDeductCount
            let maxDeductCount = this.formData.maxDeductCount > this.formData.availablePoints ? this.formData.availablePoints : this.formData.maxDeductCount
            let deductOptions = []
            // 找到范围内最小的符合条件的倍数
            let start = Math.ceil(minDeductCount / deductFactor) * deductFactor;
            for (let i = start; i <= maxDeductCount; i += deductFactor) {
                deductOptions.push(
                    {
                        label: i,
                        value: i
                    }
                )
            }
            this.deductOptions = deductOptions
            if (this.pointsDiscount.deductPoints) {
                this.formData.deductPoints = this.pointsDiscount.deductPoints
            } else if (deductOptions.length > 0) {
                this.formData.deductPoints = deductOptions.slice(-1)[0].value
            } else {
                this.formData.deductPoints = ''
            }
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
            let params = {
                deductPoints: this.formData.deductPoints
            }
            this.disabled = true
            sessionPointsDeduct(params).then(res => {
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
::v-deep .el-form{
    .el-select{
        width: 100%;
    }
}
.hint{
    font-size: 13px;
    line-height: 18px;
    color: #505050;
    span:first-of-type{
        margin-right: 20px;
    }
}
</style>
