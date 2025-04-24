<template>
    <el-dialog
        :title="$t('selectMember')"
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
                        ref="keywordRef"
                        v-model="search.keyword"
                        :placeholder="$t('nameNumMobile')"
                        clearable
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
            </div>
            <el-table :data="tableData" border style="width: 100%" row-key="id" max-height="520">
                <el-table-column
                    prop="username"
                    align="center"
                    min-width="140"
                    :label="$t('name')">
                </el-table-column>
                <el-table-column
                    prop="number"
                    align="center"
                    min-width="120"
                    :label="$t('serialNum')">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    min-width="120"
                    align="center"
                    :label="$t('mobile')">
                </el-table-column>
                <el-table-column
                    prop="totalPoints"
                    align="center"
                    min-width="90"
                    :label="$t('integral')">
                </el-table-column>
                <el-table-column align="center" min-width="100" fixed="right" :label="$t('handle')">
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
import {queryMemberList} from "@/api";
import {Debounce} from "@/utils/common";

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
            search: {
                keyword: ''
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
        // 初始化数据
        initData () {
            this.dialogVisible = true
            this.emptyHandle()
            this.$nextTick(() => {
                this.$refs.keywordRef.$el.querySelector('input').focus();
            })
        },
        // 自动搜素
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
        width: 100%;
        height: 60px;
        display: flex;
        .search-item{
            height: 100%;
            display: flex;
            align-items: center;
            margin-right: 20px;
            ::v-deep .el-input{
                width: 514px;
                .el-input__inner{
                    font-weight: 400;
                    font-size: 20px;
                }
            }
        }
        .search-handle{
            height: 100%;
            display: flex;
            align-items: center;
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
