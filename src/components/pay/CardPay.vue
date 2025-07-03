<template>
    <el-dialog :title="$t('cardPay')"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               @close="dialogClose"
               top="5vh"
               center
               custom-class="small-dialog">
        <div class="content">
            <p class="money">{{ posAmount }}&nbsp;€</p>
            <div class="content-img">
                <img src="../../assets/images/swiping_card.gif">
            </div>
            <p class="content-hint" :class="{'success': finalStatus === 101, 'fail': finalStatus === 102}">{{ payHint }}</p>
            <div class="content-handle" v-if="finalStatus === 100">
                <div class="btn" v-if="payStatus === 'SignatureVerificationRequired'">
                    <el-button
                        type="primary"
                        :disabled="disabled"
                        @click="changePaySignState(true)">
                        {{ $t('confirmSign') }}
                    </el-button>
                </div>
                <div class="btn" v-if="payStatus === 'SignatureVerificationRequired'">
                    <el-button
                        :disabled="disabled"
                        @click="changePaySignState(false)">
                        {{ $t('cancelSign') }}
                    </el-button>
                </div>
                <div class="btn" v-else>
                    <el-button
                        :disabled="disabled"
                        @click="endPaySession()">
                        {{ $t('cancelPay') }}
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
/**
 * payStatus 支付状态
 * InitiateRequested: 发起支付    Initiated: 已发起    Authorized: 已授权   SignatureVerificationRequired: 需要签名验证   签名验证通过: SignatureVerificationAccepted
 * Captured: 支付成功  Captured
 * Canceled: 已取消   CancelRequested: 取消支付    SignatureVerificationRejected: 签名验证拒绝    Expired: 已过期     Declined: 已拒绝
 */
import {
    cancelPaySession,
    confirmPaySign,
    queryPayResult,
} from "@/api/dojo";

export default {
    name: "CardPay",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        posAmount: {
            type: Number,
            default: 0
        },
        paymentIntentId: {
            type: String,
            default: ''
        },
        paySessionId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            timer: null,
            payStatus: '',
            finalStatus: 100,   // 100: 支付中     101: 支付成功   102: 支付失败
            disabled: false,
            signatureUnderway: false,   // 签名中
            signTimer: null
        };
    },
    // 计算属性
    computed: {
        payHint () {
            if (this.finalStatus === 100) {
                return this.$t('pleCardPay')
            } else if (this.payStatus === 'SignatureVerificationRequired') {
                return this.$t('pleConfirmSign')
            } else if (this.finalStatus === 101) {
                return this.$t('paySuccess')
            } else if (this.finalStatus === 102) {
                if (this.payStatus === 'Canceled' || this.payStatus === 'CancelRequested') {
                    return this.$t('payCancel')
                } else if (this.payStatus === 'SignatureVerificationRejected' || this.payStatus === 'Declined') {
                    return this.$t('payReject')
                } else if (this.payStatus === 'Canceled') {
                    return this.$t('payOvertime')
                } else {
                    return this.$t('payFail')
                }
            } else {
                return ''
            }
        }
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
            this.payStatus = ''
            this.finalStatus = 100
            this.signatureUnderway = false
            this.startTimer()
            setTimeout(() => {
                this.endTimer()
            }, 81000)
        },
    
        // 取消支付会话
        endPaySession () {
            this.disabled = true
            cancelPaySession(this.paySessionId).then(res => {
                this.finalStatus = 102
                if (!res || !res.status) return
                this.payStatus = res.status
                if (res.status === 'CancelRequested') {
                    if (this.timer) {
                        clearInterval(this.timer)
                        this.timer = null
                    }
                    setTimeout(() => {
                        this.dialogVisible = false
                    }, 1000)
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.disabled = false
            })
        },
    
        // 确认支付签名
        changePaySignState (b) {
            if (this.disabled) return;
            if (this.finalStatus !== 100) return;
            if (this.signTimer) {
                clearTimeout(this.signTimer)
                this.signTimer = null
            }
            let params = {
                accepted: b
            }
            this.disabled = true
            confirmPaySign(this.paySessionId, params).then(res => {
                if (b) {
                    this.finalStatus = 101
                } else {
                    this.finalStatus = 102
                }
                if (!res || !res.status) return
                this.payStatus = res.status
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.disabled = false
                this.signatureUnderway = false
            })
        },
    
        // 定时器
        startTimer () {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                this.getPayResult()
            }, 1000)
        },
        // 支付结果查询
        getPayResult () {
            // 签名等待中
            if (this.signatureUnderway) return;
            queryPayResult(this.paySessionId).then(res => {
                if (!res) return
                const status = res.status
                this.payStatus = status
                // 最终状态
                if (status === 'Captured') {
                    this.finalStatus = 101
                    if (this.timer) {
                        clearInterval(this.timer)
                        this.timer = null
                    }
                    setTimeout(() => {
                        this.$emit('parent-update')
                        this.dialogVisible = false
                    }, 1000)
                } else if (status === 'CancelRequested' || status === 'Canceled' || status === 'Expired' || status === 'Declined') {
                    this.finalStatus = 102
                    if (this.timer) {
                        clearInterval(this.timer)
                        this.timer = null
                    }
                    setTimeout(() => {
                        this.dialogVisible = false
                    }, 1000)
                } else if (status === 'SignatureVerificationRequired') {
                    this.finalStatus = 100
                    // 5秒后自动签名确认
                    this.signatureUnderway = true
                    this.signTimer = setTimeout(() => {
                        this.changePaySignState(true)
                    }, 5000)
                } else {
                    this.finalStatus = 100
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
     
        // 结束定时器
        endTimer () {
            if (!this.dialogVisible) return
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            this.finalStatus = 102
            setTimeout(() => {
                this.dialogVisible = false
            }, 1000)
        },
        
        // 关闭弹窗
        dialogClose () {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            if (this.signTimer) {
                clearTimeout(this.signTimer)
                this.signTimer = null
            }
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
    padding-top: 20px;
    padding-bottom: 20px;
    .money{
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 30px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        color: #146043;
    }
    .content-img{
        img{
            width: 100%;
        }
    }
    .content-hint{
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 30px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        color: #181818;
        &.success{
            color: #146043;
        }
        &.fail{
            color: #B23303;
        }
    }
    .content-handle{
        padding: 20px 30px 0;
        .btn{
            margin-bottom: 20px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
        ::v-deep .el-button{
            width: 100%;
            &.el-button--primary{
                background: #146043;
                border: none;
            }
        }
    }
}
</style>
