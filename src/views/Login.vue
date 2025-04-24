<template>
    <div class="container">
        <div class="container-header">
            <div class="header-left">
                <div class="logo">
                    <img :src="shopLogo" alt="" v-if="shopLogo">
                    <img src="../assets/images/logo2.png" alt="" v-else>
                </div>
                <p class="shop-name" v-if="shopName">{{ shopName }}</p>
                <p class="shop-name" v-else>{{ $t('systemName') }}</p>
            </div>
            <div class="header-right">
                <el-button
                    class="set"
                    @click="settingDialog = true"
                    v-if="ifLogin">
                    {{ $t('set') }}
                </el-button>
                <Language
                pageType="login" />
                <el-button
                    class="close-app"
                    @click="closeApp">
                    {{ $t('closeApp') }}
                </el-button>
            </div>
        </div>
        <div class="container-main">
            <component
                :is="currentTabComponent"
                @parent-update="componentUpdate">
            </component>
        </div>
        <div class="container-footer">
            <span class="text">{{$t('servicePhone')}}:&nbsp;39-3778849020</span>
            <span class="line"></span>
            <span class="text">{{$t('versionNo')}}:&nbsp;{{ version }}</span>
            <span class="line"></span>
            <span class="text">{{$t('localIp')}}:&nbsp;{{ localIp }}</span>
        </div>
        <Setting
            :showDialog="settingDialog"
            @parent-close="settingDialog = false"/>
    </div>
</template>

<script>
import Language from "@/components/Language";
// 系统设置
import SystenSet from "@/components/login/SystenSet";
// 激活
import Activate from "@/components/login/Activate";
// 登录表单
import LoginForm from "@/components/login/LoginForm";
// 设置
import Setting from "@/components/login/Setting";
import {queryLocalIP, queryMachineMac, quitApp} from "@/utils/ipc";
import {mapMutations, mapState} from "vuex";
import {queryShopDetail} from "@/api";
const REGION = require('@/assets/data/region.json')
export default {
    name: "Login",
    // 组件
    components: {
        Language,
        SystenSet,
        Activate,
        LoginForm,
        Setting
    },
    props: {},
    data() {
        return {
            currentTabComponent: '',
            version: process.env.VUE_APP_VERSION,
            ifLogin: false,
            settingDialog: false
        };
    },
    // 计算属性
    computed: {
        ...mapState(['localIp']),
        ...mapState({
            shopName: state => state.shopInfo.name,   // 商家名称
            shopLogo: state => state.shopInfo.logo,   // 商家LOGO
        }),
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        ...mapMutations(['saveLocalIp', 'saveShopInfo']),
        // 获取设备Mac
        getMachineMac () {
            queryMachineMac().then(res => {
                localStorage.setItem("machineMac", res)
            })
        },
        // 组件更新
        componentUpdate (name) {
            if (name === 'systenSet') {
                this.currentTabComponent = 'SystenSet'
            } else if (name === 'activate') {
                this.currentTabComponent = 'Activate'
            } else if (name === 'login') {
                this.currentTabComponent = 'LoginForm'
                this.ifLogin = true
                this.getShopInfo()
            }
        },
        // 获取门店信息
        getShopInfo () {
            queryShopDetail().then(res => {
                if (Number(res.code) === 20000) {
                    if (!res.data) return;
                    let countryCode = res.data.country || ''
                    let countryName = ''
                    let provinceCode = res.data.province || ''
                    let provinceName = ''
                    const currentCountry = REGION.find(item => item.code === countryCode)
                    if (currentCountry) {
                        countryName = currentCountry.name
                        const currentProvince = currentCountry.provinceList.find(item => item.code === provinceCode)
                        if (currentProvince) {
                            provinceName = currentProvince.name
                        }
                    }
                    this.saveShopInfo({
                        id: res.data.id,
                        name: res.data.name,
                        logo: res.data.logo,
                        companyName: res.data.companyName,
                        address: res.data.address,
                        zipcode: res.data.zipcode,
                        vatNumber: res.data.vatNumber,
                        taxCode: res.data.taxCode,
                        countryCode,
                        countryName,
                        provinceCode,
                        provinceName,
                        city: res.data.city,
                        companyCountry: res.data.country
                    })
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
    
        // 关闭应用
        closeApp () {
            this.$confirm(this.$t('closeAppHint'), this.$t('hint'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                quitApp()
            }).catch(() => {})
        }
    },
    // 创建完成
    created() {
        const localIp = queryLocalIP()
        this.saveLocalIp(localIp)
    },
    // 挂载完成
    mounted() {
        // 获取设备Mac
        if (localStorage.getItem("machineMac") === null) {
            this.getMachineMac()
        }
        if (!localStorage.getItem("systemBaseUrl")) {
            this.currentTabComponent = 'SystenSet'
        } else if (!JSON.parse(localStorage.getItem("ifActivate"))) {
            this.currentTabComponent = 'Activate'
        } else {
            this.currentTabComponent = 'LoginForm'
            this.ifLogin = true
            this.getShopInfo()
        }
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .container-header{
        width: 100%;
        height: 68px;
        padding-left: 26px;
        padding-right: 26px;
        display: flex;
        justify-content: space-between;
        .header-left{
            height: 100%;
            display: flex;
            align-items: center;
            .logo{
                width: 32px;
                height: 32px;
                border-radius: 50%;
                overflow: hidden;
            }
            .shop-name{
                margin-left: 20px;
                font-size: 24px;
                color: #1F1F1F;
            }
        }
        .header-right{
            height: 100%;
            display: flex;
            align-items: center;
            .set{
                margin-right: 12px;
                height: 31px;
                padding: 0 20px;
                background: #FFFFFF;
                border-radius: 5px 5px 5px 5px;
                font-weight: 500;
                font-size: 13px;
                color: #385548;
            }
            .close-app{
                margin-left: 20px;
                height: 31px;
                padding: 0 20px;
                background: #000000;
                border-radius: 5px 5px 5px 5px;
                font-weight: 500;
                font-size: 13px;
                color: #FFFFFF;
            }
        }
    }
    .container-main{
        width: 100%;
        height: calc(100% - 126px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .container-footer{
        width: 100%;
        height: 58px;
        display: flex;
        justify-content: center;
        align-items: center;
        .text{
            font-weight: 500;
            font-size: 13px;
            color: #7B7B7B;
        }
        .line{
            width: 1px;
            height: 14px;
            margin-left: 10px;
            margin-right: 10px;
            background-color: #7B7B7B;
        }
    }
}
</style>
