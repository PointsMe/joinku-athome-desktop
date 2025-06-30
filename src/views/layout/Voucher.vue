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
                        v-model="startTime"
                        type="datetime"
                        :placeholder="$t('startTime')">
                    </el-date-picker>
                    <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        :placeholder="$t('endTime')">
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
                    <el-input
                        v-model="search.id"
                        clearable
                        placeholder="ID"
                        @change="searchHandle">
                    </el-input>
                </div>
                <div class="search-item">
                    <el-select v-model="search.state" clearable @change="searchHandle" :placeholder="$t('state')">
                        <el-option
                            v-for="item in stateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-handle">
                    <el-button
                        type="primary"
                        @click="goBack">
                        {{ $t('back') }}
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
                    <el-table-column prop="id" min-width="180" align="center" label="ID"></el-table-column>
                    <el-table-column prop="amount" min-width="120" align="center" :label="$t('amount') + ' (€)'"></el-table-column>
                    <el-table-column prop="amount" min-width="180" align="center" :label="$t('createTime')">
                        <template slot-scope="scope">
                            <span>{{ scope.row.createdAt | filterTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180" align="center" :label="$t('refundNo')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.orderRefund">{{ scope.row.orderRefund.number }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" min-width="160" align="center" :label="$t('state')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.state === 101">{{ $t('unused') }}</el-tag>
                            <el-tag type="success" v-else-if="scope.row.state === 103">{{ $t('haveused') }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        align="center"
                        min-width="180"
                        :label="$t('useTime') + ' / ' + $t('ciNum')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.useCount === 1">{{ scope.row.updatedAt | filterTime }}</span>
                            <span class="count" v-else-if="scope.row.useCount > 1">{{ scope.row.useCount }}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" width="140" align="center" :label="$t('useAmount')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.state === 101">{{ $t('unused') }}</el-tag>
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
    </div>
</template>

<script>
import { queryVoucherPage} from "@/api";
import moment from "moment";

export default {
    name: "Voucher",
    // 组件
    components: {
    
    },
    props: {},
    data() {
        return {
            search: {
                id: '',
                state: '',
                startedAt: '',
                endedAt: '',
            },
            stateOptions: [
                {
                    label: this.$t('unused'),
                    value: 101
                },
                {
                    label: this.$t('haveused'),
                    value: 103
                }
            ],
            startTime: '',
            endTime: '',
            showCustom: false,
            dateType: 0,
            tableHeight: 560,
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 15,
            itemId: '',
            recordDialog: false,
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
                    if (this.startTime && this.endTime) {
                        this.search.startedAt = moment(this.startTime).format('YYYY-MM-DDTHH:mm:ssZZ')
                        this.search.endedAt = moment(this.endTime).format('YYYY-MM-DDTHH:mm:ssZZ')
                    }
                    break;
            }
            // 搜索
            this.searchHandle()
        },
        
        // 获取列表数据
        getListData () {
            let params = {
                startedAt: this.search.startedAt,
                endedAt: this.search.endedAt,
                page: this.currentPage,
                size: this.pageSize
            }
            queryVoucherPage(params).then(res => {
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
    
        // 使用记录
        checkUseRecord (id) {
            this.itemId = id
            this.recordDialog = true
        },
        
        // 返回
        goBack () {
            this.$router.back()
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
            .count{
                margin-left: 40px;
                color: #56A3D9;
                font-weight: 500;
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
