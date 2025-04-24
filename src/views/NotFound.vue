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
                    class="close-app"
                    @click="closeApp">
                    {{ $t('closeApp') }}
                </el-button>
            </div>
        </div>
        <div class="container-main">
            <h2 class="title">404</h2>
            <img src="../assets/images/nonentity.png" alt="">
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {quitApp} from "@/utils/ipc";

export default {
    // 组件
    components: {},
    props: {},
    data() {
        return {};
    },
    // 计算属性
    computed: {
        ...mapState({
            shopName: state => state.shopInfo.name,   // 商家名称
            shopLogo: state => state.shopInfo.logo,   // 商家LOGO
        })
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
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
    },
    // 挂载完成
    mounted() {
    
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
        height: calc(100% - 68px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    
        .title {
            height: 80px;
            font-size: 48px;
            font-weight: 600;
            color: #b5bad2;
        }
    }
}
</style>
