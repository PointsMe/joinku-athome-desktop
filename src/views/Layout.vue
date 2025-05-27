<template>
    <div class="layout">
        <div class="layout-aside" v-show="showLayoutAside || routeName !== 'Pay'">
            <LayoutAside
            ref="layoutAside"/>
        </div>
        <div class="layout-main">
            <keep-alive :include="keepList">
                <router-view />
            </keep-alive>
        </div>
        <!-- 密码 -->
        <Password
            :showDialog="passwordDialog"
            @parent-close="passwordDialog = false"/>
    </div>
</template>

<script>
import LayoutAside from "@/components/layout/LayoutAside";
// 密码
import Password from "@/components/more/Password";
import {mapMutations, mapState} from "vuex";
import {queryDojoConfig, queryOrderPaymode} from "@/api";

export default {
    name: "Layout",
    // 组件
    components: {
        LayoutAside,
        Password
    },
    props: {},
    data() {
        return {
            keepList: [],
            passwordDialog: false
        };
    },
    // 计算属性
    computed: {
        ...mapState(['showLayoutAside', 'routeName']),
    },
    // 监控data中的数据变化
    watch: {
        $route: {
            handler(to) {
                this.saveRouteName(to.name)
            },
            immediate: true
        }
    },
    // 方法集合
    methods: {
        ...mapMutations(['saveRouteName', 'savePaymodes', 'saveLayoutAside', 'saveDojoConfig']),
        
        // 获取订单支付方式
        getOrderPaymode () {
            queryOrderPaymode().then(res => {
                if (Number(res.code) === 20000) {
                    const paymodes = res.data || []
                    this.savePaymodes(paymodes)
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
    
        // 获取Dojo配置
        getDojoConfig () {
            queryDojoConfig().then(res => {
                if (Number(res.code) === 20000) {
                    const resData = res.data
                    if (!resData) {
                        this.saveDojoConfig({
                            enabled: false,
                            apiKey: '',
                            resellerId: '',
                            softwareHouseId: '',
                            version: ''
                        })
                        return
                    }
                    this.saveDojoConfig({
                        enabled: resData.enabledDojo,
                        apiKey: resData.dojoApiKey,
                        resellerId: resData.dojoResellerId,
                        softwareHouseId: resData.dojoSoftwareHouseId,
                        version: resData.dojoVersion
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
    
        // 监听按键
        handleLayoutKeydown(event) {
            if (!event.ctrlKey && event.key === 'F4') {  // 修改密码
                this.showPassword()
            } else if (event.altKey && event.key === 'F8') {  //  日总结
                this.$refs.layoutAside.getTotalStats()
            } else if (event.ctrlKey && event.key === 'F8') {  //  员工日总结
                this.$refs.layoutAside.getEmployeeStats()
            } else if (event.ctrlKey && event.key === 's') {
                if (this.routeName === 'Pay') return;
                this.skipPage('Pay')
            } else if (event.ctrlKey && event.key === 'd') {
                if (this.routeName === 'Order') return;
                if (!this.showLayoutAside) {
                    this.saveLayoutAside(true)
                }
                this.skipPage('Order')
            } else if (event.ctrlKey && event.key === 't') {
                if (this.routeName === 'Refund') return;
                if (!this.showLayoutAside) {
                    this.saveLayoutAside(true)
                }
                this.skipPage('Refund')
            } else if (event.ctrlKey && event.key === 'k') {
                if (!this.showLayoutAside) {
                    this.saveLayoutAside(true)
                }
                if (this.routeName === 'Product') return;
                this.skipPage('Product')
            } else if (event.ctrlKey && event.key === 'h') {
                if (this.routeName === 'Member') return;
                if (!this.showLayoutAside) {
                    this.saveLayoutAside(true)
                }
                this.skipPage('Member')
            } else if (event.ctrlKey && event.key === 'm') {
                if (this.routeName === 'More') return;
                if (!this.showLayoutAside) {
                    this.saveLayoutAside(true)
                }
                this.skipPage('More')
            }
        },
        
        // 显示修改密码
        showPassword () {
            this.passwordDialog = true
        },
        // 跳转页面
        skipPage (name) {
            this.$router.push({ name })
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        // 获取订单支付方式
        this.getOrderPaymode()
        // 获取Dojo配置
        this.getDojoConfig()
        // 监听键盘事件
        window.addEventListener("keydown", this.handleLayoutKeydown);
    },
    // 销毁之前
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleLayoutKeydown);
    }
};
</script>

<style lang="scss" scoped>
.layout{
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    background-color: #F0EFEF;
    .layout-aside{
        width: 150px;
        height: 100%;
        flex-shrink: 0;
    }
    .layout-main{
        flex-grow: 1;
        height: 100%;
        overflow-x: hidden;
    }
}
</style>
