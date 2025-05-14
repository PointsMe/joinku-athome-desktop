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
                        @click="paySign()">
                        {{ $t('confirmSign') }}
                    </el-button>
                </div>
                <div class="btn">
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
 * InitiateRequested: 发起支付    Initiated: 已发起    Authorized: 已授权     Canceled: 已取消    签名验证通过: SignatureVerificationAccepted
 * SignatureVerificationRejected: 签名验证拒绝      SignatureVerificationRequired: 需要签名验证     Expired: 已过期     Declined: 已拒绝
 */
import {
    cancelPaySession,
    confirmPaySign,
    createPaySession,
    queryPayResult,
} from "@/api";

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
        }
    },
    data() {
        return {
            dialogVisible: false,
            timer: null,
            paySessionId: '',
            payStatus: '',
            finalStatus: 100,   // 100: 支付中     101: 支付成功   102: 支付失败
            disabled: false
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
                return this.$t('payFail')
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
            this.finalStatus = 100
            this.startPaySession()
        },
    
        // 创建支付会话
        startPaySession () {
            let params = {
                terminalId: localStorage.getItem("posId"),
                paymentIntentId: this.paymentIntentId
            }
            createPaySession(params).then(res => {
                if(res.code === 20000){
                    this.paySessionId = res.data.id
                    this.startTimer()
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
    
        // 取消支付会话
        endPaySession () {
            let params = {
                paySessionId: this.paySessionId
            }
            this.disabled = true
            cancelPaySession(params).then(res => {
                if(res.code === 20000){
                    this.finalStatus = 102
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.disabled = false
            })
        },
    
        // 确认支付签名
        paySign () {
            let params = {
                paySessionId: this.paySessionId,
                accepted: true
            }
            this.disabled = true
            confirmPaySign(params).then(res => {
                if(res.code === 20000){
                    console.log('confirm')
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(error => {
                this.$message.error(error);
            }).finally(() => {
                this.disabled = false
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
            let params = {
                paySessionId: this.paySessionId
            }
            queryPayResult(params).then(res => {
                if(res.code === 20000){
                    const status = res.data.status
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
                        setTimeout(() => {
                            this.dialogVisible = false
                        }, 1000)
                    } else {
                        this.finalStatus = 100
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
        
        // 关闭弹窗
        dialogClose () {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
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
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
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
