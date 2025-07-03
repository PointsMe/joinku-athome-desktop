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
                    <el-select v-model="search.payment" clearable @change="searchHandle" :placeholder="$t('payment')">
                        <el-option
                            v-for="item in paymentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-select v-model="search.receipt" clearable @change="searchHandle" :placeholder="$t('billType')">
                        <el-option
                            v-for="item in receiptOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-select v-model="search.cashierId" clearable @change="searchHandle" :placeholder="$t('operator')">
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
                        v-model="search.memberName"
                        clearable
                        :placeholder="$t('member')"
                        @focus="memberDialog = true"
                        @clear="clearMember">
                    </el-input>
                </div>
                <!--<div class="search-item">-->
                <!--    <el-input-->
                <!--        v-model="search.number"-->
                <!--        clearable-->
                <!--        :placeholder="$t('orderNo')"-->
                <!--        @input.native="inputDebounce"-->
                <!--        @clear="searchHandle">-->
                <!--    </el-input>-->
                <!--</div>-->
                <div class="search-item">
                    <el-input
                        v-model="search.receiptNumber"
                        clearable
                        :placeholder="$t('invoiceNo') + ' / ' + $t('taxNo')"
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
                <div class="search-item">
                    <el-input
                        v-model="search.barcode"
                        clearable
                        :placeholder="$t('productBarcode')"
                        @input.native="inputDebounce"
                        @clear="searchHandle">
                    </el-input>
                </div>
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
                        prop="number"
                        align="center"
                        min-width="160"
                        :label="$t('orderNo')">
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
                        prop="itemTotalAmount"
                        align="center"
                        min-width="120"
                        :label="$t('productAmount') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="itemDiscountAmount"
                        align="center"
                        min-width="120"
                        :label="$t('productDiscount') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="itemFinalAmount"
                        align="center"
                        min-width="120"
                        :label="$t('productCope') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="orderDiscountAmount"
                        align="center"
                        min-width="120"
                        :label="$t('orderDiscount') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="finalAmount"
                        align="center"
                        min-width="120"
                        :label="$t('cope') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="paidAmount"
                        align="center"
                        min-width="120"
                        :label="$t('paid') + ' (€)'">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        align="center"
                        min-width="180"
                        :label="$t('orderTime')">
                        <template slot-scope="scope">
                            {{ scope.row.createdAt | filterEuropeTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="paidAmount"
                        align="center"
                        min-width="120"
                        :label="$t('billType')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.receipt === 100">{{ $t('stayInvoice') }}</span>
                            <span v-else-if="scope.row.receipt === 101">{{ $t('taxReceipt') }}</span>
                            <span v-else-if="scope.row.receipt === 102">{{ $t('invoice') }}</span>
                            <div v-if="scope.row.receipt === 102">
                                <el-tag type="success" size="small" v-if="scope.row.invoiced">{{ $t('opened') }}</el-tag>
                                <el-tag type="primary" size="small" v-else>{{ $t('waited') }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="receiptNumber"
                        align="center"
                        min-width="140"
                        :label="$t('invoiceNo') + ' / ' + $t('taxNo')">
                    </el-table-column>
                    <el-table-column align="center" min-width="200" :label="$t('handle')" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="detailHandle(scope.row.id);">
                                {{ $t('detail') }}
                            </el-button>
                            <el-button
                                type="danger"
                                @click="deleteHandle(scope.row.id);"
                                v-if="scope.row.receipt === 100">
                                {{ $t('delete') }}
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
        <!-- 选择会员 -->
        <SelectMember
            :showDialog="memberDialog"
            @parent-update="memberUpdate"
            @parent-close="memberDialog = false"/>
        <!-- 详情 -->
        <Detail
            ref="detail"
            :showDialog="detailDialog"
            :itemId="itemId"
            @invoice-handle="invoiceHandle"
            @parent-update="getListData"
            @parent-close="detailDialog = false"/>
        <!-- 发票 -->
        <Invoice
            :showDialog="invoiceDialog"
            @parent-update="printInvoice"
            @parent-close="invoiceDialog = false"/>
    </div>
</template>

<script>

import SelectMember from "@/components/SelectMember";
import Detail from "@/components/order/Detail"
import Invoice from "@/components/pay/Invoice";
import {deleteOrder, queryCashierList, queryOrderPage} from "@/api";

import moment from "moment";
import {Debounce} from "@/utils/common";
// receipt   100 待开发票   101 税票    102 发票
export default {
    name: "Order",
    // 组件
    components: {
        SelectMember,
        Detail,
        Invoice
    },
    props: {},
    data() {
        return {
            paymentOptions: [
                {
                    label: this.$t('cash'),
                    value: 101
                },
                {
                    label: this.$t('swipingCard'),
                    value: 102
                },
                {
                    label: 'BIZUM',
                    value: 106
                },
                {
                    label: this.$t('mealVoucher'),
                    value: 103
                },
                {
                    label: this.$t('notPaid'),
                    value: 104
                },
                {
                    label: this.$t('voucher'),
                    value: 105
                }
            ],
            receiptOptions: [
                {
                    label: this.$t('stayInvoice'),
                    value: 100
                },
                {
                    label: this.$t('taxReceipt'),
                    value: 101
                },
                {
                    label: this.$t('invoice'),
                    value: 102
                }
            ],
            cashierOptions: [],
            search: {
                payment: '',
                receipt: '',
                cashierId: '',
                memberName: '',
                memberId: '',
                number: '',
                receiptNumber: '',
                barcode: '',
                startedAt: '',
                endedAt: '',
            },
            startTime: '',
            endTime: '',
            showCustom: false,
            dateType: 0,
            tableHeight: 560,
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 15,
            memberDialog: false,
            itemId: '',
            itemIndex: 0,
            detailDialog: false,
            invoiceDialog: false
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
        
        // 更新会员
        memberUpdate(data) {
            this.search.memberId = data.id
            if (data.username) {
                this.search.memberName = data.username
            } else {
                this.search.memberName = data.mobile
            }
            this.searchHandle()
        },
        // 清除会员
        clearMember () {
            this.search.memberId = ''
            this.search.memberName = ''
            this.searchHandle()
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
    
        // 自动搜素
        inputDebounce: Debounce(function () {
            this.searchHandle()
        }, 500),
        
        // 获取列表数据
        getListData () {
            let params = {
                payment: this.search.payment,
                receipt: this.search.receipt,
                cashierId: this.search.cashierId,
                memberId: this.search.memberId,
                number: this.search.number.trim(),
                receiptNumber: this.search.receiptNumber.trim(),
                barcode: this.search.barcode.trim(),
                startedAt: this.search.startedAt,
                endedAt: this.search.endedAt,
                page: this.currentPage,
                size: this.pageSize
            }
            queryOrderPage(params).then(res => {
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
        
        // 详情
        detailHandle (id) {
            this.itemId = id
            this.detailDialog = true
        },
    
        // 发票
        invoiceHandle () {
            this.invoiceDialog = true
        },
        // 打印发票
        printInvoice (data) {
            this.$refs.detail.invoiceCheck(data)
        },
        
        // 删除
        deleteHandle (id) {
            this.$confirm(this.$t('ifDelete'), this.$t('hint'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                let params = {
                    id
                }
                deleteOrder(params).then(res => {
                    if (res.code === 20000) {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        })
                        this.getListData()
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
            }).catch(() => {})
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
                this.detailDialog = true
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
        // 获取收银员列表
        this.getCashierList()
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
                .active-row{
                    background-color: #CCE8CF;
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
