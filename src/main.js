import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import i18n from './lang/index'

// 引入字体图标
import '@/assets/font-icon/iconfont.css'
// 引入公共样式
import '@/assets/css/base.scss'

import 'amfe-flexible'

// 引入qs
import qs from 'qs'

// 引入打印机
import epsonPrt from '@/utils/epsonPrt.js'

// 引入全局过滤器
import * as custom from '@/utils/filter.js'
// 注册全局过滤器
Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

// 注册qs
Vue.prototype.$qs = qs

// 注册打印机
Vue.use(epsonPrt)

// 注册全局导航守卫判断是否未登录
// 路由白名单
const whiteList = ['/login', '/404'];
router.beforeEach((to, from, next) => {
    if (whiteList.includes(to.path)) {
        next()
    } else {
        const token = sessionStorage.getItem('token')
        if (token) {
            next()
        } else {
            next({path: '/login'})
        }
    }
})

// 引入自定义指令
import '@/utils/directives.js'

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount("#app");
