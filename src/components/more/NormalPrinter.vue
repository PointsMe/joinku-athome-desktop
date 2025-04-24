<template>
    <el-dialog :title="$t('norPrinterSet')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('ipPort')" key="ip" prop="ip">
                    <el-input v-model.trim="formData.ip"></el-input>
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

export default {
    name: "NormalPrinter",
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
                ip: ''
            },
            rules: {},
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
            // 打印机设置
            this.formData.ip = localStorage.getItem("normalPrinterIp") || ''
        },
        // 验证表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    localStorage.setItem("normalPrinterIp", this.formData.ip);
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
    ::v-deep .el-form{
        .el-select{
            width: 100%;
        }
    }
}
</style>
