<template>
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @close="dialogClose"
               center
               top="5vh"
               custom-class="large-dialog">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="auto">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('type')" prop="type">
                            <el-radio-group v-model="formData.type">
                                <el-radio :label="101">{{ $t('personal') }}</el-radio>
                                <el-radio :label="102">{{ $t('company') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('name')" prop="username">
                            <el-input v-model="formData.username">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('alias')" prop="remarkName">
                            <el-input v-model="formData.remarkName">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('serialNum')" prop="number" v-if="itemId">
                            <el-input
                                v-model="formData.number"
                                disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyTax')" prop="vatNumber">
                            <el-input
                                type="text"
                                v-model="formData.vatNumber"
                                maxlength="32"
                                show-word-limit
                                @blur="vatNumberBlur">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('generalTax')" prop="taxCode" key="taxCode" v-if="formData.type === 101">
                            <el-input type="text" v-model="formData.taxCode" maxlength="32" show-word-limit>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('generalTax')" v-else>
                            <el-input type="text" v-model="formData.taxCode" maxlength="28" show-word-limit>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('enabled')" prop="enabled">
                            <el-switch
                                v-model="formData.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('mobile')" prop="mobile">
                            <el-input v-model="formData.mobile">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('email')" prop="email">
                            <el-input v-model="formData.email">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('gender')" prop="gender" v-if="formData.type === 101">
                            <el-radio-group v-model="formData.gender">
                                <el-radio label="M">{{ $t('man') }}</el-radio>
                                <el-radio label="F">{{ $t('girl') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('birthday')" prop="birthday" v-if="formData.type === 101">
                            <el-date-picker
                                v-model="formData.birthday"
                                type="date"
                                format="MM-dd"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('level')" prop="level">
                            <el-select v-model="formData.level">
                                <el-option
                                    v-for="item in levelOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.level">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('contactName')" prop="contactName" v-if="companyCountry === 'ES' && formData.type === 102">
                            <el-input type="text" v-model="formData.contactName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('country')" prop="country">
                            <el-select v-model="formData.country" @change="countryChange" filterable>
                                <el-option
                                    v-for="item in countryOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('city')" prop="city">
                            <el-input type="text" v-model="formData.city"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('address')" prop="address">
                            <el-input
                                type="textarea"
                                v-model="formData.address"
                                :rows="3"
                                maxlength="100"
                                show-word-limit>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('contactPhone')" prop="contactPhone" v-if="companyCountry === 'ES' && formData.type === 102">
                            <el-input type="text" v-model="formData.contactPhone"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('province')" prop="province">
                            <el-select v-model="formData.province" filterable>
                                <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('zipcode')" prop="zipcode">
                            <el-input type="text" v-model="formData.zipcode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('vat')" prop="enabledIva" v-if="companyCountry === 'ES'">
                            <el-switch
                                v-model="formData.enabledIva"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('taxRate')" prop="taxRateTypeId" v-if="companyCountry === 'ES' && formData.enabledIva">
                            <el-select v-model="formData.taxRateTypeId" clearable>
                                <el-option
                                    v-for="item in taxRateOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('defUsePrice')" prop="defaultPriceType">
                            <el-select v-model="formData.defaultPriceType" clearable>
                                <el-option
                                    v-for="item in priceOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('bankCardNo')" prop="bankCard">
                            <el-input v-model="formData.bankCard"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('addedTaxRate')" prop="enabledReq" v-if="companyCountry === 'ES'">
                            <el-switch
                                v-model="formData.enabledReq"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('zhekou')" prop="discountRate">
                            <el-input v-model="formData.discountRate">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('receiptEmail')" prop="receiptEmail">
                            <el-input v-model="formData.receiptEmail"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('receiptCode')" prop="receiptCode">
                            <el-input v-model="formData.receiptCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
                @click="dialogVisible = false">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="primary"
                :disabled="disabled"
                @click="submitForm()">
                {{ $t('save') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    createMember,
    queryCountryList,
    queryMemberDetail,
    queryMemberLevelList,
    queryProvinceList,
    queryTaxRateList,
    updateMember,
 } from "@/api";

import {mapState} from "vuex";
import moment from "moment";
import {validateZeroFloat} from "@/utils/validate";
import {formatFloat} from "@/utils/common";

export default {
    name: "Edit",
    // 组件
    components: {},
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        itemId: {
            type: String,
            default: ''
        },
        origin: {
            type: String,
            default: 'member'
        }
    },
    data() {
        const validatorDiscount = (rule, value, callback) => {
            if (!value) {
                return callback()
            }
            if (!validateZeroFloat(value)) {
                return callback(new Error(this.$t('inpNotRule')))
            }
            if (formatFloat(value) > 100) {
                return callback(new Error(this.$t('inpNotRule')))
            }
            callback()
        };
        return {
            dialogVisible: false,
            dialogTitle: '',
            levelOptions: [],
            countryOptions: [],
            provinceOptions: [],
            taxRateOptions: [],
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
            formData: {
                type: 101,
                username: '',      // 名称
                remarkName: '',    // 别名
                mobile: '',        // 电话
                email: '',
                number: '',
                gender: '',        // 性别
                birthday: '',      // 生日
                level: '',
                vatNumber: '',
                taxCode: '',
                avatar: '',
                enabled: true,
                country: '',
                province: '',
                city: '',
                zipcode: '',
                address: '',
                houseNumber: '',
                contactName: '',
                contactPhone: '',
                bankCard: '',    // 银行卡号
                enabledIva: false,   // 增值税
                enabledReq: false,   // 附加税（西班牙商家）
                taxRateTypeId: '',  // 增值税ID
                discountRate: '',     // 折扣
                defaultPriceType: 100,   // 默认价格类型
                receiptCode: '',    // 发票码
                receiptEmail: ''   // 法定邮箱
            },
            rules: {
                type: [{ required: true, message: this.$t('selContentHint'), trigger: 'change' }],
                username: [{ required: true, message: this.$t('inpContentHint'), trigger: 'blur' }],
                vatNumber: [],
                taxCode: [{ required: true, message: this.$t('inpContentHint'), trigger: 'blur' }],
                mobile: [{ required: true, message: this.$t('inpContentHint'), trigger: 'blur' }],
                level: [{ required: true, message: this.$t('selContentHint'), trigger: 'change' }],
                address: [{ required: true, message: this.$t('inpContentHint'), trigger: 'blur' }],
                discountRate: [{ required: false, validator: validatorDiscount, trigger: 'blur' }],
            },
            addressId: '',
            settleSettingId: '',
            disabled: false
        };
    },
    // 计算属性
    computed: {
        ...mapState({
            companyCountry: state => state.shopInfo.companyCountry   // 国家
        }),
    },
    // 监控data中的数据变化
    watch: {
        showDialog (val) {
            if (val) {
                this.initData()
            }
        },
        'formData.type' (val) {
            if (val === 101) {
                this.rules.vatNumber = [{ required: false }]
            } else if (val === 102) {
                this.rules.vatNumber = [{ required: true, message: this.$t('inpContentHint'), trigger: 'blur' }]
            }
            this.$nextTick(() => {
                this.$refs.ruleForm.clearValidate(['vatNumber'])
            })
        }
    },
    // 方法集合
    methods: {
        // 初始化数据
        initData () {
            this.dialogVisible = true
            if (this.itemId) {
                this.dialogTitle = this.$t('editMember')
                this.getDetail()
            } else {
                this.dialogTitle = this.$t('addMember')
            }
            // 获取等级
            if (this.levelOptions.length === 0) {
                this.getLevelList()
            }
            // 获取国家
            if (this.countryOptions.length === 0) {
                this.getCountryList()
            }
            // 获取税率列表
            if (this.taxRateOptions.length === 0) {
                this.getTaxRateList()
            }
        },
    
        // 获取详情
        getDetail () {
            let params = {
                id: this.itemId
            }
            queryMemberDetail(params).then(res => {
                if (Number(res.code) === 20000) {
                    const resData = res.data
                    let birthday = ''
                    if (resData.birthday) {
                        const str = resData.birthday.toString();
                        const formattedDate = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
                        birthday = moment(formattedDate).format('YYYY-MM-DD')
                    }
                    this.formData = {
                        type: resData.type,
                        username: resData.username,      // 名称
                        remarkName: res.data.remarkName,    // 别名
                        mobile: resData.mobile,        // 电话
                        email: resData.email || '',
                        number: resData.number,
                        gender: resData.gender,        // 性别
                        birthday,      // 生日
                        level: resData.level,
                        vatNumber: resData.vatNumber,
                        taxCode: resData.taxCode,
                        avatar: resData.avatar,
                        enabled: resData.enabled,
                        country: resData.address.country,
                        province: resData.address.province,
                        city: resData.address.city,
                        zipcode: resData.address.zipcode,
                        address: resData.address.address,
                        houseNumber: resData.address.houseNumber,
                        contactName: resData.address.contactName,
                        contactPhone: resData.address.contactPhone,
                        bankCard: resData.settleSetting.bankCard,    // 银行卡号
                        enabledIva: resData.settleSetting.enabledIva || false,   // 增值税
                        enabledReq: resData.settleSetting.enabledReq || false,   // 附加税（西班牙商家）
                        taxRateTypeId: resData.settleSetting.taxRateTypeId,  // 增值税ID
                        discountRate: resData.settleSetting.discountRate,     // 折扣
                        defaultPriceType: resData.settleSetting.defaultPriceType,   // 默认价格类型
                        receiptCode: resData.settleSetting.receiptCode,    // 发票码
                        receiptEmail: resData.settleSetting.receiptEmail   // 法定邮箱
                    };
                    this.addressId = resData.address.id
                    this.settleSettingId = resData.settleSetting.id
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch(err => {
                this.$message.error(err);
            })
        },
    
        // 校验公司税号
        vatNumberBlur () {
            this.$refs.ruleForm.validateField('vatNumber')
        },

        // 获取等级列表
        getLevelList () {
            queryMemberLevelList().then(res => {
                if (res.code === 20000) {
                    const list = res.data || []
                    this.levelOptions = list.filter(item => item.enabled)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        },
    
        // 获取国家
        getCountryList () {
            queryCountryList().then(res => {
                if (Number(res.code) === 20000) {
                    this.countryOptions = res.data || []
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        },
        // 切换国家
        countryChange (val) {
            this.formData.province = ''
            this.provinceOptions = []
            const currentCountry = this.countryOptions.find(item => item.name === val)
            if (currentCountry === undefined) return;
            this.getProvinceList(currentCountry.id)
        },
        // 获取省
        getProvinceList (id) {
            let params = {
                countryId: id
            }
            queryProvinceList(params).then(res => {
                if (Number(res.code) === 20000) {
                    this.provinceOptions = res.data || []
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    })
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        },
    
        // 获取税率列表
        getTaxRateList() {
            let params = {
                name: ''
            }
            queryTaxRateList(params).then(res => {
                if (res.code === 20000) {
                    this.taxRateOptions = res.data || []
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
        
        // 提交表单
        submitForm () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let birthday = this.formData.birthday ? moment(this.formData.birthday).format('YYYY-MM-DD') : ''
                    let params = {
                        type: this.formData.type,
                        username: this.formData.username,      // 名称
                        remarkName: this.formData.remarkName,    // 别名
                        mobile: this.formData.mobile,        // 电话
                        email: this.formData.email,
                        // number: this.formData.number,
                        gender: this.formData.gender,        // 性别
                        birthday,      // 生日
                        level: this.formData.level,
                        vatNumber: this.formData.vatNumber,
                        taxCode: this.formData.taxCode,
                        avatar: this.formData.avatar,
                        enabled: this.formData.enabled,
                        address: {
                            id: this.addressId,
                            country: this.formData.country,
                            province: this.formData.province,
                            city: this.formData.city,
                            zipcode: this.formData.zipcode,
                            address: this.formData.address,
                            houseNumber: this.formData.houseNumber,
                            contactName: this.formData.contactName,
                            contactPhone: this.formData.contactPhone,
                        },
                        settleSetting: {
                            id: this.settleSettingId,
                            bankCard: this.formData.bankCard,    // 银行卡号
                            enabledIva: this.formData.enabledIva,   // 增值税
                            enabledReq: this.formData.enabledReq,   // 附加税（西班牙商家）
                            taxRateTypeId: this.formData.taxRateTypeId,  // 增值税ID
                            discountRate: this.formData.discountRate,     // 折扣
                            defaultPriceType: this.formData.defaultPriceType,   // 默认价格类型
                            receiptCode: this.formData.receiptCode,    // 发票码
                            receiptEmail: this.formData.receiptEmail   // 法定邮箱
                        }
                    }
                    if (this.itemId) {
                        params.id = this.itemId
                        this.sendEditRequest(params)
                    } else {
                        this.sendAddRequest(params)
                    }
                } else {
                    return false
                }
            })
        },
    
        // 提交新增
        sendAddRequest (params) {
            this.disabled = true;
            createMember(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                    if (this.origin === 'pay') {
                        this.$emit('parent-update', res.data.id)
                    } else {
                        this.$emit('parent-update')
                    }
                    this.dialogVisible = false
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
        // 提交编辑
        sendEditRequest (params) {
            this.disabled = true;
            updateMember(params).then(res => {
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                    this.$emit('parent-update')
                    this.dialogVisible = false
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
    max-height: 620px;
    overflow-x: hidden;
    overflow-y: auto;
    ::v-deep .el-form{
        .el-row{
            margin-bottom: 20px;
        }
        .el-select{
            width: 100%;
        }
    }
}
</style>
