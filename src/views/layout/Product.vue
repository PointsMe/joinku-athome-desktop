<template>
    <div class="container">
        <div class="container-header">
            <div class="search">
                <div class="search-item">
                    <el-cascader
                        ref="inputRef0"
                        :placeholder="$t('productClassify')"
                        filterable
                        :options="classifyOptions"
                        v-model="search.classifyId"
                        :props="cascaderProps"
                        clearable
                        @change="searchHandle"
                        @keydown.native="inputKeydown">
                    </el-cascader>
                </div>
                <div class="search-item">
                    <el-input
                        ref="inputRef1"
                        data-attr="searchInput"
                        data-index="1"
                        v-model="search.name"
                        :placeholder="$t('productName')"
                        clearable
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
                <div class="search-item">
                    <el-input
                        ref="inputRef2"
                        data-attr="searchInput"
                        data-index="2"
                        v-model="search.code"
                        :placeholder="$t('productCode')"
                        clearable
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
                <div class="search-item">
                    <el-input
                        ref="inputRef3"
                        data-attr="searchInput"
                        data-index="3"
                        v-model="search.barcode"
                        :placeholder="$t('productBarcode')"
                        clearable
                        @input.native="barcodeDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
                <div class="search-handle">
                    <el-button type="info" @click="emptyHandle">{{$t('empty')}}</el-button>
                </div>
            </div>
            <div class="header-right">
                <el-button
                    type="success"
                    :disabled="syncDisabled"
                    @click="syncHandle">
                    {{ $t('productSync') }}
                </el-button>
            </div>
        </div>
        <div class="container-main">
            <div class="table" ref="tableContainer">
                <el-table
                    :data="tableData"
                    border
                    row-key="id"
                    :row-class-name="rowClassName"
                    @row-click="rowClick"
                    :max-height="tableHeight"
                    style="width: 100%;">
                    <el-table-column
                        prop="barcode"
                        align="center"
                        min-width="180"
                        :label="$t('productBarcode')">
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        align="center"
                        min-width="180"
                        :label="$t('productCode')">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        min-width="180"
                        :label="$t('productName')">
                    </el-table-column>
                    <el-table-column
                        prop="sellPrice"
                        align="center"
                        min-width="120"
                        :label="$t('sellPrice') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="stock"
                        align="center"
                        min-width="120"
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
                    <el-table-column align="center" min-width="120" :label="$t('handle')" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="editHandle(scope.row.id);">
                                {{ $t('edit') }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑 -->
        <Edit
            :showDialog="editDialog"
            :itemId="itemId"
            @parent-update="getListData"
            @parent-close="editDialog = false"/>
        <!-- 进度条 -->
        <SyncProgress
            :showDialog="progressDialog"/>
    </div>
</template>

<script>
import {queryProductClassify, queryProductPage, syncPlatformData} from "@/api";
// 编辑
import Edit from "@/components/product/Edit";
// 同步进度条
import SyncProgress from "@/components/SyncProgress";
import {Debounce} from "@/utils/common";

export default {
    name: "Product",
    // 组件
    components: {
        Edit,
        SyncProgress
    },
    props: {},
    data() {
        return {
            classifyOptions: [],
            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children'
            },
            search: {
                name: '',
                classifyId: [],
                code: '',
                barcode: ''
            },
            tableHeight: 560,
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 15,
            syncDisabled: false,
            itemId: '',
            itemIndex: 0,
            editDialog: false,
            progressDialog: false
        };
    },
    // 计算属性
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 获取表格高度
        getTableHeight () {
            if (this.$refs.tableContainer) {
                const tableHeight = this.$refs.tableContainer.offsetHeight
                this.$nextTick(() => {
                    this.tableHeight = tableHeight
                });
            }
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
    
        // 自动搜素
        inputDebounce: Debounce(function () {
                this.searchHandle()
        }, 500),
        // 自动搜素
        barcodeDebounce: Debounce(function () {
            if (!this.search.barcode || this.search.barcode.length < 6) {
                return
            }
            this.searchHandle()
        }, 200),
        
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
                classifyId: [],
                code: '',
                barcode: ''
            }
            this.currentPage = 1
            // 获取列表数据
            this.getListData()
        },
        
        // 获取列表数据
        getListData () {
            let classifyId = ''
            if (Array.isArray(this.search.classifyId) && this.search.classifyId.length > 0) {
                classifyId = this.search.classifyId.slice(-1)[0]
            }
            let params = {
                classifyId,
                name: this.search.name,
                code: this.search.code,
                barcode: this.search.barcode,
                page: this.currentPage,
                size: this.pageSize
            }
            queryProductPage(params).then(res => {
                if (res.code === 20000) {
                    this.total = res.data.total
                    this.tableData = res.data.list || []
                    if (this.tableData.length > 0) {
                        const currentItem = this.tableData.find(item => item.id === this.itemId)
                        if (currentItem === undefined) {
                            this.itemIndex = 0
                            this.itemId = this.tableData[0].id
                        }
                    } else {
                        this.itemIndex = 0
                        this.itemId = ''
                    }
                    // 检验是否列表为空
                    if (this.tableData.length === 0 && this.currentPage > 1) {
                        this.currentPage--
                        this.getListData()
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
        
        // 点击分页
        handleCurrentChange (page) {
            this.currentPage = page
            // 获取列表数据
            this.getListData()
        },
    
        // 自定义行名称
        rowClassName ({row, rowIndex}) {
            if (row.id === this.itemId) {
                return 'active-row'
            } else {
                return ''
            }
        },
        // 点击行
        rowClick (row, column) {
            this.itemIndex = this.tableData.indexOf(row);
            this.itemId = row.id
        },
        
        // 编辑
        editHandle (id) {
            this.itemId = id
            this.editDialog = true
        },
        
        // 商品同步
        syncHandle () {
            this.sendSync()
            this.progressDialog = true
        },
        sendSync () {
            let params = {
                name: 'gms.pcs.psp'
            }
            syncPlatformData(params).then(res => {
                if(res.code === 20000){
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                    this.getListData()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.progressDialog = false
            })
        },
        
        // 监听按键
        handleKeydown(event) {
            if (!event.ctrlKey && event.key === 'ArrowUp') {
                this.toogleCheckedItem('up')
            } else if (!event.ctrlKey && event.key === 'ArrowDown') {
                this.toogleCheckedItem('down')
            } else if (event.ctrlKey && event.key === 'F7') {
                if (!this.itemId) {
                    this.$message({
                        showClose: true,
                        message: this.$t('notOperProduct'),
                        type: 'warning'
                    })
                    return;
                }
                this.editDialog = true
            } else if (!event.ctrlKey && event.key === 'Tab') {
                if (event.target.dataset.attr !== 'searchInput' || !event.target.dataset.index) return;
                event.preventDefault();
                const index = Number(event.target.dataset.index)
                // 前移
                const prevRef = index <= 0 ? 'inputRef0' : `inputRef${index - 1}`
                this.$refs[prevRef].$el.querySelector('input').focus();
            } else if (event.ctrlKey && event.key === 'Tab') {
                if (event.target.dataset.attr !== 'searchInput' || !event.target.dataset.index) return;
                const index = Number(event.target.dataset.index)
                // 后移
                const nextRef = index >= 3 ? 'inputRef3' : `inputRef${index + 1}`
                this.$refs[nextRef].$el.querySelector('input').focus();
            }
        },
        inputKeydown (event) {
            event.preventDefault();
            if (event.ctrlKey && event.key === 'Tab') {
                this.$refs['inputRef1'].$el.querySelector('input').focus();
            }
        },
        // 调整选中项
        toogleCheckedItem (direction) {
            if (direction === 'up') {
                if (this.itemIndex === 0) return;
                this.itemIndex--
            } else if (direction === 'down') {
                if (this.itemIndex === this.tableData.length - 1) return;
                this.itemIndex++
            }
            this.itemId =  this.tableData[this.itemIndex].id
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        // 获取数据列表
        this.getListData()
        // 获取分类
        this.getClassifyTree()
        // 获取表格高度
        this.getTableHeight()
        // 条码框得到焦点
        this.$nextTick(() => {
            this.$refs.inputRef3.$el.querySelector('input').focus();
        })
        // 监听键盘事件
        window.addEventListener("keydown", this.handleKeydown);
    },
    // 销毁之前
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeydown);
    }
};
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    padding: 20px 0 20px 20px;
    display: flex;
    flex-direction: column;
    .container-header{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
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
        .header-right{
            padding-right: 12px;
            height: 54px;
            display: flex;
            align-items: center;
        }
    }
    .container-main{
        width: 100%;
        flex-grow: 1;
        background-color: #fff;
        .table{
            height: calc(100% - 60px);
            ::v-deep .el-table{
                .el-table__header{
                    .el-table__cell{
                        min-height: 50px;
                    }
                    .cell{
                        font-weight: 500;
                        font-size: 18px;
                        color: #2E3B2C;
                    }
                }
                .el-table__body{
                    .el-table__cell{
                        min-height: 50px;
                        background-color: transparent;
                    }
                    .cell{
                        font-weight: 400;
                        font-size: 16px;
                        color: #000000;
                    }
                }
                .el-button{
                    font-size: 15px;
                    color: #FFFFFF;
                }
            }
        }
        .pagination{
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
        }
    }
}
</style>
