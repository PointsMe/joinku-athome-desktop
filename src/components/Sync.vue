<template>
    <el-dialog :title="$t('syncData')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="percentage"
                :color="color">
            </el-progress>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button
                type="primary"
                       size="mini"
                       :disabled="disabled"
                       @click="refreshHandle">{{ $t('refreshSync') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>

import {querySyncProgress, syncPlatformData} from "@/api";

export default {
    name: "Sync",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            dialogVisible: false,
            timer: null,
            percentage: 0,
            color: '#f56c6c',
            disabled: false
        };
    },
    // 计算属性
    computed: {
    
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
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.startSyncData()
            this.startTimer()
        },
        // 定时器
        startTimer () {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.getSyncProgress()
            this.timer = setInterval(() => {
                this.getSyncProgress()
            }, 1000)
        },
        // 开始同步
        startSyncData () {
            syncPlatformData({}).then(res => {
                if(res.code === 20000){
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    })
                    this.$emit('parent-update')
                    this.dialogVisible = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
    
        // 获取同步进度
        getSyncProgress () {
            querySyncProgress().then(res => {
                if(res.code === 20000){
                    this.percentage = res.data >= 100 ? 99 : res.data
                    if (res.data <= 20){
                        this.color = '#f56c6c';
                    } else if (res.data <= 40 && res.data > 20){
                        this.color = '#e6a23c';
                    } else if (res.data <= 60 && res.data > 40){
                        this.color = '#1989fa';
                    } else if (res.data <= 80 && res.data > 60){
                        this.color = '#6f7ad3';
                    } else if (res.data < 100 && res.data > 80){
                        this.color = '#6fd3d0';
                    } else if (res.data >= 100){ //下载完成隐藏且关闭轮询
                        this.color = '#5cb87a';
                        if (this.timer) {
                            clearInterval(this.timer)
                        }
                    }
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
    
        // 刷新
        refreshHandle () {
            this.startSyncData()
            this.startTimer()
        },
        
        // 关闭弹窗
        dialogClose () {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.$emit('parent-close')
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
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
};
</script>

<style lang="scss" scoped>
.content{
    padding: 36px 0;
}
</style>
