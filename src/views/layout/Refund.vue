<template>
    <div class="container">
        <div class="container-header">
            <div class="dates">
                <ul class="list" v-if="!showCustom">
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 0 }" @click="selectDateHandle(0)">{{ $t('all') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 1 }" @click="selectDateHandle(1)">{{ $t('today') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 2 }" @click="selectDateHandle(2)">{{ $t('yesterday') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 3 }" @click="selectDateHandle(3)">{{ $t('anteayer') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 4 }" @click="selectDateHandle(4)">{{ $t('thisWeek') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 5 }" @click="selectDateHandle(5)">{{ $t('thisMonth') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 6 }" @click="selectDateHandle(6)">{{ $t('thisYear') }}</a>/
                    </li>
                    <li class="item">
                        <a href="javascript:void(0);" :class="{ active: dateType === 99 }" @click="showCustom = true">{{ $t('custom') }}</a>
                    </li>
                </ul>
                <div class="range" v-else>
                    <el-date-picker
                        v-model="times"
                        type="datetimerange"
                        range-separator="-"
                        :start-placeholder="$t('startTime')"
                        :end-placeholder="$t('endTime')">
                    </el-date-picker>
                    <el-button
                        type="primary"
                        @click.native="selectDateHandle(99)">
                        {{ $t('affirm') }}
                    </el-button>
                    <el-button
                        @click.native="showCustom = false">
                        {{ $t('cancel') }}
                    </el-button>
                </div>
            </div>
            <div class="search">
                <div class="search-item">
                    <el-select v-model="search.operatorId" clearable @change="searchHandle" :placeholder="$t('operator')">
                        <el-option
                            v-for="item in cashierOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input
                        v-model="search.number"
                        clearable
                        :placeholder="$t('orderNo')"
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
                <div class="search-handle">
                    <el-button
                        type="primary"
                        @click="skipVoucher">
                        {{ $t('voucher') }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="container-main">
            <div class="table" ref="tableContainer">
                <el-table
                    :data="tableData"
                    border
                    :max-height="tableHeight"
                    style="width: 100%;">
                    <el-table-column
                        prop="number"
                        align="center"
                        min-width="180"
                        :label="$t('refundNo')">
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        align="center"
                        :label="$t('operator')"
                        min-width="140">
                        <template slot-scope="scope">
                            <span v-if="scope.row.operator">{{ scope.row.operator.username }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        align="center"
                        min-width="140"
                        :label="$t('refundAmount') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        align="center"
                        min-width="180"
                        :label="$t('remark')">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        align="center"
                        min-width="180"
                        :label="$t('refundTime')">
                        <template slot-scope="scope">
                            {{ scope.row.createdAt | filterTime }}
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" width="120" :label="$t('handle')" fixed="right">-->
                    <!--    <template slot-scope="scope">-->
                    <!--        <el-button-->
                    <!--            type="primary"-->
                    <!--            @click="detailHandle(scope.row.id);">-->
                    <!--            {{ $t('detail') }}-->
                    <!--        </el-button>-->
                    <!--    </template>-->
                    <!--</el-table-column>-->
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
    </div>
</template>

<script>
import {queryCashierList, queryRefundList} from "@/api";
import moment from "moment";
import {Debounce} from "@/utils/common";

export default {
    name: "Refund",
    // 组件
    components: {},
    props: {},
    data() {
        return {
            cashierOptions: [],
            search: {
                operatorId: '',
                number: '',
                startedAt: '',
                endedAt: '',
            },
            times: [],
            showCustom: false,
            dateType: 0,
            tableHeight: 560,
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 15,
            itemId: '',
            detailDialog: false
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
    
        // 获取收银员列表
        getCashierList () {
            let params = {
                number: ''
            }
            queryCashierList(params).then(res => {
                if (res.code === 20000) {
                    this.cashierOptions = res.data || []
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
        // 日期
        selectDateHandle (val) {
            this.dateType = val
            // 0全部   1今日   2昨日   3前天   4本周  5本月   6上个月  7本年   99自定义
            switch (val) {
                case 0:
                    this.search.startedAt = ''
                    this.search.endedAt = ''
                    break;
                case 1:
                    this.search.startedAt = moment().startOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().endOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 2:
                    this.search.startedAt = moment().subtract(1, 'days').startOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().subtract(1, 'days').endOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 3:
                    this.search.startedAt = moment().subtract(2, 'days').startOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().subtract(2, 'days').endOf("day").format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 4:
                    this.search.startedAt = moment().week(moment().week()).startOf('week').format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().week(moment().week()).endOf('week').format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 5:
                    this.search.startedAt = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().endOf("month").format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 6:
                    this.search.startedAt = moment().startOf("year").format('YYYY-MM-DDTHH:mm:ssZZ')
                    this.search.endedAt = moment().endOf("year").format('YYYY-MM-DDTHH:mm:ssZZ')
                    break;
                case 99:
                    if (this.times && this.times.length === 2) {
                        this.search.startedAt = moment(this.times[0]).format('YYYY-MM-DDTHH:mm:ssZZ')
                        this.search.endedAt = moment(this.times[1]).format('YYYY-MM-DDTHH:mm:ssZZ')
                    }
                    break;
            }
            // 搜索
            this.searchHandle()
        },
    
        // 自动搜素
        inputDebounce: Debounce(function () {
            this.searchHandle()
        }, 500),
        
        // 获取列表数据
        getListData () {
            let params = {
                operatorId: this.search.operatorId,
                number: this.search.number.trim(),
                startedAt: this.search.startedAt,
                endedAt: this.search.endedAt,
                page: this.currentPage,
                rows: this.pageSize
            }
            queryRefundList(params).then(res => {
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
        handleCurrentChange (page) {
            this.currentPage = page
            // 获取列表数据
            this.getListData()
        },
    
        // 详情
        detailHandle (id) {
            this.itemId = id
            this.detailDialog = true
        },
        
        // 跳转抵用券
        skipVoucher () {
            this.$router.push({ name: 'Voucher'})
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        // 获取数据列表
        this.getListData()
        // 获取收银员列表
        this.getCashierList()
        // 获取表格高度
        this.getTableHeight()
    },
    // 销毁之前
    beforeDestroy() {
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
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        .dates{
            height: 54px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            .list{
                padding: 0;
                display: flex;
                a{
                    padding-left: 5px;
                    padding-right: 5px;
                    color: #2E3B2C;
                }
                .active{
                    color: #007B44;
                    font-weight: 600;
                }
            }
            .range{
                .el-date-editor{
                    margin-right: 10px;
                    height: 40px;
                }
                .el-button{
                    height: 40px;
                }
                .el-button--primary{
                    background: #56A3D9;
                }
            }
        }
        .search{
            padding-left: 20px;
            padding-right: 12px;
            display: flex;
            flex-wrap: wrap;
            .search-item{
                margin-right: 5px;
                height: 54px;
                display: flex;
                align-items: center;
                .el-input{
                    width: 200px;
                    height: 40px;
                }
                ::v-deep .el-select{
                    width: 170px;
                    height: 40px;
                    .el-input{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .search-handle{
                height: 54px;
                display: flex;
                align-items: center;
            }
        }
    }
    .container-main{
        width: 100%;
        flex-grow: 1;
        background-color: #fff;
        .table{
            height: calc(100% - 60px);
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
