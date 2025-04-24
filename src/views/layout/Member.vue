<template>
    <div class="container">
        <div class="container-header">
            <div class="search">
                <div class="search-item">
                    <el-input
                        v-model="search.keyword"
                        :placeholder="$t('nameNumMobile')"
                        clearable
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
            </div>
            <div class="header-right">
                <el-button
                    type="success"
                    @click="addHandle">
                    {{ $t('addMember') }}
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
                        prop="username"
                        align="center"
                        min-width="160"
                        :label="$t('name')">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        align="center"
                        min-width="120"
                        :label="$t('type')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type === 101">{{ $t('personal') }}</el-tag>
                            <el-tag type="success" v-else-if="scope.row.type === 102">{{ $t('company') }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        align="center"
                        min-width="160"
                        :label="$t('serialNum')">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        align="center"
                        min-width="160"
                        :label="$t('mobile')">
                    </el-table-column>
                    <el-table-column
                        prop="totalPoints"
                        align="center"
                        min-width="120"
                        :label="$t('integral')">
                    </el-table-column>
                    <el-table-column
                        prop="settleSetting"
                        align="center"
                        min-width="120"
                        :label="$t('taxRate') + ' (%)'">
                        <template slot-scope="scope">
                            <span v-if="scope.row.settleSetting">{{ scope.row.settleSetting.taxRate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="settleSetting"
                        align="center"
                        min-width="140"
                        :formatter="formatterPriceType"
                        :label="$t('defUsePrice')">
                    </el-table-column>
                    <el-table-column
                        prop="discountRate"
                        align="center"
                        min-width="100"
                        :label="$t('zhekou') + ' (%)'">
                        <template slot-scope="scope">
                            <span v-if="scope.row.settleSetting">{{ scope.row.settleSetting.discountRate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="totalPoints"
                        align="center"
                        min-width="160"
                        :label="$t('registerTime')">
                        <template slot-scope="scope">
                            <span>{{ scope.row.createdAt | filterTime }}</span>
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
    </div>
</template>

<script>
import {queryMemberList, searchMemberList} from "@/api";
import Edit from "@/components/member/Edit";
import {Debounce} from "@/utils/common";
export default {
    name: "Member",
    // 组件
    components: {
        Edit
    },
    props: {},
    data() {
        return {
            search: {
                keyword: ''
            },
            tableData: [],
            tableHeight: 560,
            currentPage: 1,
            pageSize: 15,
            total: 0,
            priceOptions: [
                {
                    id: 100,
                    name: this.$t('default')
                },
                {
                    id: 101,
                    name: this.$t('wholesalePrice')
                },
                {
                    id: 102,
                    name: this.$t('memberPrice')
                },
                {
                    id: 103,
                    name: this.$t('promotionalPrice')
                },
                {
                    id: 104,
                    name: this.$t('deliveryPrice')
                },
                {
                    id: 105,
                    name: this.$t('internetPrice')
                },
                {
                    id: 106,
                    name: this.$t('invoicePrice')
                },
                {
                    id: 107,
                    name: this.$t('friendlyPrice')
                },
                {
                    id: 108,
                    name: this.$t('specialPrice')
                }
            ],
            itemId: '',
            itemIndex: 0,
            editDialog: false,
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
    
        // 自动搜索
        inputDebounce: Debounce(function () {
            this.searchHandle()
        }, 500),
        
        // 搜索
        searchHandle () {
            this.currentPage = 1
            // 获取列表数据
            this.getListData()
        },
    
        // 清空
        emptyHandle () {
            this.search = {
                keyword: ''
            }
            this.currentPage = 1
            // 获取列表数据
            this.getListData()
        },
        
        // 查询列表
        getListData () {
            let params = {
                keyword: this.search.keyword.trim(),
                page: this.currentPage,
                size: this.pageSize
            }
            queryMemberList(params).then(res => {
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
        // 格式化价格类型
        formatterPriceType (row, column, cellValue) {
            if (!cellValue) return ''
            if (!cellValue.defaultPriceType) return ''
            const currentType = this.priceOptions.find(item => item.id === cellValue.defaultPriceType)
            return currentType !== undefined ? currentType.name : ''
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
        
        // 新增
        addHandle () {
            this.itemId = ''
            this.editDialog = true
        },
        // 编辑
        editHandle (id) {
            this.itemId = id
            this.editDialog = true
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
        // 获取表格高度
        this.getTableHeight()
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
