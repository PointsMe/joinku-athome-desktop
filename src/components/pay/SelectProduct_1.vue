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
            <div class="search">
                <div class="search-item">
                    <el-input
                        v-model="search.name"
                        :placeholder="$t('productName')"
                        clearable
                        @change="searchHandle">
                    </el-input>
                </div>
                <div class="search-item">
                    <el-cascader
                        :placeholder="$t('productClassify')"
                        filterable
                        :options="classifyOptions"
                        v-model="search.classifyId"
                        :props="cascaderProps"
                        clearable
                        @change="searchHandle">
                    </el-cascader>
                </div>
                <div class="search-handle">
                    <el-button type="primary" @click="searchHandle">{{$t('search')}}</el-button>
                    <el-button type="info" @click="emptyHandle">{{$t('empty')}}</el-button>
                </div>
            </div>
            <el-table :data="tableData" border style="width: 100%" row-key="id" max-height="520">
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
                            size="small"
                            @click="chooseHandle(scope.row)">
                            {{ $t('select') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="currentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
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
import {queryProductClassify, queryProductPage} from "@/api";

export default {
    name: "SelectProduct",
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
            classifyOptions: [],
            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children'
            },
            search: {
                name: '',
                classifyId: []
            },
            tableData: [],
            currentPage: 1,
            pageSize: 15,
            total: 0
        };
    },
    // 计算属性
    computed: {},
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
            this.emptyHandle()
            if (this.classifyOptions.length === 0) {
                this.getClassifyTree()
            }
        },
        // 查询列表
        getListData () {
            let classifyId = ''
            if (Array.isArray(this.search.classifyId) && this.search.classifyId.length > 0) {
                classifyId = this.search.classifyId.slice(-1)[0]
            }
            let params = {
                name: this.search.name,
                classifyId,
                page: this.currentPage,
                size: this.pageSize
            }
            queryProductPage(params).then(res => {
                if (res.code === 20000) {
                    this.total = res.data.total
                    this.tableData = res.data.list || []
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
        
        // 获取分类
        getClassifyTree() {
            queryProductClassify().then(res => {
                if (res.code === 20000) {
                    let resData = res.data || []
                    resData.forEach(item => {
                        if (item.children.length === 0) {
                            item.children = null
                        } else {
                            item.children.forEach(inItem => {
                                inItem.children = null
                            })
                        }
                    })
                    this.classifyOptions = resData
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
        
        // 搜索
        searchHandle () {
            this.currentPage = 1
            // 获取列表数据
            this.getListData()
        },
        // 清空
        emptyHandle () {
            this.search = {
                name: '',
                classifyId: []
            }
            this.currentPage = 1
            // 获取列表数据
            this.getListData()
        },
        // 点击分页
        currentChange (page) {
            this.currentPage = page
            // 获取列表数据
            this.getListData()
        },
        
        // 提交
        chooseHandle (data) {
            this.dialogVisible = false
            this.$emit('parent-update', data)
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
            margin-right: 5px;
            height: 54px;
            display: flex;
            align-items: center;
            ::v-deep .el-input{
                width: 200px;
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
}
</style>
