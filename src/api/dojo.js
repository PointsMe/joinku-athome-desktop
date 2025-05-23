// 引入axios
import axios from "axios";
import store from '../store';

let http = axios.create({
    baseURL: 'https://api.dojo.tech',
    timeout: 800000
});

// 添加请求拦截器
http.interceptors.request.use(function(config) {
    config.headers["Authorization"] = `Basic ${store.state.dojoConfig.apiKey}`
    config.headers["Content-Type"] = 'application/json'
    config.headers["reseller-id"] = store.state.dojoConfig.resellerId
    config.headers["software-house-id"] = store.state.dojoConfig.softwareHouseId
    config.headers["version"] = store.state.dojoConfig.version
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function(response) {
    return response.data;
}, function(error) {
    return Promise.reject(error);
});

/**
 * 获取Dojo列表
 * @param params
 * @returns {*}
 */
export const queryTerminalList = () => {
    return http({
        url: '/terminals?statuses=Available',
        method: 'get'
    })
}

/**
 * 获取终端状态
 * @param params
 * @returns {*}
 */
export const queryTerminalStatus = (terminalId) => {
    return http({
        url: `/terminals/${terminalId}`,
        method: 'get'
    })
}

/**
 * 创建支付意图
 * @param params
 * @returns {*}
 */
export const createPayIntent = (params) => {
    return http({
        url: '/payment-intents',
        method: 'post',
        data: params
    })
}

/**
 * 创建支付会话
 * @param params
 * @returns {*}
 */
export const createPaySession = (params) => {
    return http({
        url: '/terminal-sessions',
        method: 'post',
        data: params
    })
}

/**
 * 取消支付会话
 * @param params
 * @returns {*}
 */
export const cancelPaySession = (terminalSessionId) => {
    return http({
        url: `/terminal-sessions/${terminalSessionId}/cancel`,
        method: 'put'
    })
}

/**
 * 查询支付结果
 * @param params terminalSessionId: 会话ID
 * @returns {*}
 */
export const queryPayResult = (terminalSessionId) => {
    return http({
        url: `/terminal-sessions/${terminalSessionId}`,
        method: 'get'
    })
}

/**
 * 确认是否签名
 * @param params
 * @returns {*}
 */
export const confirmPaySign = (terminalSessionId, params) => {
    return http({
        url: `/terminal-sessions/${terminalSessionId}/signature`,
        method: 'put',
        data: params
    })
}
