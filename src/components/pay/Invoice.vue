<template>
    <el-dialog
        :title="$t('invoice')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="dialogClose"
        center
        custom-class="medium-dialog">
        <div class="content">
            <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('type')">
                            <el-radio-group v-model="formData.type" @change="typeChange">
                                <el-radio-button :label="101">{{$t('company')}}</el-radio-button>
                                <el-radio-button :label="102">{{$t('personal')}}</el-radio-button>
                                <el-radio-button :label="103">{{$t('bussiness')}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="name" :label="$t('companyName')" key="name" v-if="formData.type === 101 || formData.type === 103">
                            <el-input v-model="formData.name" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('personalName')" v-if="formData.type === 102">
                            <el-input v-model="formData.name" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('receiptCode')" prop="receiptCode">
                            <el-input v-model="formData.receiptCode" clearable show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('receiptEmail')" prop="receiptEmail">
                            <el-input v-model="formData.receiptEmail" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('vatNumber')" class="search" prop="vatNumber" key="vatNumber" v-if="formData.type === 101 || formData.type === 103">
                            <span slot="label" style="font-weight: bold;color: #606266;">
                                <i class="el-icon-search" style="margin-right: 5px;"></i>
                                {{$t('vatNumber')}}
                            </span>
                            <el-autocomplete v-model="formData.vatNumber" :fetch-suggestions="searchVatNumber" @select="handleSelectInvoice">
                                <template slot-scope="{ item }">
                                    <div class="name" style="width: 100%;word-wrap:break-word;line-height: 20px;white-space: normal;">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item :label="$t('taxCode')" class="search" prefix-icon="el-icon-search" prop="taxCode" key="taxCode" v-if="formData.type === 101 || formData.type === 102">
                            <span slot="label" style="font-weight: bold;color: #606266;"><i class="el-icon-search" style="margin-right: 5px;"></i>{{$t('taxCode')}}</span>
                            <el-autocomplete v-model="formData.taxCode" :fetch-suggestions="searchTaxCode" @select="handleSelectInvoice">
                                <template slot-scope="{ item }">
                                    <div class="name" style="width: 100%;word-wrap:break-word;line-height: 20px;white-space: normal;">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('country')" prop="country">
                            <el-select clearable v-model="formData.country" filterable @change="countryChange">
                                <el-option
                                    v-for="item in countryOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('province')" prop="province">
                            <el-select clearable filterable v-model="formData.province">
                                <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('city')" prop="city">
                            <el-input v-model="formData.city" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('address')" prop="address">
                            <el-input v-model="formData.address" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('zipcode')" prop="zipcode">
                            <el-input v-model="formData.zipcode" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('contactName')" prop="contactName">
                            <el-input v-model="formData.contactName" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('contactPhone')" prop="contactPhone">
                            <el-input v-model="formData.contactPhone" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('contactEmail')" prop="email">
                            <el-input v-model="formData.contactEmail" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button type="primary" @click="confirmHandle">{{$t('confirm')}}</el-button>
        </span>
    </el-dialog>
</template>
<script>

import {queryCountryList, queryMemberDetail, queryMemberList, queryProvinceList} from '@/api'

export default {
    name: 'Invoice',
    components: {
    
    },
    props: {
        showDialog: {
            type: Boolean,
            default: true
        },
        memberId: {
            type: String,
            default: ''
        }
    },
    data() {
        const validateCompanyName = (rule, value, callback) => {
            if (this.formData.type === 101 || this.formData.type === 103) {
                if (!this.formData.name) {
                    return callback(new Error(this.$t('inpContentHint')))
                }
                if (this.formData.name.length < 1 || this.formData.name.length > 80) {
                    return callback(new Error(this.$t('len1_80')))
                }
            }
            callback()
        }
        const validateInvoiceCode = (rule, value, callback) => {
            if (!this.formData.receiptCode) {
                return callback(new Error(this.$t('inpContentHint')))
            }
            if ((this.formData.type === 101 || this.formData.type === 102) && this.formData.receiptCode.length !== 7) {
                return callback(new Error(this.$t('leng7')))
            }
            if (this.formData.type === 103 && this.formData.receiptCode.length !== 6) {
                return callback(new Error(this.$t('leng6')))
            }
            callback()
        }
        const validateCompanyTaxNo = (rule, value, callback) => {
            if (this.formData.type === 101 || this.formData.type === 103) {
                if (!value) {
                    return callback(new Error(this.$t('inpContentHint')))
                }
                if (value.length < 1 || value.length > 28) {
                    return callback(new Error(this.$t('len1_28')))
                }
            }
            callback()
        }
        const validateGeneralTaxNo = (rule, value, callback) => {
            if (this.formData.type === 102) {
                if (!value) {
                    return callback(new Error(this.$t('inpContentHint')))
                }
                if (value.length < 1 || value.length > 28) {
                    return callback(new Error(this.$t('len1_28')))
                }
            }
            callback()
        }
        return {
            oneClick: false,
            dialogVisible: false,
            tmpQuery: null,
            countryOptions: [],
            provinceOptions: [],
            formData: {
                type: 101,
                name: '',
                vatNumber:'',
                taxCode:'',
                address: '',
                zipcode: '',
                city: '',
                province: '',
                country: '',
                contactPhone:'',
                contactName:'',
                contactEmail:'',
                receiptCode:'0000000',
                receiptEmail:'',
            },
            rules: {
                name: [
                    { required: true,validator: validateCompanyName, trigger: 'change' }
                ],
                country: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' }
                ],
                province: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' }
                ],
                city: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' },
                    { min: 1, max: 60, message: this.$t('len1_60'), trigger: 'blur' }
                ],
                zipcode: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' },
                    { min: 5, max: 6, message: this.$t('len5_6'), trigger: 'blur' }
                ],
                address: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' },
                    { min: 1, max: 60, message: this.$t('len1_60'), trigger: 'blur' }
                ],
                receiptEmail: [
                    { min: 5, max: 200, message: this.$t('len5_200'), trigger: 'change' },
                ],
                receiptCode: [
                    { required: true, trigger: 'change', validator: validateInvoiceCode },
                ],
                vatNumber: [
                    {  required: false, validator: validateCompanyTaxNo, trigger: 'change' }
                ],
                taxCode: [
                    { required: false, validator: validateGeneralTaxNo, trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        initData() {
            this.dialogVisible = true
            this.provinceOptions = []
            this.formData = {
                type: 101,
                name: '',
                vatNumber: '',
                taxCode: '',
                address: '',
                zipcode: '',
                city: '',
                province: '',
                country: '',
                contactName: '',
                contactPhone: '',
                contactEmail: '',
                receiptCode: '0000000',
                receiptEmail: '',
            }
            if (this.countryOptions.length === 0) {
                this.getCountryList()
            } else if (this.memberId) {
                this.getMemberDetail()
            }
        },
        // 获取会员详情
        getMemberDetail () {
            let params = {
                id: this.memberId
            }
            queryMemberDetail(params).then(res => {
                if (Number(res.code) === 20000) {
                    const resData = res.data
                    this.formData = {
                        type: resData.type === 101 ? 102 : 101,
                        name: resData.username,
                        vatNumber: resData.vatNumber,
                        taxCode: resData.taxCode,
                        address: resData.address.address,
                        zipcode: resData.address.zipcode,
                        city: resData.address.city,
                        province: '',
                        country: '',
                        contactName: resData.address.contactName,
                        contactPhone: resData.mobile || '',
                        contactEmail: resData.email || '',
                        receiptCode: resData.settleSetting.receiptCode ? resData.settleSetting.receiptCode : '0000000',
                        receiptEmail: resData.settleSetting.receiptEmail,
                    }
                    // 国家和省
                    if (!resData.address.country) return
                    const currentCountry = this.countryOptions.find(item => item.name === resData.address.country)
                    if (currentCountry !== undefined) {
                        this.formData.country = currentCountry.name
                        let province = resData.address.province || ''
                        this.getProvinceList(currentCountry.id, province)
                    }
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
        // 发票搜索
        searchVatNumber(queryString, cb) {
            if (queryString.length < 3) {
                cb([])
                return
            }
            this.querySearchAsync('vatNumber', queryString, cb);
        },
        searchTaxCode(queryString, cb) {
            if (queryString.length < 3) {
                cb([])
                return
            }
            this.querySearchAsync('taxCode', queryString, cb);
        },
        querySearchAsync(type, queryString, cb) {
            let params = {
                keyword: '',
                page: 1,
                size: 10
            }
            if (type === 'vatNumber') {
                params.vatNumber = queryString
            } else if (type === 'taxCode') {
                params.taxCode = queryString
            }
            queryMemberList(params).then(res => {
                if (res.code === 20000) {
                    let list = res.data.list || []
                    let useableList = []
                    list.forEach(item => {
                        let type = 100
                        if (this.formData.type === 101) {
                            type = 102
                        } else if (this.formData.type === 102) {
                            type = 101
                        } else if (this.formData.type === 103) {
                            type = 103
                        }
                        if (type === item.type) {
                            if (item.vatNumber) {
                                useableList.push({
                                    ...item,
                                    value: `${item.username} - ${item.vatNumber}`
                                })
                            } else if (item.taxCode){
                                useableList.push({
                                    ...item,
                                    value: `${item.username} - ${item.taxCode}`
                                })
                            } else {
                                useableList.push({
                                    ...item,
                                    value: item.username
                                })
                            }
                        }
                    })
                    cb(useableList);
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((err) => {
                this.$message.error(err);
            });
        },
        // 发票搜索选择
        handleSelectInvoice(data) {
            this.formData = {
                type: data.type === 101 ? 102 : 101,
                name: data.username,
                vatNumber: data.vatNumber,
                taxCode: data.taxCode,
                address: data.address.address,
                zipcode: data.address.zipcode,
                city: data.address.city,
                province: '',
                country: '',
                contactName: data.address.contactName,
                contactPhone: data.mobile || '',
                contactEmail: data.email || '',
                receiptCode: data.settleSetting.receiptCode ? data.settleSetting.receiptCode : '0000000',
                receiptEmail: data.settleSetting.receiptEmail,
            }
            // 国家和省
            if (!data.address.country) return
            const currentCountry = this.countryOptions.find(item => item.name === data.address.country)
            if (currentCountry !== undefined) {
                this.formData.country = currentCountry.name
                let province = data.address.province || ''
                this.getProvinceList(currentCountry.id, province)
            }
        },
        // 切换类型
        typeChange() {
            if (this.formData.type === 103) {
                this.formData.receiptCode = '000000';
            } else if (this.formData.type === 101 || this.formData.type === 102) {
                this.formData.receiptCode = '0000000';
            }
            this.formData.name = '';
            this.formData.receiptEmail = '';
            this.formData.country = 'IT'; // 默认意大利
            this.formData.city = '';
            this.formData.province = '';
            this.formData.address = '';
            this.formData.zipcode = '';
            this.formData.vatNumber = '';
            this.formData.taxCode = '';
            this.formData.contactPhone = '';
            this.formData.contactName = '';
            this.formData.contactEmail = '';
        },
        
        // 获取国家
        getCountryList () {
            queryCountryList().then(res => {
                if (res.code === 20000) {
                    this.countryOptions = res.data || []
                    if (this.memberId) {
                        this.getMemberDetail()
                    }
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
        getProvinceList (id, name = '') {
            let params = {
                countryId: id
            }
            queryProvinceList(params).then(res => {
                if (res.code === 20000) {
                    this.provinceOptions = res.data || []
                    if (name) {
                        const currentProvince = this.provinceOptions.find(item => item.name === name)
                        if (currentProvince !== undefined) {
                            this.formData.province = name
                        }
                    }
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
        // 重置表单
        resetForm () {
            this.$refs.ruleForm.resetFields()
        },
        // 确定
        confirmHandle() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.$emit('parent-update', {
                        ...this.formData
                    });
                    this.dialogVisible = false
                }
            });
        },
        // 关闭弹框
        dialogClose() {
            // 重置表单
            this.resetForm()
            this.$emit('parent-close');
        },
    },
    // 监控data中的数据变化
    watch: {
        showDialog (val) {
            if (val) {
                this.initData()
            }
        }
    },
    created() {
    
    },
    mounted() {
    
    },
    computed: {
    
    },
}
</script>
<style lang="scss" scoped>
::v-deep .el-form{
    .el-select{
        width: 100%;
    }
    .el-autocomplete{
        width: 100%;
    }
}
</style>
