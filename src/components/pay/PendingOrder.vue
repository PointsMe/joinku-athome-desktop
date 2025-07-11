<template>
    <el-dialog
        :title="$t('pendOrderList')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="large-dialog"
        top="5vh">
        <div class="content">
            <el-table :data="tableData" border style="width: 100%" row-key="sessionId" :row-class-name="rowClassName" max-height="600">
                <el-table-column
                    prop="finalAmount"
                    align="center"
                    min-width="140"
                    :label="$t('total') + ' (€)'">
                </el-table-column>
                <el-table-column
                    prop="totalDiscountAmount"
                    min-width="140"
                    align="center"
                    :label="$t('orderDiscount') + ' (€)'">
                </el-table-column>
                <el-table-column
                    prop="price"
                    min-width="160"
                    align="center"
                    :label="$t('pendOrderTime')">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | filterTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    min-width="140"
                    align="center"
                    :label="$t('remark')">
                </el-table-column>
                <el-table-column align="center" min-width="200" fixed="right" :label="$t('handle')">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="small"
                            @click="recoverHandle(scope.row.sessionId)">
                            {{ $t('recover') }}
                        </el-button>
                        <el-button
                            size="small"
                            @click="cancelHandle(scope.row.sessionId)">
                            {{ $t('invalid') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button
                size="small"
                @click="dialogVisible = false">{{ $t('close') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {cancelPendingOrder, queryPendingOrderList, recoverPendingOrder} from "@/api";

export default {
    name: "PendingOrder",
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
            tableData: [],
            itemId: ''
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
            this.itemId = ''
            this.getOrderList()
        },
    
        // 获取订单列表
        getOrderList () {
            queryPendingOrderList().then(res => {
                if (Number(res.code) === 20000) {
                    this.tableData = res.data || []
                    if (this.tableData.length > 0) {
                        this.itemId = this.tableData[0].sessionId
                    } else {
                        this.itemId = ''
                    }
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
    
        // 自定义行名称
        rowClassName ({row, rowIndex}) {
            if (row.sessionId === this.itemId) {
                return 'active-row'
            } else {
                return ''
            }
        },
    
        // 切换行
        toggleRow (direction) {
            const currentIndex = this.tableData.findIndex(item => item.sessionId === this.itemId)
            if (direction === 'up') {
                if (currentIndex <= 0) return;
                this.itemId = this.tableData[currentIndex - 1].sessionId
            } else if (direction === 'down') {
                if (currentIndex >= this.tableData.length - 1) return;
                this.itemId = this.tableData[currentIndex + 1].sessionId
            }
        },
        
        // 恢复
        recoverHandle (id) {
            this.itemId = id
            this.sendRecover()
        },
        sendRecover () {
            if (!this.itemId) return;
            let params = {
                sessionId: this.itemId
            }
            recoverPendingOrder(params).then(res => {
                if (Number(res.code) === 20000) {
                    this.$emit('recover-pending')
                    this.dialogVisible = false
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
        
        // 作废
        cancelHandle (id) {
            this.itemId = id
            this.sendCancel()
        },
        sendCancel () {
            if (!this.itemId) return;
            let params = {
                sessionId: this.itemId
            }
            cancelPendingOrder(params).then(res => {
                if (Number(res.code) === 20000) {
                    this.getOrderList()
                    this.$emit('recover-pending')
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
        // 关闭弹窗
        dialogClose () {
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
    }
};
</script>

<style lang="scss" scoped>
.content{
    .search{
        width: 100%;
        height: 60px;
        display: flex;
        .search-item{
            display: flex;
            align-items: center;
            margin-right: 20px;
            ::v-deep .el-input{
                width: 180px;
                margin-left: 5px;
            }
        }
        .search-handle{
            display: flex;
            align-items: center;
        }
    }
    .table-info {
        width: 100%;
        display: flex;
        align-items: center;
        .picture {
            width: 50px;
            height: 50px;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            .el-image{
                width: 100%;
                height: 100%;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .desc {
            flex-grow: 1;
            padding-left: 10px;
            .desc-text {
                font-size: 14px;
                color: #272727;
                line-height: 20px;
                text-align: left;
            }
        }
    }
    .pagination{
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    ::v-deep .el-button--primary{
        background-color: #56A3D9;
    }
}
</style>
