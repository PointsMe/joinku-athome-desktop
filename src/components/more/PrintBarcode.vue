<template>
    <div>
        <!-- 选择商品 -->
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
                        <el-input
                            v-model="search.code"
                            :placeholder="$t('productCode')"
                            clearable
                            @change="searchHandle">
                        </el-input>
                    </div>
                    <div class="search-item">
                        <el-input
                            v-model="search.barcode"
                            :placeholder="$t('productBarcode')"
                            clearable
                            @change="searchHandle">
                        </el-input>
                    </div>
                    <div class="search-handle">
                        <el-button type="primary" @click="searchHandle">{{$t('search')}}</el-button>
                        <el-button type="info" @click="emptyHandle">{{$t('empty')}}</el-button>
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    ref="multipleTable"
                    style="width: 100%"
                    row-key="id"
                    max-height="520"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60" reserve-selection align="center"></el-table-column>
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
                        width="160"
                        :label="$t('productBarcode')">
                    </el-table-column>
                    <el-table-column
                        prop="sellPrice"
                        width="120"
                        align="center"
                        :label="$t('sellPrice')">
                    </el-table-column>
                    <el-table-column prop="count" align="center" width="120" :label="$t('number')">
                        <template slot-scope="scope">
                            <el-input
                                v-model="scope.row.count"
                                size="small">
                            </el-input>
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
                <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
                <el-button type="primary"
                           :disabled="multipleSelection.length === 0"
                           @click="confirmHandle">{{ $t('confirm') }}</el-button>
            </div>
        </el-dialog>
        <!-- 打印 -->
        <el-dialog
            :title="$t('preview')"
            :visible.sync="printDialog"
            :close-on-click-modal="false"
            center
            custom-class="large-dialog"
            top="5vh">
            <div class="content">
                <div class="search">
                    <div class="search-item">
                        <span class="label">{{ $t('printTemp') }}</span>
                        <el-select
                            v-model="templateId"
                            :placeholder="$t('selContentHint')">
                            <el-option
                                v-for="item in templateOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <el-table
                    :data="checkedList"
                    style="width: 100%"
                    max-height="540">
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
                        width="160"
                        :label="$t('productBarcode')">
                    </el-table-column>
                    <el-table-column
                        prop="sellPrice"
                        width="120"
                        align="center"
                        :label="$t('sellPrice')">
                    </el-table-column>
                    <el-table-column
                        prop="count"
                        align="center"
                        width="120"
                        :label="$t('number')">
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="printDialog = false">{{ $t('cancel') }}</el-button>
                <el-button type="primary"
                           :disabled="disabled"
                           @click="printHandle">{{ $t('printBarcode') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import {paperPrePrint, queryProductPage, tagPrePrint} from "@/api";
import {validateInteger} from "@/utils/validate";

export default {
    name: "PrintBarcode",
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
                name: '',
                code: '',
                barcode: ''
            },
            tableData: [],
            currentPage: 1,
            pageSize: 15,
            total: 0,
            multipleSelection: [],
            checkedList: [],
            printDialog: false,
            templateOptions: [
                {
                    name: this.$t('printTemp1'),
                    id: 1
                },
                {
                    name: this.$t('printTemp2'),
                    id: 2
                },
                {
                    name: this.$t('printTemp3'),
                    id: 3
                },
                {
                    name: this.$t('printTemp4'),
                    id: 4
                },
                {
                    name: this.$t('printTemp5'),
                    id: 5
                }
            ],
            templateId: 2,
            disabled: false
        };
    },
    // 计算属性
    computed: {},
    filters: {
    
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
            this.emptyHandle()
            this.checkedList = []
            this.templateId = localStorage.getItem('printTempType') === null ? 2 : Number(localStorage.getItem('printTempType'));
            this.$nextTick(() => {
                this.$refs.multipleTable.clearSelection()
            })
        },
        // 查询列表
        getListData () {
            let params = {
                name: this.search.name,
                code: this.search.code,
                barcode: this.search.barcode,
                published:true,
                dynamicPrice:false,
                page: this.currentPage,
                size: this.pageSize
            }
            queryProductPage(params).then(res => {
                if (res.code === 20000) {
                    this.total = res.data.total
                    const list = res.data.list || []
                    this.tableData = list.map(item => {
                        return {
                            ...item,
                            count: 1
                        }
                    })
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
                code: '',
                barcode: ''
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
        // 选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
       
        // 确定
        confirmHandle () {
            const result = this.multipleSelection.some(item => {
                return !validateInteger(item.count)
            })
            if (result) {
                this.$message({
                    showClose: true,
                    message: this.$t('inpNotRule'),
                    type: 'warning'
                })
                return
            }
            this.printDialog = true
            this.checkedList = JSON.parse(JSON.stringify(this.multipleSelection))
        },
        // 关闭弹窗
        dialogClose () {
            this.$emit('parent-close')
        },
       
        // 打印
        printHandle () {
            localStorage.setItem('printTempType', this.templateId);
            let products = this.checkedList.map(item => {
                return {
                    productId: item.id,
                    count: item.count
                }
            })
            if (this.templateId === 1) {
                let params = {
                    products,
                    type: 1
                };
                this.paperPrint(params)
            } else if (this.templateId === 2) {
                let params = {
                    products,
                    pageSize: 1.5
                };
                this.tagPrint(params)
            } else if (this.templateId === 3) {
                let params = {
                    products,
                    pageSize: 1.33
                };
                this.tagPrint(params)
            } else if (this.templateId === 4) {
                let params = {
                    products,
                    type: 2
                };
                this.paperPrint(params)
            } else if (this.templateId === 5) {
                let params = {
                    products,
                    type: 3
                };
                this.paperPrint(params)
            }
        },
        // 标签
        tagPrint (params) {
            tagPrePrint(params).then(res => {
                    let fs = require('fs');
                    let buffer = Buffer.from(res);
                    let tmpPath = require('os').homedir() + '\\AppData\\Local\\Temp\\tagPrint_' + this.guid() + '.pdf';
                    fs.writeFile(tmpPath, buffer, {}, error => {
                        if (error) {
                            this.$message({
                                showClose: true,
                                message: error,
                                type: 'warning'
                            });
                            return false;
                        }
                        let shell = window.require('electron').shell;
                        shell.openExternal('file://' + tmpPath);
                        this.closePrint()
                    })
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                this.disabled = false
            })
        },
        // A4纸
        paperPrint (params) {
            paperPrePrint(params).then(res => {
                let fs = require('fs');
                let buffer = Buffer.from(res);
                let tmpPath = require('os').homedir() + '\\AppData\\Local\\Temp\\tagPrint_' + this.guid() + '.pdf';
                fs.writeFile(tmpPath, buffer, {}, error => {
                    if (error) {
                        this.$message({
                            showClose: true,
                            message: error,
                            type: 'warning'
                        });
                        return false;
                    }
                    let shell = window.require('electron').shell;
                    shell.openExternal('file://' + tmpPath);
                    this.closePrint()
                })
            }).catch((err) => {
                this.$message.error(err);
            }).finally(() => {
                this.disabled = false
            })
        },
        S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        guid() {
            return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
        },
        
        // 关闭打印
        closePrint () {
            this.printDialog = false
            this.dialogVisible = false
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
            .label{
                font-size: 14px;
                color: #181818;
                margin-right: 5px;
            }
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
