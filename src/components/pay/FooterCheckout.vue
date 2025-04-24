<template>
    <div class="footer-content">
        <div class="footer-left">
            <div class="member" v-if="orderData && orderData.member">
                <div class="member-left">
                    <h3 class="iva-hint" v-if="companyCountry === 'ES' && orderData.member.taxRate && orderData.member.addedTaxRate">{{ $t('conIvaReq') }}</h3>
                    <h3 class="iva-hint" v-else-if="companyCountry === 'ES' && orderData.member.taxRate">{{ $t('onlyConIva') }}</h3>
                    <h3 class="iva-hint" v-else-if="companyCountry === 'ES' && orderData.member.addedTaxRate">{{ $t('onlyConReq') }}</h3>
                    <h3 class="iva-hint" v-else-if="companyCountry === 'ES' && !orderData.member.taxRate && !orderData.member.addedTaxRate">{{ $t('noConIvaReq') }}</h3>
                    <div class="desc">
                        <div class="desc-info">
                            <p class="desc-name">{{ orderData.member.username }}</p>
                            <p class="desc-mobile">{{ orderData.member.mobile }}</p>
                        </div>
                        <div class="desc-item">
                            <span class="item-value">{{ orderData.member.totalPoints }}</span>
                            <span class="item-text">{{ $t('integral') }}</span>
                        </div>
                        <div class="desc-item">
                            <span class="item-value">{{ orderData.coupons.length }}</span>
                            <span class="item-text">{{ $t('coupon') }}</span>
                        </div>
                    </div>
                </div>
                <div class="member-right">
                    <div class="handle-left">
                        <div class="btn">
                            <el-button
                                type="success"
                                v-if="perms.includes('cs.ord.coupon') && orderData.couponDiscount"
                                @click="cancelCouponHandle">
                                {{ $t('cancelCoupon') }}
                            </el-button>
                            <el-button
                                type="success"
                                v-else-if="perms.includes('cs.ord.coupon') && !orderData.couponDiscount"
                                @click="couponHandle">
                                {{ $t('couponOrCode') }}
                            </el-button>
                        </div>
                        <div class="btn">
                            <el-button
                                type="success"
                                @click="pointsDiscountHandle"
                                v-if="perms.includes('cs.ord.points') && orderData.pointsDiscount.enabled && orderData.pointsDiscount.deductPoints === 0">
                                {{ $t('pointDeduction') }}
                            </el-button>
                            <el-button
                                type="danger"
                                @click="cancelDiscountHandle"
                                v-else-if="perms.includes('cs.ord.points') && orderData.pointsDiscount.enabled && orderData.pointsDiscount.deductPoints > 0">
                                {{ $t('cancelDeduction') }}
                            </el-button>
                        </div>
                    </div>
                    <div class="handle-right">
                        <el-button
                            type="danger"
                            @click="clearMember">
                            {{ $t('clearMember') }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="not-bound" v-else>
                <el-button class="bind-btn" @click="memberDialog = true">{{ $t('bindMember') }}</el-button>
                <el-button class="add-btn" @click="addMemberDialog = true">{{ $t('addMember') }}</el-button>
            </div>
        </div>
        <div class="footer-right">
            <div class="handle">
                <el-button type="primary" @click="openCashboxHandle">{{ $t('cashBox') }}</el-button>
            </div>
        </div>
        <!-- 绑定会员 -->
        <MemberList
            ref="memberRef"
            :showDialog="memberDialog"
            @add-member="addMemberDialog = true"
            @parent-update="bindMember"
            @parent-close="memberDialog = false" />
        <!-- 积分抵扣 -->
        <pointsDeduction
            :showDialog="pointsDialog"
            :pointsDiscount="pointsDiscount"
            @parent-update="updateOrder"
            @parent-close="pointsDialog = false" />
        <!-- 新增会员 -->
        <AddMember
            :showDialog="addMemberDialog"
            origin="pay"
            @parent-update="bindMember"
            @parent-close="addMemberDialog = false"/>
        <!-- 优惠券或码 -->
        <Coupon
            :showDialog="couponDialog"
            :coupons="coupons"
            @parent-update="updateOrder"
            @parent-close="couponDialog = false"/>
    </div>
</template>

<script>
import MemberList from "@/components/pay/MemberList";
import pointsDeduction from "@/components/pay/PointsDeduction";
import AddMember from "@/components/member/Edit";
import Coupon from "@/components/pay/Coupon";
import {bindMember, cancelDiscountCoupon, cancelPointsDeduct, clearMember} from "@/api";
import {mapState} from "vuex";
export default {
    name: "FooterCheckout",
    // 组件
    components: {
        MemberList,
        pointsDeduction,
        AddMember,
        Coupon
    },
    props: {
        orderData: {
            type: [Object, null],
            default: null
        }
    },
    data() {
        return {
            memberDialog: false,
            addMemberDialog: false,
            pointsDialog: false,
            pointsDiscount: {
                enabled: false,
                totalPoints: 0,
                availablePoints: 0,
                deductPoints: 0,
                deductAmount: 0,
                deductFactor: 0,
                minDeductCount: 0,
                maxDeductCount: 0,
                maxDeductPercent: 0
            },
            couponDialog: false,
            coupons: [],
        };
    },
    // 计算属性
    computed: {
        ...mapState(['perms']),
        ...mapState({
            companyCountry: state => state.shopInfo.companyCountry   // 国家
        }),
    },
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 开钱箱
        openCashboxHandle () {
            this.$emit('open-cashbox')
        },
    
        // 清除会员
        clearMember () {
            this.$confirm(this.$t('clearMemHint'), this.$t('hint'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                clearMember().then(res => {
                    if (res.code === 20000) {
                        this.updateOrder()
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
            }).catch(() => {})
        },
    
        // 积分抵扣
        pointsDiscountHandle () {
            if (!this.orderData) return
            this.pointsDiscount = this.orderData.pointsDiscount
            this.pointsDialog = true
        },
        // 取消积分抵扣
        cancelDiscountHandle () {
            cancelPointsDeduct().then(res => {
                if (res.code === 20000) {
                    this.updateOrder()
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
        // 绑定会员
        bindMember (id) {
            let params = {
                memberId: id
            }
            bindMember(params).then(res => {
                if (res.code === 20000) {
                    this.updateOrder()
                    if (this.memberDialog) {
                        this.$refs.memberRef.dialogVisible = false
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
        // 优惠券
        couponHandle () {
            if (!this.orderData) return
            this.coupons = this.orderData.coupons || []
            this.couponDialog = true
        },
        // 取消优惠券
        cancelCouponHandle () {
            cancelDiscountCoupon().then(res => {
                if (res.code === 20000) {
                    this.updateOrder()
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
        // 更新订单
        updateOrder () {
            // 更新会话
            this.$emit('session-update')
        },
        
        // 显示绑定会员
        cellShowMember () {
            this.memberDialog = true
        },
        // 切换弹框选中行
        toogleCheckedRow (direction) {
            if (this.memberDialog) {
                this.$refs.memberRef.toogleRow(direction)
            }
        },
        // 弹框选中项确定
        dialogRowConfirm () {
            if (this.memberDialog) {
                this.$refs.memberRef.confirmHandle()
            }
        },
        // 清除会员
        cellClearMember () {
            if (this.orderData && this.orderData.member) {
                this.clearMember()
            }
        },
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
.footer-content{
    width: 100%;
    height: 100%;
    padding-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .footer-left {
        width: calc(100% - 228px);
        height: 127px;
        .not-bound{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .el-button{
                width: 186px;
                height: 50px;
                padding-top: 0;
                padding-bottom: 0;
                margin-left: 0;
                margin-right: 0;
                border-radius: 5px 5px 5px 5px;
                font-weight: 600;
                font-size: 20px;
                color: #FFFFFF;
                white-space: normal !important;
                word-break: break-word;
            }
            .bind-btn{
                background: #146043;
            }
            .add-btn{
                background: #76B782;
            }
        }
        .member{
            width: 858px;
            height: 100%;
            padding-left: 25px;
            padding-right: 10px;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            .member-left{
                flex-grow: 1;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .iva-hint{
                    font-weight: 600;
                    font-size: 24px;
                    color: #FF9300;
                    line-height: 33px;
                }
                .desc{
                    width: 100%;
                    padding-right: 40px;
                    display: flex;
                    justify-content: space-between;
                    .desc-info{
                        .desc-name{
                            font-weight: 400;
                            font-size: 18px;
                            color: #000000;
                        }
                        .desc-mobile{
                            font-weight: 500;
                            font-size: 24px;
                            color: #000000;
                        }
                    }
                    .desc-item{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .item-value{
                            font-family: PingFang SC, PingFang SC;
                            font-weight: 600;
                            font-size: 25px;
                            color: #FF9300;
                            line-height: 36px;
                        }
                        .item-text{
                            font-weight: 400;
                            font-size: 13px;
                            color: #505050;
                            line-height: 18px;
                        }
                    }
                }
            }
            .member-right{
                width: 390px;
                height: 100%;
                padding-top: 8px;
                padding-bottom: 8px;
                display: flex;
                justify-content: space-between;
                .el-button{
                    width: 170px;
                    height: 50px;
                    padding-top: 0;
                    padding-bottom: 0;
                    margin: 0;
                    white-space: normal !important;
                    word-break: break-word;
                }
                .handle-left{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .handle-right{
                    display: flex;
                    align-items: flex-end;
                }
            }
        }
    }
    .footer-right{
        height: 127px;
        .handle{
            ::v-deep .el-button{
                width: 152px;
                height: 127px;
                padding: 0 6px;
                background: #146043;
                font-weight: 600;
                font-size: 25px;
                color: #FFFFFF;
                white-space: normal !important;
                word-break: break-word;
            }
        }
    }
}
</style>
