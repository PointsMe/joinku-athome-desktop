<template>
    <div class="upgrade" v-if="upgradeShow">
        <div class="content" v-show="upgradeHint">
            <div class="content-head">
                <p class="text">{{ $t('upgradeHint.hintMessage') }}</p>
            </div>
            <div class="content-handle">
                <el-button @click="upgradeShow = false">{{ $t('upgradeHint.cancel') }}</el-button>
                <el-button type="primary" @click="upgradeStart">{{ $t('upgradeHint.confirm') }}</el-button>
            </div>
        </div>
        <div class="progress" v-show="!upgradeHint">
            <h3 class="progress-title">{{ $t('progress') }}</h3>
            <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="currentRate"
                color="#328969">
            </el-progress>
        </div>
    </div>
</template>

<script>
import {queryVersionInfo} from "@/api";
import { ipcRenderer } from 'electron'
export default {
    name: "Upgrade",
    // 组件
    components: {},
    props: {},
    data() {
        return {
            upgradeShow: false,
            upgradeAddress: '',
            timer: null,
            speed: 12*60*60*1000,
            currentRate: 0,
            upgradeHint: true,
        };
    },
    // 计算属性
    computed: {
    
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 开启定时器
        startTimer() {
            // 先清除定时器
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            // 系统设置
            const systemBaseUrl = localStorage.getItem("systemBaseUrl")
            if (!systemBaseUrl) return
            // 查询版本信息
            this.getVersionInfo(true)
            this.timer = setInterval(() => {
                this.getVersionInfo(false)
            }, this.speed)
        },
        // 查询版本信息
        getVersionInfo(b = false) {
            queryVersionInfo()
                .then((res) => {
                    if (res.code === 20000) {
                        if (!res.data) return;
                        if (!res.data.descFileUrl) return;
                        const systemBaseUrl = localStorage.getItem("systemBaseUrl")
                        this.upgradeAddress = `${systemBaseUrl}/api/v1/system/desktop/download/`
                        if (res.data.forcible && b) {
                            this.upgradeStart()
                        } else {
                            this.upgradeHint = true
                        }
                        // 打开提示信息
                        this.upgradeShow = true
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        })
                    }
                }).catch(err => {
                this.$message.error(err);
            })
        },
        // 更新
        upgradeStart () {
            this.upgradeHint = false
            this.currentRate = 0
            // 向主进程发送开始更新
            ipcRenderer.send('upgrade-start', this.upgradeAddress);
            // 监听主进程获取版本信息
            // ipcRenderer.on('checking-for-upgrade', () => {
            //     console.log('获取成功')
            // })
            // 监听主进程更新失败
            ipcRenderer.on('upgrade-error', () => {
                this.$message({
                    showClose: true,
                    message: this.$t('upgradeHint.error'),
                    type: 'error'
                });
                this.upgradeShow = false
            })
            // 监听主进程更新可用
            ipcRenderer.on('upgrade-available', () => {
                console.log('更新可用')
            })
            // 监听主进程更新不可用
            ipcRenderer.on('upgrade-not-available', () => {
                this.$message({
                    showClose: true,
                    message: this.$t('upgradeHint.notAvailable'),
                    type: 'error'
                });
                this.upgradeShow = false
            })
            // 更新下载进度事件
            ipcRenderer.on('download-progress', (event, obj) => {
                this.currentRate = Number(obj.percent.toFixed(2)) || 0;
            })
            // 更新下载完成
            ipcRenderer.on('upgrade-downloaded', () => {
                this.upgradeShow = false
            })
        },
    },
    // 创建完成
    created() {
    
    },
    // 挂载完成
    mounted() {
        // 开启用餐信息定时器
        this.startTimer()
    },
    // 销毁之前
    beforeDestroy() {
        // 清除定时器
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }
};
</script>

<style lang="scss" scoped>
.upgrade{
    z-index: 9999;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(24, 24, 24, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
        width: 400px;
        border-radius: 36px;
        background-color: #FFFFFF;
        padding: 32px;
        .content-head{
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            .text{
                padding-left: 20px;
                font-size: 22px;
                font-family: Roboto Bold, Roboto;
                font-weight: bold;
                color: #181818;
                line-height: 25px;
                //word-break: break-all;
            }
        }
        .content-handle{
            width: 100%;
            padding-top: 24px;
            display: flex;
            justify-content: center;
        }
    }
    .progress{
        width: 400px;
        border-radius: 36px;
        background-color: #FFFFFF;
        padding: 32px;
        .progress-title{
            height: 60px;
            font-size: 18px;
            color: #181818;
            text-align: center;
        }
    }
}
</style>
