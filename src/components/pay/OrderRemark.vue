<template>
    <el-dialog :title="$t('orderRemark')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-position="top">
                <el-form-item label="" prop="remark">
                    <el-input
                        v-model="formData.remark"
                        ref="remarkRef"
                        type="textarea"
                        :placeholder="$t('inpContentHint')"
                        rows="3"
                        maxlength="300"
                        show-word-limit
                        @keyup.enter.native="submitForm()"
                    />
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

import {updateOrderRemark} from "@/api";

export default {
    name: "OrderRemark",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        orderRemark: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            formData: {
                remark: ''
            },
            rules: {},
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
            this.formData.remark = this.orderRemark
            this.$nextTick(() => {
                this.$refs.remarkRef.$el.querySelector('textarea').focus();
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
                remark: this.formData.remark.trim()
            }
            this.disabled = true
            updateOrderRemark(params).then(res => {
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

</style>
