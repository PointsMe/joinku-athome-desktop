<template>
    <el-dialog :title="$t('couponOrCode')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               custom-class="medium-dialog">
        <div class="content">
            <el-tabs v-model="activeName">
                <el-tab-pane :label="$t('coupon')" name="coupon">
                    <div class="card coupon">
                        <div class="list" v-if="coupons.length > 0">
                            <div class="item" v-for="item in coupons" :key="item.id">
                                <div class="item-in" :class="{active: item.usable}">
                                    <div class="item-left">
                                        <h6 class="price">
                                            €&nbsp;<span class="vital">{{ item.amount }}</span>
                                        </h6>
                                        <p class="text">{{ item.name }}</p>
                                        <p class="hint">{{ $t('full') }}{{ item.threshold }}{{ $t('usable') }}</p>
                                    </div>
                                    <div class="item-center">
                                        <span class="dot dot-top"></span>
                                        <span class="line"></span>
                                        <span class="dot dot-bottom"></span>
                                    </div>
                                    <div class="item-right" :class="{'active-bg': item.usable && item.id !== couponCheckedId}">
                                        <span class="text" v-if="!item.usable">{{ $t('notusable') }}</span>
                                        <a
                                            class="text"
                                            href="javascript:void(0)"
                                            @click="couponSelected(item.id)"
                                            v-else-if="item.id === couponCheckedId">
                                            {{ $t('selected') }}
                                        </a>
                                        <a
                                            class="text"
                                            href="javascript:void(0)"
                                            @click="couponSelected(item.id)"
                                            v-else-if="item.id !== couponCheckedId">
                                            {{ $t('optional') }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="card-hint" v-else>{{ $t('noCoupon') }}</p>
                    </div>
                </el-tab-pane>
                <!--<el-tab-pane :label="$t('ma')" name="code">-->
                <!--    <div class="card code">-->
                <!--    -->
                <!--    </div>-->
                <!--</el-tab-pane>-->
            </el-tabs>
        </div>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary"
                       :disabled="disabled || !couponCheckedId"
                       @click="confirmHandle">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {bindDiscountCoupon} from "@/api";

export default {
    name: "Coupon",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        coupons: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            dialogVisible: false,
            activeName: 'coupon',
            couponCheckedId: '',
            disabled: false
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
            this.couponCheckedId = ''
        },
        // 切换优惠券选中
        couponSelected (id) {
            if (id === this.couponCheckedId) {
                this.couponCheckedId = ''
            } else {
               this.couponCheckedId = id
            }
        },
        // 确定
        confirmHandle () {
            let params = {
                couponId: this.couponCheckedId
            }
            this.disabled = true
            bindDiscountCoupon(params).then(res => {
                if (res.code === 20000) {
                    this.$emit('parent-update')
                    this.dialogVisible = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err);
            }).finally(() => {
                this.disabled = false
            })
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
.card{
    max-height: 560px;
    overflow-y: auto;
    .card-hint{
        margin-top: 60px;
        margin-bottom: 30px;
        color: #2E3B2C;
        font-size: 16px;
        line-height: 30px;
        text-align: center;
    }
}
.coupon{
    .list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .item{
            width: 33.33%;
            height: 157px;
            padding: 6px;
            .item-in{
                width: 100%;
                height: 100%;
                background-color: #CFCFCF;
                display: flex;
                justify-content: space-between;
                position: relative;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                .item-left{
                    width: calc(100% - 52px);
                    height: 100%;
                    padding: 12px 24px;
                    .price{
                        color: #f23030;
                        font-size: 18px;
                        .vital{
                            font-size: 34px;
                        }
                    }
                    .text{
                        margin-top: 6px;
                        font-size: 14px;
                        color: #2E3B2C;
                    }
                    .hint{
                        margin-top: 6px;
                        display: inline-block;
                        padding: 4px 8px;
                        color: #f23030;
                        font-size: 14px;
                        background-color: #fff4ec;
                    }
                }
                .item-center{
                    position: absolute;
                    width: 18px;
                    right: 43px;
                    top: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    .dot{
                        width: 18px;
                        height: 9px;
                        background-color: #FFFFFF;
                    }
                    .dot-top{
                        border-radius: 0 0 9px 9px;
                    }
                    .dot-bottom{
                        border-radius: 9px 9px 0 0;
                    }
                    .line{
                        width: 3px;
                        height: 100%;
                        background: url(https://misc.360buyimg.com/user/quan/3.0.0/widget/quan-index/i/small-circle.png) top left repeat-y;
                    }
                }
                .item-right{
                    width: 52px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .text{
                        width: 18px;
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                }
                &.active{
                    .item-left{
                        background-color: #FFFFFF;
                    }
                    .active-bg{
                        background-color: #fb0f3a;
                    }
                }
            }
        }
    }
}
</style>
