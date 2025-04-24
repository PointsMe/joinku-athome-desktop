<template>
    <el-dialog :title="$t('set')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="medium-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('intranetIp')" prop="ip">
                    <el-input v-model.trim="formData.ip">
                        <template slot="prepend">Http://</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('intranetPort')" prop="port">
                    <el-input v-model.trim="formData.port"></el-input>
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

import {validateIp, validatePort} from "@/utils/validate";

export default {
    name: "Setting",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        }
    },
    data() {
        const validatorIp = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (!validateIp(value)) {
                return callback(new Error(this.$t('inpNotRule')))
            }
            callback();
        };
        const validatorPort = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(this.$t('inpContentHint')));
            }
            if (!validatePort(value)) {
                return callback(new Error(this.$t('inpNotRule')))
            }
            callback();
        };
        return {
            dialogVisible: false,
            formData: {
                ip: '',
                port: ''
            },
            rules: {
                ip: [
                    { required: true, validator: validatorIp, trigger: 'blur' },
                ],
                port: [
                    { required: true, validator: validatorPort, trigger: 'blur' },
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
            // 系统设置
            this.formData.ip = localStorage.getItem("systemIP") || ''
            this.formData.port = localStorage.getItem("systemPort") || '14741'
        },
        
        // 验证表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let ip = this.formData.ip.trim();
                    let port = this.formData.port.trim();
                    // 系统设置
                    let baseUrl = `http://${ip}:${port}`;
                    // 保存系统设置
                    localStorage.setItem("systemIP", ip);
                    localStorage.setItem("systemPort", port);
                    localStorage.setItem("systemBaseUrl", baseUrl);
                    // 刷新页面
                    location.reload();
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
    ::v-deep .el-form{
        .el-form-item__label{
            font-weight: 400;
            font-size: 24px;
            color: #1F1F1F;
            line-height: 34px;
        }
        .el-input{
            height: 34px;
            .el-input-group__prepend{
                font-size: 24px;
            }
            .el-input__inner{
                font-size: 24px;
            }
        }
    }
}
</style>
