<template>
    <el-dialog
        :title="$t('memberBind')"
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
                        :placeholder="$t('nameNumMobile')"
                        clearable
                        @input.native="keywordDebounce">
                    </el-input>
                </div>
            </div>
            <div class="table" style="height: 520px">
                <el-table :data="tableData" border style="width: 100%" row-key="id" :row-class-name="rowClassName" max-height="520">
                    <el-table-column
                        prop="username"
                        align="center"
                        min-width="160"
                        :label="$t('name')">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        align="center"
                        min-width="140"
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
                        min-width="100"
                        :label="$t('integral')">
                    </el-table-column>
                    <el-table-column
                        prop="settleSetting"
                        align="center"
                        min-width="110"
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
                    <el-table-column align="center" min-width="110" fixed="right" :label="$t('handle')">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="small"
                                @click="chooseHandle(scope.row.id)">
                                {{ $t('select') }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
        </div>
        <div class="footer-handle">
            <div class="handle-left">
                <el-button
                    type="success"
                    @click="addMemberHandle">
                    {{ $t('addMember') }}
                </el-button>
            </div>
            <div class="handle-right">
                <el-button
                    @click="dialogVisible = false">
                    {{ $t('close') }}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {searchMemberList} from "@/api";
import {Debounce} from "@/utils/common";

export default {
    name: "MemberList",
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
            itemId: '',
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
            this.keyword = ''
            this.tableData = []
            this.itemId = ''
            this.$nextTick(() => {
                this.$refs.keywordRef.$el.querySelector('input').focus();
            })
        },
        // 搜索会员
        keywordDebounce: Debounce(function () {
            if (!this.keyword) {
                return
            }
            let params = {
                keyword: this.keyword
            }
            searchMemberList(params).then(res => {
                if (res.code === 20000) {
                    this.tableData = res.data || []
                    if (this.tableData.length > 0) {
                        this.itemId = this.tableData[0].id
                    } else {
                        this.itemId = ''
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
                this.itemId = this.tableData[currentIndex - 1].id
            } else if (direction === 'down') {
                if (currentIndex >= this.tableData.length - 1) return;
                this.itemId = this.tableData[currentIndex + 1].id
            }
        },
        
        // 格式化价格类型
        formatterPriceType (row, column, cellValue) {
            if (!cellValue) return ''
            if (!cellValue.defaultPriceType) return ''
            const currentType = this.priceOptions.find(item => item.id === cellValue.defaultPriceType)
            return currentType !== undefined ? currentType.name : ''
        },
        
        // 选择
        chooseHandle (id) {
            this.itemId = id
            this.confirmHandle()
        },
        // 绑定
        confirmHandle () {
            if (!this.itemId) return;
            this.$emit('parent-update', this.itemId)
            this.dialogVisible = false
        },
        // 新增
        addMemberHandle () {
            this.$emit('add-member')
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
                width: 514px;
                height: 40px;
            }
        }
        .search-handle{
            height: 54px;
            display: flex;
            align-items: center;
        }
    }
    .table{
        ::v-deep .el-radio{
            .el-radio__inner{
                width: 20px;
                height: 20px;
            }
            .el-radio__label{
                display: none;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: #387A45;
                background: #387A45;
            }
        }
    }
}
.footer-handle{
    padding-top: 20px;
    padding-bottom: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
