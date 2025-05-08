<template>
    <div class="card">
        <div class="logo">
            <img src="../../assets/images/logo.png" alt="">
        </div>
        <el-form :model="formData" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="auto">
            <el-form-item :label="$t('wkno')" prop="number">
                <el-input
                    v-model.trim="formData.number"
                    :placeholder="$t('inpWknoHint')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('password')" prop="password">
                <el-input
                    v-model.trim="formData.password"
                    :placeholder="$t('inpPwdHint')"
                    show-password
                    @keyup.enter.native="submitForm()"></el-input>
            </el-form-item>
        </el-form>
        <div class="form-handle">
            <el-button type="primary" :disabled="disabled" @click="submitForm()">{{ $t('login') }}</el-button>
        </div>
    </div>
</template>

<script>
import {accountLogin} from "@/api";
import {mapMutations} from "vuex";
import {createMenu} from "@/utils/generateMenu";

export default {
    name: "LoginForm",
    // 组件
    components: {},
    props: {},
    data() {
        return {
            formData: {
                number: '',
                password: ''
            },
            rules: {
                number: [
                    { required: true,  message:this.$t('inpWknoHint'), trigger: "blur" }
                ],
                password: [
                    { required: true,  message:this.$t('inpPwdHint'), trigger: "blur" }
                ]
            },
            disabled: false,
        };
    },
    // 计算属性
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        ...mapMutations(['saveUserInfo']),
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
        // 激活
        sendRequest () {
            let params = {
                number: this.formData.number,
                password: this.formData.password
            }
            this.disabled = true
            accountLogin(params).then(res => {
                if (res.code === 20000) {
                    // 保存登录账号
                    localStorage.setItem("loginAccount", this.formData.number)
                    sessionStorage.setItem('token', res.data.token)
                    if (!res.data.user) return
                    const perms = res.data.user.perms
                    if (!Array.isArray(perms) || perms.length === 0) {
                        this.$message({
                            showClose: true,
                            message: this.$t('autNotHint'),
                            type: 'warning'
                        })
                        return;
                    }
                    this.saveUserInfo({
                        name: res.data.user.name,
                        number: res.data.user.number,
                        perms
                    })
                    // 创建菜单
                    createMenu()
                    // 路由跳转
                    this.$router.replace({ path: "/" });
                } else if (res.code === 30001) {
                    // 未激活
                    localStorage.setItem('ifActivate', JSON.stringify(false));
                    // 刷新页面
                    location.reload();
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
        this.formData.number = localStorage.getItem("loginAccount") || ''
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.card{
    width: 420px;
    .logo{
        width: 100%;
        height: 206px;
        display: flex;
        justify-content: center;
        img{
            width: 158px;
            height: 206px;
        }
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
