// 引入axios
import axios from "axios";
import router from "@/router";

let instance = axios.create({
    // timeout: 300000
    timeout: 0
});

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    // 基本地址
    if (localStorage.getItem("systemBaseUrl")) {
        config.baseURL = localStorage.getItem("systemBaseUrl")
    }
    config.headers["Accept-Language"] = localStorage.getItem('Language');
    config.headers["X-Client-Version"] = process.env.VUE_APP_VERSION
    config.headers["X-Request-Id"] = localStorage.getItem('machineMac') || ''
    config.headers["Authorization"] = sessionStorage.getItem('token') || ''
    config.headers["X-Client-Type"] = 'web-merchant'
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
    if (response.data.code === 40001) {
        localStorage.removeItem('loginData');
        router.replace({
            name: 'Login'
        });
    } else if (response.data.code === 30001) {
        // 未激活
        localStorage.setItem('ifActivate', JSON.stringify(false));
        if (router.currentRoute.name === 'Login') {
            location.reload();
        } else {
            router.replace({
                name: 'Login'
            });
        }
    }
    return response.data;
}, function(error) {
    return Promise.reject(error);
});

export default instance;
