<template>
    <div class="card">
        <div class="card-header border-b">
            <div class="card-header-left">
                <span class="text">{{ $t('remark') }}</span>
            </div>
            <div class="card-header-right">
                <el-button @click="confirmHandle()">{{ $t('confirm') }}</el-button>
            </div>
        </div>
        <div class="card-body">
            <el-input
                ref="valueRef"
                type="textarea"
                v-model="value"
                maxlength="100"
                show-word-limit
                @keyup.enter.native="confirmHandle()">
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductRemark",
    // 组件
    components: {},
    props: {
        itemRemark: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            value: ''
        };
    },
    // 计算属性
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        confirmHandle () {
            this.$emit('remark-update', this.value)
        }
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        this.value = this.itemRemark
        this.$nextTick(() => {
            this.$refs.valueRef.$el.querySelector('textarea').focus();
        })
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.card{
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #707070;
    .card-header{
        width: 100%;
        height: 84px;
        padding-left: 32px;
        padding-right: 32px;
        display: flex;
        justify-content: space-between;
        .card-header-left{
            height: 100%;
            display: flex;
            align-items: center;
            .text{
                font-weight: 400;
                font-size: 30px;
                color: #000000;
            }
        }
        .card-header-right{
            height: 100%;
            display: flex;
            align-items: center;
            ::v-deep .el-button{
                background: #CCE8CF;
                border-radius: 3px 3px 3px 3px;
                border: 1px solid #CCE8CF;
                font-weight: 400;
                font-size: 18px;
                color: #146043;
            }
        }
    }
    .card-body{
        height: calc(100% - 84px);
        padding: 0 32px 28px;
        ::v-deep .el-textarea{
            width: 100%;
            height: 100%;
            border-radius: 5px 5px 5px 5px;
            .el-textarea__inner{
                height: 100%;
                box-shadow: inset 0px 3px 6px 1px rgba(0,0,0,0.16);
                border: 1px solid #000000;
                background-color: transparent;
                font-weight: 400;
                font-size: 30px;
                color: #000000;
            }
        }
    }
}
</style>
