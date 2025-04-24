import router, {resetRouter} from "./../router/index";
import store from '../store'
import {menuData} from './menu'

// 动态导入模块
const loadView = (viewPath) => {
    return () => import(`./../views/layout/${viewPath}.vue`)
}

let nowPerms = []

/**
 * 加工路由
 * @description: 解析后端返回来的菜单树
 * @param {*} data 后端返回来的路由树
 * @param {*} arr 菜单
 * @return {*}
 */
function processRoute(data, arr) {
    data.forEach((item, index) => {
        let {path, name, component, meta} = item
        // 判断是否有权限
        if (nowPerms.includes(meta.code)) {
            let route = { path, name, component: null, meta }
            if (component) {
                route.component = loadView(component)
            }
            arr.push(route)
        }
    })
    return arr
}

/**
 * 创建当前用户登录菜单
 * @description
 * @param {*}
 * @return {*}
 */
export const createMenu = () => {
    // 设置当前权限
    nowPerms = store.state.perms
    // 当前路由
    let routes = processRoute(menuData, [])
    // 保存菜单列表
    let menuList = routes.filter(item => item.meta.show)
    store.commit('saveMenuList', menuList)
    // 生成动态路由
    resetRouter()
    routes.forEach(item => {
        router.addRoute('Layout', item)
    })
    router.addRoute({ path: '*', redirect: '/404' })
}

