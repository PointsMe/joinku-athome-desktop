<template>
    <el-dialog :title="$t('customerDisplay')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="small-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" @submit.native.prevent ref="ruleForm" label-width="auto">
                <el-form-item :label="$t('brand')" prop="brand">
                    <el-select v-model="formData.brand" @change="brandChange" @clear="brandClear" filterable clearable>
                        <el-option
                            v-for="item in brandOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('serialPort')" prop="port">
                    <el-select v-model="formData.port" filterable clearable>
                        <el-option
                            v-for="item in portOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('baudRate')" prop="baud">
                    <el-input v-model="formData.baud"></el-input>
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

import {closeDisplayer, openDisplayer} from "@/utils/customer-display";

export default {
    name: "CustomerDisplay",
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
            brandOptions: [
                {
                    name: 'VFD220',
                    id: 'VFD220',
                    port: 'COM3',
                    baud: '9600'
                },
                {
                    name: 'CITAQ 8',
                    id: 'CITAQ8',
                    port: 'COM2',
                    baud: '2400'
                }
            ],
            portOptions: [
                {
                    label: 'COM1',
                    value: 'COM1'
                },
                {
                    label: 'COM2',
                    value: 'COM2'
                },
                {
                    label: 'COM3',
                    value: 'COM3'
                },
                {
                    label: 'COM4',
                    value: 'COM4'
                },
                {
                    label: 'COM5',
                    value: 'COM5'
                },
                {
                    label: 'COM6',
                    value: 'COM6'
                },
                {
                    label: 'COM7',
                    value: 'COM7'
                },
                {
                    label: 'COM8',
                    value: 'COM8'
                },
                {
                    label: 'COM9',
                    value: 'COM9'
                },
                {
                    label: 'COM10',
                    value: 'COM10'
                }
            ],
            formData: {
                brand: '',
                port: '',
                baud: ''
            },
            rules: {}
        };
    },
    // 计算属性
    computed: {
    
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
            // 客显
            this.formData.brand = localStorage.getItem("customerDisplayBrand") || ''
            this.formData.port = localStorage.getItem("customerDisplayPort") || ''
            this.formData.baud = localStorage.getItem("customerDisplayBaud") || ''
        },
        
        // 品牌变化
        brandChange (val) {
            const currentBrand = this.brandOptions.find(item => item.id === val)
            if (currentBrand === undefined) {
                this.formData.port = ''
                this.formData.baud = ''
            } else {
                this.formData.port = currentBrand.port
                this.formData.baud = currentBrand.baud
            }
        },
        // 清除品牌
        brandClear () {
        
        },
        
        // 验证表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.saveDisplaySetting()
                } else {
                    return false
                }
            })
        },
    
        // 保存客显设置
        saveDisplaySetting () {
            // 关闭串口
            closeDisplayer();
            if (this.formData.brand && this.formData.port && this.formData.baud) {
                localStorage.setItem("customerDisplayBrand", this.formData.brand)
                localStorage.setItem("customerDisplayPort", this.formData.port)
                localStorage.setItem("customerDisplayBaud", this.formData.baud)
                // 打开串口
                setTimeout(() => {
                    openDisplayer(this.formData.port, Number(this.formData.baud));
                }, 2000)
            } else {
                localStorage.removeItem("customerDisplayBrand")
                localStorage.removeItem("customerDisplayPort")
                localStorage.removeItem("customerDisplayBaud")
            }
            this.dialogVisible = false
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
