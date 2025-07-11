<template>
    <el-dialog
        :title="$t('checkStock')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="large-dialog"
        top="5vh">
        <div class="content">
            <div class="search">
                <div class="search-item">
                    <el-input
                        v-model="keyword"
                        ref="keywordRef"
                        :placeholder="$t('proKeySerch')"
                        clearable
                        @input.native="keywordDebounce">
                    </el-input>
                </div>
            </div>
            <div class="table" style="height: 520px;">
                <el-table :data="tableData" border style="width: 100%" row-key="id" :row-class-name="rowClassName" max-height="520">
                    <el-table-column
                        align="center"
                        min-width="240"
                        :label="$t('nameCode')">
                        <template slot-scope="scope">
                            <div class="table-info">
                                <div class="picture">
                                    <el-image :src="cutImage(scope.row.image, 50)" fit="cover" v-if="scope.row.image">
                                        <div slot="error" class="image-slot">
                                            <img src="../../assets/images/default.png" />
                                        </div>
                                    </el-image>
                                    <img src="../../assets/images/default.png" v-else />
                                </div>
                                <div class="desc">
                                    <p class="desc-text">{{scope.row.name}}</p>
                                    <p class="desc-text">{{scope.row.code}}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="barcode"
                        align="center"
                        min-width="160"
                        :label="$t('productBarcode')">
                    </el-table-column>
                    <el-table-column
                        prop="sellPrice"
                        min-width="120"
                        align="center"
                        :label="$t('sellPrice')">
                    </el-table-column>
                    <el-table-column
                        prop="stock"
                        align="center"
                        min-width="100"
                        :label="$t('stock')">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="discountable"
                        align="center"
                        min-width="140"
                        :label="$t('ifPartDiscount')">
                        <template slot-scope="scope">
                            <span class="green" v-if="scope.row.discountable">{{ $t('yes') }}</span>
                            <span class="red" v-else>{{ $t('no') }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" min-width="110" fixed="right" :label="$t('handle')">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="small"
                                @click="chooseHandle(scope.row)">
                                {{ $t('select') }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
import {searchProductList} from "@/api";
import {Debounce} from "@/utils/common";

export default {
    name: "FindProduct",
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
            keyword: '',
            tableData: [],
            itemRow: null,
        };
    },
    // 计算属性
    computed: {
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
            this.keyword = ''
            this.itemRow = null
            this.$nextTick(() => {
                this.$refs.keywordRef.$el.querySelector('input').focus();
            })
        },
        // 搜索商品
        keywordDebounce: Debounce(function () {
            if (!this.keyword) {
                return
            }
            let params = {
                keyword: this.keyword
            }
            searchProductList(params).then(res => {
                if (Number(res.code) === 20000) {
                    this.tableData = res.data || []
                    if (this.tableData.length > 0) {
                        this.itemRow = this.tableData[0]
                    } else {
                        this.itemRow = null
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
        }, 500),
    
        // 自定义行名称
        rowClassName ({row, rowIndex}) {
            if (row.id === this.itemId) {
                return 'active-row'
            } else {
                return ''
            }
        },
        
        // 切换行
        toggleRow (direction) {
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
        // 确定
        confirmHandle () {
            if (!this.itemId) return;
            this.$emit('parent-update', this.itemRow)
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
        display: flex;
        flex-wrap: wrap;
        .search-item{
            height: 54px;
            display: flex;
            align-items: center;
            ::v-deep .el-input{
                width: 320px;
                height: 40px;
            }
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
    .active-row{
        background-color: #CCE8CF;
    }
    .pagination{
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
