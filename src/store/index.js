import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        localIp: '',
        routeName: '',
        shopInfo: {
            id: '',
            name: '',
            logo: '',
            companyName: '',
            address: '',
            zipcode: '',
            vatNumber: '',
            taxCode: '',
            countryCode: 'IT',
            countryName: '',
            provinceCode: '',
            provinceName: '',
            city: '',
            companyCountry: '',
            contactPhone: ''
        },
        userName: '',
        userNumber: '',
        perms: [],    // 权限
        showLayoutAside: true,   // 显示布局菜单栏
        menuList: [],   // 菜单列表
        paymodes: [],    // 支付方式  101 现金   102 刷卡   103 饭票   104 未支付   105 抵扣券
        printerName: '',    // 打印机名称
        recordPayment: {
            finalAmount: 0,
            payments: [],
            roundingAmount: 0
        },
        // dojoConfig: {
        //     enabled: true,
        //     apiKey: 'sk_sandbox_nNMSC9JGOcJEJyVlBRCYpFJ7KR-KFoucUNvAsbqURQW6AVaW_5_KZMXGIuPqROke1PvBBRuVZDSx0VIC-maEhw',
        //     resellerId: 'YINE',
        //     softwareHouseId: 'YINE',
        //     version: '2024-02-05'
        // },
        dojoConfig: {
            enabled: false,
            apiKey: '',
            resellerId: '',
            softwareHouseId: '',
            version: ''
        }
    },
    mutations: {
        // 保存本地IP
        saveLocalIp(state, str) {
            state.localIp = str
        },
        // 保存当前路由
        saveRouteName(state, str) {
            state.routeName = str
        },
        // 保存门店信息
        saveShopInfo(state, obj) {
            state.shopInfo = obj
        },
        // 保存用户信息
        saveUserInfo(state, obj) {
            state.userName = obj.name
            state.userNumber = obj.number
            state.perms = obj.perms
        },
        // 保存用户名
        saveUsername (state, str) {
            state.userName = str
        },
        // 切换布局侧边栏
        saveLayoutAside(state, boo) {
            state.showLayoutAside = boo
        },
        // 保存菜单列表
        saveMenuList(state, arr) {
            state.menuList = arr
        },
        // 保存支付方式
        savePaymodes(state, arr) {
            state.paymodes = arr
        },
        // 保存打印机名称
        savePrinterName(state, str) {
            state.printerName = str
        },
        // 保存付款信息
        saveRecordPayment (state, obj) {
            state.recordPayment = obj
        },
        // 报错Dojo配置
        saveDojoConfig (state, obj) {
            state.dojoConfig = obj
        }
    },
    actions: {},
    modules: {},
    // 数据的持久化处理
    plugins: [
        createPersistedState({
            // 存储方式：localStorage、sessionStorage、cookies
            // storage: window.cookies, // 存储到cookie
            storage: window.sessionStorage, // 存储到sessionStorage
            // 如果不写默认存储到localStorage
            // 存储的 key 的key值
            key: "webStore",
            reducer(state) {
                // 要存储的数据：本项目采用es6扩展运算符的方式存储了state中所有的数据
                return {...state};
            }
        })
    ]
});
