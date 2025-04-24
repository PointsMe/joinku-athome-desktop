<template>
    <el-dialog :title="$t('passwordEdit')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('oldPassword')" prop="oldPassword">
                    <el-input v-model.trim="formData.oldPassword"></el-input>
                </el-form-item>
                <el-form-item :label="$t('newPassword')" prop="newPassword">
                    <el-input v-model.trim="formData.newPassword" @keyup.enter.native="submitForm()"></el-input>
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

import {mapState} from "vuex";
import { updateUserPassword} from "@/api";

export default {
    name: "Password",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            dialogVisible: false,
            formData: {
                oldPassword: '',
                newPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: this.$t('inpPwdHint'), trigger: "blur" }
                ],
                newPassword: [
                    { required: true, message: this.$t('inpPwdHint'), trigger: "blur" }
                ],
            },
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
        // 初始化数据
        initData () {
            this.dialogVisible = true
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
                oldPassword: this.formData.oldPassword,
                newPassword: this.formData.newPassword
            }
            this.disabled = true
            updateUserPassword(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
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
