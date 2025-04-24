<template>
    <el-dialog :title="$t('userNameEdit')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('username')" prop="username">
                    <el-input v-model="formData.username" @keyup.enter.native="submitForm()"></el-input>
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

import {mapMutations, mapState} from "vuex";
import { updateUserName} from "@/api";

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
        return {
            dialogVisible: false,
            formData: {
                username: ''
            },
            rules: {
                username: [
                    { required: true, message: this.$t('inpContentHint'), trigger: "blur" }
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
        ...mapMutations(['saveUsername']),
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.formData.username = this.userName
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
                username: this.formData.username.trim()
            }
            this.disabled = true
            updateUserName(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.saveUsername(this.formData.username)
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
