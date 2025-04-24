<template>
    <el-dialog
        :title="$t('codelessProduct')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="medium-dialog"
        top="5vh">
        <div class="content">
            <div class="search">
                <div class="search-item">
                    <el-input
                        ref="nameRef"
                        v-model="productName"
                        :placeholder="$t('productName')"
                        clearable>
                    </el-input>
                </div>
            </div>
            <el-table :data="tableData" border style="width: 100%" row-key="id" :row-class-name="rowClassName" max-height="520">
                <el-table-column
                    prop="name"
                    min-width="160"
                    align="center"
                    :label="$t('productName')">
                </el-table-column>
                <el-table-column
                    prop="price"
                    min-width="120"
                    align="center"
                    :label="$t('sellPrice')">
                    <template slot-scope="scope">
                        <el-input
                            v-model="scope.row.price"
                            size="small">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="122" fixed="right" :label="$t('handle')">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            @click="chooseHandle(scope.row)">
                            {{ $t('select') }}
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

import {validateZeroFloat} from "@/utils/validate";
import {formatFloat} from "@/utils/common";

export default {
    name: "SelectProduct",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        productList: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            dialogVisible: false,
            productName: '',
            itemRow: null
        };
    },
    // 计算属性
    computed: {
        tableData () {
            if (!this.productName) return this.productList;
            return this.productList.filter((item) => String(item.name).toLowerCase().includes(this.productName.toLowerCase()));
        },
        itemId () {
            if (this.itemRow) {
                return this.itemRow.id
            } else {
                return ''
            }
        }
    },
    // 监控data中的数据变化
    watch: {
        showDialog (val) {
            if (val) {
                this.initData()
            }
        },
        tableData (val) {
            if (val.length > 0) {
                this.itemRow = val[0]
            } else {
                this.itemRow = null
            }
        }
    },
    // 方法集合
    methods: {
        // 裁减图片
        cutImage (url, w = 50) {
            if (!url) return ''
            let suffix = url.substring(url.lastIndexOf('.'))
            return `${url}_${w}-${suffix}`
        },
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.productName = ''
            this.$nextTick(() => {
                this.$refs.nameRef.$el.querySelector('input').focus();
            })
        },
    
        // 自定义行名称
        rowClassName ({row, rowIndex}) {
            if (row.id === this.itemId) {
                return 'active-row'
            } else {
                return ''
            }
        },
    
        // 切换行
        toogleRow (direction) {
            const currentIndex = this.tableData.findIndex(item => item.id === this.itemId)
            if (direction === 'up') {
                if (currentIndex <= 0) return;
                this.itemRow = this.tableData[currentIndex - 1]
            } else if (direction === 'down') {
                if (currentIndex >= this.tableData.length - 1) return;
                this.itemRow = this.tableData[currentIndex + 1]
            }
        },
        
        // 选择
        chooseHandle (data) {
            this.itemRow = data
            this.confirmHandle()
        },
        confirmHandle () {
            if (!this.itemId) return;
            if (!validateZeroFloat(this.itemRow.price)) {
                this.$message({
                    showClose: true,
                    message: this.$t('inpNotRule'),
                    type: 'warning'
                })
                return
            }
            const price = formatFloat(this.itemRow.price)
            this.$emit('parent-update', {
                ...this.itemRow,
                price
            })
            this.dialogVisible = false
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
        display: flex;
        .search-item{
            margin-right: 5px;
            height: 54px;
            display: flex;
            align-items: center;
            ::v-deep .el-input{
                width: 300px;
                height: 40px;
            }
        }
        .search-handle{
            height: 54px;
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
