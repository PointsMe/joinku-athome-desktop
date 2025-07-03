<template>
    <div class="card">
        <div class="card-header border-b">
            <div class="card-header-left">
                <span class="text" v-if="productHandleType === 100">{{ $t('number') }}&nbsp;=&nbsp;</span>
                <span class="text" v-else-if="productHandleType === 101">{{ $t('number') }}&nbsp;X&nbsp;</span>
                <span class="text" v-else-if="productHandleType === 104">{{ $t('price') }}&nbsp;=&nbsp;</span>
                <span class="text" v-else-if="productHandleType === 105">{{ $t('zhekou') }}&nbsp;-&nbsp;</span>
                <el-input
                    v-model="value"
                    id="property_value"
                    ref="valueRef"
                    @keydown.native="valueKeydown"
                    clearable>
                </el-input>
                <span class="text" v-if="productHandleType === 105">&nbsp;%</span>
            </div>
            <div class="card-header-right">
                <el-button :disabled="!value" @click="confirmHandle">{{ $t('confirm') }}</el-button>
            </div>
        </div>
        <div class="card-body">
            <div class="code">
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('1')">1</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('2')">2</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('3')">3</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-b" @click="clickCode('delete')">
                            <i class="iconfont icon-remove"></i>
                        </a>
                    </div>
                </div>
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('4')">4</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('5')">5</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r border-b" @click="clickCode('6')">6</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-b" @click="clickCode('dot')">
                            <i class="iconfont icon-dot"></i>
                        </a>
                    </div>
                </div>
                <div class="code-row">
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('7')">7</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('8')">8</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in border-r" @click="clickCode('9')">9</a>
                    </div>
                    <div class="item">
                        <a href="javascript:void(0)" class="item-in" @click="clickCode('0')">0</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validateFloat, validateZeroFloat} from "@/utils/validate";
import {formatFloat} from "@/utils/common";

export default {
    name: "ProductProperty",
    // 组件
    components: {},
    props: {
        productHandleType: {
            type: [String, Number],
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
    watch: {
        productHandleType () {
            this.initValue()
        }
    },
    // 方法集合
    methods: {
        initValue () {
            this.value = ''
            this.$refs.valueRef.$el.querySelector('input').focus();
        },
        // 点击键盘
        clickCode (code) {
            if (code === 'delete') {
                this.value = this.value.slice(0, -1)
            } else if (code === 'dot') {
                this.value = this.value + ','
            } else {
                this.value = this.value + code
            }
        },
        // 按键
        valueKeydown (event) {
            if (event.key === 'Pause' || event.key === 'Enter') {
                this.confirmHandle()
            }
        },
        // 确定
        confirmHandle () {
            if (!this.value) return;
            // 100 改数量   101 数量X  104 改价   105 打折
            if (this.productHandleType === 100 || this.productHandleType === 101 || this.productHandleType === 104) {
                if (!validateFloat(this.value)) {
                    this.$message({
                        showClose: true,
                        message: this.$t('inpNotRule'),
                        type: 'warning'
                    })
                    return
                }
                this.$emit('property-update', formatFloat(this.value))
            } else if (this.productHandleType === 105) {
                if (!validateFloat(this.value) || formatFloat(this.value) >= 100) {
                    this.$message({
                        showClose: true,
                        message: this.$t('inpNotRule'),
                        type: 'warning'
                    })
                    return
                }
                this.$emit('property-update', formatFloat(this.value))
            }
        },
    },
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
        this.$nextTick(() => {
            this.$refs.valueRef.$el.querySelector('input').focus();
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
            ::v-deep .el-input{
                width: 158px;
                border-radius: 5px 5px 5px 5px;
                .el-input__inner{
                    height: 50px;
                    box-shadow: inset 0px 3px 6px 1px rgba(0,0,0,0.16);
                    border: 1px solid #000000;
                    background-color: transparent;
                    font-weight: 400;
                    font-size: 30px;
                    color: #000000;
                }
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
        .code{
            width: 100%;
            height: 100%;
            .code-row{
                width: 100%;
                height: 33.33%;
                display: flex;
                .item{
                    width: 25%;
                    height: 100%;
                    .item-in{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 400;
                        font-size: 24px;
                        color: #000000;
                        .iconfont{
                            font-size: 30px;
                        }
                    }
                }
            }
        }
    }
}
.border-r {
    position: relative;
}

.border-r::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #707070;
    content: "";
}
.border-b {
    position: relative;
}

.border-b::before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #707070;
    content: "";
}
</style>
