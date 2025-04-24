<template>
    <el-dialog
        :title="$t('selectProduct')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="large-dialog"
        top="5vh">
        <div class="content">
            <el-table :data="productList" border style="width: 100%" row-key="id" :row-class-name="rowClassName" max-height="620">
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
                <el-table-column
                    prop="discountable"
                    align="center"
                    min-width="140"
                    :label="$t('ifPartDiscount')">
                    <template slot-scope="scope">
                        <span class="green" v-if="scope.row.discountable">{{ $t('yes') }}</span>
                        <span class="red" v-else>{{ $t('no') }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="110" fixed="right" :label="$t('handle')">
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

export default {
    name: "BarcodeProduct",
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
            itemRow: ''
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
            if (this.productList.length > 0) {
                this.itemRow = this.productList[0]
            } else {
                this.itemRow = null
            }
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
            const currentIndex = this.productList.findIndex(item => item.id === this.itemId)
            if (direction === 'up') {
                if (currentIndex <= 0) return;
                this.itemRow = this.productList[currentIndex - 1]
            } else if (direction === 'down') {
                if (currentIndex >= this.productList.length - 1) return;
                this.itemRow = this.productList[currentIndex + 1]
            }
        },
    
        // 选择
        chooseHandle (data) {
            this.itemRow = data
            this.confirmHandle()
        },
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
    ::v-deep .el-button--primary{
        background-color: #56A3D9;
    }
}
</style>
