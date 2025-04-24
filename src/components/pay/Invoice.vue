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
                            <el-radio-group v-model="formData.type" size="small" @change="typeChange">
                                <el-radio-button :label="101">{{$t('company')}}</el-radio-button>
                                <el-radio-button :label="102">{{$t('personal')}}</el-radio-button>
                                <el-radio-button :label="103">{{$t('bussiness')}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="name" key="name" class="search" v-if="formData.type === 101 || formData.type === 103">
                            <span slot="label" style="font-weight: bold;color: #606266;">
                                <i class="el-icon-search" style="margin-right: 5px;"></i>
                                {{$t('companyName')}}
                            </span>
                            <el-autocomplete v-model="formData.name" size="small" :fetch-suggestions="querySearch1" @select="handleSelectInvoice">
                                <template slot-scope="{ item }">
                                    <div class="name" style="width: 100%;word-wrap:break-word;line-height: 20px;white-space: normal;">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item class="sInfo" v-if="formData.type === 102">
                            <span slot="label">
                                {{$t('personalName')}}
                            </span>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item prop="firstName" key="firstName">
                                        <el-input :placeholder="$t('firstName')" v-model="formData.firstName" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="lastName" key="lastName">
                                        <el-input :placeholder="$t('lastName')" v-model="formData.lastName" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item :label="$t('receiptCode')" prop="receiptCode">
                            <el-input v-model="formData.receiptCode" size="small" clearable show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('receiptEmail')" prop="receiptEmail">
                            <el-input v-model="formData.receiptEmail" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('vatNumber')" class="search" prop="vatNumber" key="vatNumber" v-if="formData.type === 101 || formData.type === 103">
                            <span slot="label" style="font-weight: bold;color: #606266;">
                                <i class="el-icon-search" style="margin-right: 5px;"></i>
                                {{$t('vatNumber')}}
                            </span>
                            <el-autocomplete v-model="formData.vatNumber" size="small" :fetch-suggestions="querySearch2" @select="handleSelectInvoice">
                                <template slot-scope="{ item }">
                                    <div class="name" style="width: 100%;word-wrap:break-word;line-height: 20px;white-space: normal;">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item :label="$t('taxCode')" class="search" prefix-icon="el-icon-search" prop="taxCode" key="taxCode" v-if="formData.type === 101 || formData.type === 102">
                            <span slot="label" style="font-weight: bold;color: #606266;"><i class="el-icon-search" style="margin-right: 5px;"></i>{{$t('taxCode')}}</span>
                            <el-autocomplete v-model="formData.taxCode" size="small" :fetch-suggestions="querySearch3" @select="handleSelectInvoice">
                                <template slot-scope="{ item }">
                                    <div class="name" style="width: 100%;word-wrap:break-word;line-height: 20px;white-space: normal;">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('country')" prop="country">
                            <el-select clearable v-model="formData.country" size="small" @change="countryChange">
                                <el-option
                                    v-for="item in countryOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('province')" prop="province">
                            <el-select clearable v-model="formData.province" size="small">
                                <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('city')" prop="city">
                            <el-input v-model="formData.city" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('address')" prop="address">
                            <el-input v-model="formData.address" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('zipcode')" prop="zipcode">
                            <el-input v-model="formData.zipcode" size="small" clearable></el-input>
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

import {invoiceSearch, queryCountryList, queryProvinceList} from '@/api'
const REGION = require('@/assets/data/region.json')
export default {
    name: 'Invoice',
    components: {
    
    },
    props: {
        showDialog: {
            type: Boolean,
            default: true
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
                if (!this.formData.vatNumber) {
                    return callback(new Error(this.$t('inpContentHint')))
                }
                if (this.formData.vatNumber.length < 1 || this.formData.vatNumber.length > 28) {
                    return callback(new Error(this.$t('len1_28')))
                }
            }
            callback()
        }
        const validateGeneralTaxNo = (rule, value, callback) => {
            if (this.formData.type === 102) {
                if (!this.formData.taxCode) {
                    return callback(new Error(this.$t('inpContentHint')))
                }
                if (this.formData.taxCode.length < 11 || this.formData.taxCode.length > 16) {
                    return callback(new Error(this.$t('len11_16')))
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
                companyId:'',
                type: 101,
                name: '',
                lastName: '',
                firstName: '',
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
                    { min: 5, max: 5, message: this.$t('leng5'), trigger: 'blur' }
                ],
                address: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' },
                    { min: 1, max: 60, message: this.$t('len1_60'), trigger: 'blur' }
                ],
                firstName: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' }
                ],
                lastName: [
                    { required: true, message: this.$t('inpContentHint'), trigger: 'change' }
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
                companyId: '',
                type: 101,
                name: '',
                lastName: '',
                firstName: '',
                vatNumber: '',
                taxCode: '',
                address: '',
                zipcode: '',
                city: '',
                province: '',
                country: '',
                contactPhone: '',
                contactName: '',
                contactEmail: '',
                receiptCode: '0000000',
                receiptEmail: '',
            }
            if (this.countryOptions.length === 0) {
                this.getCountryList()
            }
        },
        // 发票搜索
        querySearch1(queryString, cb) {
            this.querySearchAsync('name', queryString, cb);
        },
        querySearch2(queryString, cb) {
            this.querySearchAsync('ctn', queryString, cb);
        },
        querySearch3(queryString, cb) {
            this.querySearchAsync('gtn', queryString, cb);
        },
        querySearchAsync(type, queryString, cb) {
            let params = {
                type: this.formData.type
            }
            if (type === 'name') {
                params.name = this.formData.name
            } else if (type === 'ctn') {
                params.vatNumber = this.formData.vatNumber
            } else if (type === 'gtn') {
                params.taxCode = this.formData.taxCode
            }
            invoiceSearch(params).then(res => {
                if (res.code === 20000) {
                    let list = res.data || []
                    let useableList = []
                    list.forEach(item => {
                        if (this.formData.type === item.type) {
                            let name = ''
                            if (item.type === 102) { //个人
                                name = item.firstName + ' ' + item.lastName;
                            } else if (item.type === 101 || item.type === 103) {
                                name = item.name;
                            }
                            if (item.vatNumber) {
                                useableList.push({
                                    ...item,
                                    value: `${name} - ${item.vatNumber}`
                                })
                            } else if (item.taxCode){
                                useableList.push({
                                    ...item,
                                    value: `${name} - ${item.taxCode}`
                                })
                            } else {
                                useableList.push({
                                    ...item,
                                    value: name
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
            if (this.formData.type === 102) { // 个人
                this.formData.firstName = data.firstName;
                this.formData.lastName = data.lastName;
            } else if (this.formData.type === 101 || this.formData.type === 103) {
                this.formData.name = data.name;
            }
            this.formData.receiptCode = data.receiptCode ? data.receiptCode : (this.formData.type === 103 ? '000000' : '0000000');
            this.formData.receiptEmail = data.receiptEmail;
            // this.formData.country = data.country;
            // this.formData.province = data.province;
            this.formData.city = data.city;
            this.formData.address = data.address;
            this.formData.zipcode = data.zipcode;
            this.formData.taxCode = data.taxCode;
            this.formData.contactPhone = data.contactPhone;
            this.formData.contactName = data.contactName;
            this.formData.contactEmail = data.contactEmail;
            this.formData.vatNumber = data.vatNumber;
            this.formData.companyId = data.id;
            // 国家和省
            const currentCountry = this.countryOptions.find(item => item.code === data.country)
            if (currentCountry === undefined) {
                this.formData.country = ''
                this.formData.province = ''
            } else {
                this.formData.country = currentCountry.code
                this.getProvinceList(currentCountry.id, data.province)
            }
        },
        // 切换类型
        typeChange() {
            if (this.formData.type === 103) {
                this.formData.receiptCode = '000000';
            } else if (this.formData.type === 101 || this.formData.type === 102) {
                this.formData.receiptCode = '0000000';
            }
            this.formData.receiptEmail = '';
            this.formData.country = 'IT'; //默认意空
            this.formData.city = '';
            this.formData.province = '';
            this.formData.address = '';
            this.formData.zipcode = '';
            this.formData.vatNumber = '';
            this.formData.taxCode = '';
            this.formData.firstName = '';
            this.formData.lastName = '';
            this.formData.contactPhone='';
            this.formData.contactName='';
            this.formData.contactEmail='';
            this.formData.name = '';
            this.formData.companyId = '';
            this.$refs.ruleForm.clearValidate();
        },
        
        // 获取国家
        getCountryList () {
            queryCountryList().then(res => {
                if (res.code === 20000) {
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
        getProvinceList (id, code = '') {
            let params = {
                countryId: id
            }
            queryProvinceList(params).then(res => {
                if (res.code === 20000) {
                    this.provinceOptions = res.data || []
                    if (code) {
                        const currentProvince = this.provinceOptions.find(item => item.code === code)
                        if (currentProvince !== undefined) {
                            this.formData.province = code
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
            this.$refs['ruleForm'].resetFields()
        },
        // 确定
        confirmHandle() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let countryName = ''
                    let provinceName = ''
                    if (this.formData.country) {
                        const currentCountry = this.countryOptions.find(item => item.code === this.formData.country)
                        if (currentCountry !== undefined) {
                            countryName = currentCountry.name
                        }
                    }
                    if (this.formData.province) {
                        const currentProvince = this.provinceOptions.find(item => item.code === this.formData.province)
                        if (currentProvince !== undefined) {
                            provinceName = currentProvince.name
                        }
                    }
                    this.$emit('parent-update', {
                        ...this.formData,
                        countryName,
                        provinceName
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
        },
        showInvoice() {
            if (this.showInvoice) {
                this.formData = {
                    name: '',
                    type: '101',
                    lastName: '',
                    firstName: '',
                    receiptCode: '0000000',
                    receiptEmail: '',
                    address: '',
                    zipcode: '',
                    city: '',
                    province: '',
                    country: '',
                    vatNumber: '',
                    taxCode: '',
                    companyId: '',
                    contactPhone:'',
                    contactName:'',
                    contactEmail:'',
                }
                this.formData.country = 'IT'; //默认意大利
                this.loadProvinceList();
            }
        }
    },
    created() {
    
    },
    mounted() {
        this.countryList = REGION;
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
