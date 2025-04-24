<template>
    <div class="card">
        <h3 class="card-title">{{ $t('networkSet') }}</h3>
        <el-form :model="formData" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="auto">
            <el-form-item label="SID" prop="sid">
                <el-input v-model.trim="formData.sid"></el-input>
            </el-form-item>
            <el-form-item label="Licence" prop="licence">
                <el-input v-model.trim="formData.licence"></el-input>
            </el-form-item>
        </el-form>
        <div class="form-handle">
            <el-button type="primary" :disabled="disabled" @click="submitForm('ruleForm')">{{ $t('confirm') }}</el-button>
            <el-button @click="goBack">{{ $t('back') }}</el-button>
        </div>
        <!-- 同步 -->
        <Sync
            :showDialog="syncDialog"
            @parent-update="syncFinished"
            @parent-close="syncDialog = false"/>
    </div>
</template>

<script>

import {systemActivate} from "@/api";
import {mapState} from "vuex";
import Sync from "@/components/Sync";

export default {
    name: "Activate",
    // 组件
    components: {
        Sync
    },
    props: {},
    data() {
        return {
            formData: {
                sid: '',
                licence: ''
            },
            rules: {
                sid: [
                    { required: true,  message:this.$t('inpContentHint'), trigger: "blur" }
                ],
                licence: [
                    { required: true,  message:this.$t('inpContentHint'), trigger: "blur" }
                ]
            },
            disabled: false,
            syncDialog: false
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
        // 激活
        sendRequest () {
            let params = {
                sid: this.formData.sid,
                licence: this.formData.licence
            }
            this.disabled = true
            systemActivate(params).then(res => {
                if (res.code === 20000) {
                    // 已激活
                    localStorage.setItem('ifActivate', JSON.stringify(true));
                    this.syncDialog = true
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
    
        // 同步完成
        syncFinished () {
            this.$emit('parent-update', 'login')
        },
        // 返回
        goBack () {
            this.$emit('parent-update', 'systenSet')
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        this.formData.ip = this.localIp
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.card{
    width: 420px;
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
        flex-direction: column;
        align-items: center;
        ::v-deep .el-button{
            width: 356px;
            height: 50px;
            font-weight: 400;
            font-size: 18px;
            margin-left: 0;
            margin-bottom: 12px;
        }
    }
}
</style>
