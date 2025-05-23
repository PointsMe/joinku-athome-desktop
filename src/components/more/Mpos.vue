<template>
    <el-dialog :title="$t('selectMpos')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('mpos')" prop="id">
                    <el-select v-model="formData.id" filterable clearable>
                        <el-option
                            v-for="item in deviceOptions"
                            :key="item.id"
                            :label="item.propertiesId"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button
                type="primary"
                size="small"
                @click="submitForm()">
                {{ $t('confirm') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {queryTerminalList} from "@/api/dojo";
import {mapState} from "vuex";

export default {
    name: "Mpos",
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
            deviceOptions: [],
            formData: {
                id: ''
            },
            rules: {}
        };
    },
    // 计算属性
    computed: {
        ...mapState({
            enabledDojo: state => state.dojoConfig.enabled   // 启用Dojo
        }),
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
        // 初始化数据
        initData () {
            this.dialogVisible = true
            if (this.deviceOptions.length === 0 && this.enabledDojo) {
                this.getDeviceList()
            }
            // POS机
            this.$nextTick(() => {
                this.formData.id = localStorage.getItem("posId") || ''
            })
        },
        // 查询设备列表
        getDeviceList () {
            queryTerminalList().then(res => {
                const list = res || []
                this.deviceOptions = list.map(item => {
                    return {
                        ...item,
                        propertiesId: item.properties.tid
                    }
                })
            }).catch(err => {
                this.$message.error(err);
            })
        },
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    localStorage.setItem("posId", this.formData.id);
                    this.dialogVisible = false
                } else {
                    return false
                }
            })
        },
    
        // 重置表单
        resetForm () {
            this.$refs['ruleForm'].resetFields()
        },
        
        // 关闭弹窗
        dialogClose () {
            // 重置表单
            this.resetForm()
            this.$emit('parent-close')
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
    
    },
    // 组件被激活
    activated() {
    
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.content{
    ::v-deep .el-form{
        .el-select{
            width: 100%;
        }
    }
}
</style>
