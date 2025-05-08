<template>
    <div class="card">
        <h3 class="card-title">{{ $t('networkSet') }}</h3>
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
        <div class="form-handle">
            <el-button type="primary" :disabled="disabled" @click="submitForm('ruleForm')">{{ $t('save') }}</el-button>
        </div>
        
    </div>
</template>

<script>
import {validateIp, validatePort} from "@/utils/validate";
import {checkUrlEnabled} from "@/api";
import {mapState} from "vuex";

export default {
    name: "SystemSet",
    // 组件
    components: {},
    props: {},
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
            formData: {
                ip: '',
                port: '14741'
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
    computed: {
        ...mapState(['localIp'])
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
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
        // 校验地址
        sendRequest () {
            let ip = this.formData.ip.trim();
            let port = this.formData.port.trim();
            // 系统设置
            let baseUrl = `http://${ip}:${port}`;
            this.disabled = true
            checkUrlEnabled(baseUrl).then(res => {
                if (res.code === 20000) {
                    // 保存系统设置
                    localStorage.setItem("systemIP", ip);
                    localStorage.setItem("systemPort", port);
                    localStorage.setItem("systemBaseUrl", baseUrl);
                    if (res.data) {
                        // 已激活
                        localStorage.setItem('ifActivate', JSON.stringify(true));
                        this.$emit('parent-update', 'login')
                    } else {
                        // 未激活
                        localStorage.setItem('ifActivate', JSON.stringify(false));
                        this.$emit('parent-update', 'activate')
                    }
                } else if (res.code === 30001) {
                    // 保存系统设置
                    localStorage.setItem("systemIP", ip);
                    localStorage.setItem("systemPort", port);
                    localStorage.setItem("systemBaseUrl", baseUrl);
                    // 未激活
                    localStorage.setItem('ifActivate', JSON.stringify(false));
                    this.$emit('parent-update', 'activate')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.disabled = false
            })
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        // 系统设置
        this.formData.ip = localStorage.getItem("systemIP") || this.localIp
        this.formData.port = localStorage.getItem("systemPort") || '14741'
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.card{
    width: 560px;
    .card-title{
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 36px;
        color: #1F1F1F;
        line-height: 50px;
        text-align: center;
    }
    ::v-deep .el-form{
        margin-top: 50px;
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
    .form-handle{
        padding-top: 25px;
        width: 100%;
        display: flex;
        justify-content: center;
        ::v-deep .el-button{
            width: 356px;
            height: 50px;
            background: #397533;
            border-radius: 3px 3px 3px 3px;
            border: 1px solid #397533;
            font-weight: 400;
            font-size: 18px;
            color: #FFFFFF;
        }
    }
}
</style>
