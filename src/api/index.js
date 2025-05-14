// 引入axios基本配置
import http from '@/api/fetch.js'

/**
 * 校验url是否可用
 * @param params
 * @returns {*}
 */
export const checkUrlEnabled = (baseUrl) => {
    return http({
        url: `${baseUrl}/api/v1/shop/detail`,
        method: 'get'
    })
}

/**
 * 查询门店详情
 * @param params
 * @returns {*}
 */
export const queryShopDetail = () => {
    return http({
        url: '/api/v1/shop/detail',
        method: 'get'
    })
}

/**
 * 系统激活
 * @param params
 * @returns {*}
 */
export const systemActivate = (params) => {
    return http({
        url: '/api/v1/system/activate',
        method: 'post',
        params
    })
}

/**
 * 同步平台数据
 * @param params
 * @returns {*}
 */
export const syncPlatformData = (params) => {
    return http({
        url: '/api/v1/sync',
        method: 'post',
        params
    })
}

/**
 * 查询同步进展
 * @param params
 * @returns {*}
 */
export const querySyncProgress = () => {
    return http({
        url: '/api/v1/sync/progress',
        method: 'get'
    })
}

/**
 * 账号登录
 * @param params
 * @returns {*}
 */
export const accountLogin = (params) => {
    return http({
        url: '/api/v1/login',
        method: 'post',
        params
    })
}

/**
 * 退出登录
 * @param params
 * @returns {*}
 */
export const accountLogout = (params) => {
    return http({
        url: '/api/v1/logout',
        method: 'post',
        params
    })
}

/**
 * 查询无码商品
 * @param params
 * @returns {*}
 */
export const queryCodelessProduct = () => {
    return http({
        url: '/api/v1/cashier/product/codeless/list',
        method: 'get'
    })
}

/**
 * 查询支付方式
 * @param params
 * @returns {*}
 */
export const queryOrderPaymode = () => {
    return http({
        url: '/api/v1/cashier/order/paymode/list',
        method: 'get'
    })
}

/**
 * 查询当前会话
 * @param params
 * @returns {*}
 */
export const queryCurrentSession = () => {
    return http({
        url: '/api/v1/cashier/session/current',
        method: 'get'
    })
}

/**
 * 查询商品列表
 * @param params
 * @returns {*}
 */
export const queryProductPage = (params) => {
    return http({
        url: '/api/v1/product/page',
        method: 'post',
        data: params
    })
}

/**
 * 查询当前会话
 * @param params
 * @returns {*}
 */
export const queryProductClassify = () => {
    return http({
        url: '/api/v1/product/classify/tree',
        method: 'get'
    })
}

/**
 * 扫码查询商品
 * @param params
 * @returns {*}
 */
export const queryBarcodeProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/barcode/scan',
        method: 'get',
        params
    })
}

/**
 * 扫码查询商品
 * @param params
 * @returns {*}
 */
export const searchProductList = (params) => {
    return http({
        url: '/api/v1/cashier/product/search',
        method: 'get',
        params
    })
}

/**
 * 添加商品
 * @param params
 * @returns {*}
 */
export const addCartProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/add',
        method: 'post',
        params
    })
}

/**
 * 添加无码商品
 * @param params
 * @returns {*}
 */
export const addCartCodeless = (params) => {
    return http({
        url: 'api/v1/cashier/item/codeless/add',
        method: 'post',
        data: params
    })
}

/**
 * 更新购物车商品数量
 * @param params
 * @returns {*}
 */
export const updateCartProductCount = (params) => {
    return http({
        url: '/api/v1/cashier/item/count/update',
        method: 'post',
        params
    })
}

/**
 * 更新购物车商品价格
 * @param params
 * @returns {*}
 */
export const updateCartProductPrice = (params) => {
    return http({
        url: '/api/v1/cashier/item/price/update',
        method: 'post',
        params
    })
}

/**
 * 取消购物车商品折扣
 * @param params
 * @returns {*}
 */
export const cancelCartProductDiscount = (params) => {
    return http({
        url: '/api/v1/cashier/item/discount/cancel',
        method: 'post',
        params
    })
}

/**
 * 购物车商品退货
 * @param params
 * @returns {*}
 */
export const refundCartProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/refund',
        method: 'post',
        params
    })
}

/**
 * 取消购物车商品退货
 * @param params
 * @returns {*}
 */
export const unrefundCartProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/unrefund',
        method: 'post',
        params
    })
}

/**
 * 购物车商品删除
 * @param params
 * @returns {*}
 */
export const deleteCartProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/remove',
        method: 'post',
        params
    })
}

/**
 * 购物车商品备注
 * @param params
 * @returns {*}
 */
export const updateCartProductRemark = (params) => {
    return http({
        url: '/api/v1/cashier/item/remark/update',
        method: 'post',
        params
    })
}

/**
 * 挂单
 * @param params
 * @returns {*}
 */
export const pendingOrder = () => {
    return http({
        url: '/api/v1/cashier/session/pending',
        method: 'post'
    })
}

/**
 * 查询挂单数量
 * @param params
 * @returns {*}
 */
export const queryPendingOrderCount = () => {
    return http({
        url: '/api/v1/cashier/session/pending/count',
        method: 'get'
    })
}

/**
 * 查询挂单列表
 * @param params
 * @returns {*}
 */
export const queryPendingOrderList = () => {
    return http({
        url: '/api/v1/cashier/session/pending/list',
        method: 'get'
    })
}

/**
 * 恢复挂单订单
 * @param params
 * @returns {*}
 */
export const recoverPendingOrder = (params) => {
    return http({
        url: '/api/v1/cashier/session/recover',
        method: 'post',
        params
    })
}

/**
 * 取消挂单订单
 * @param params
 * @returns {*}
 */
export const cancelPendingOrder = (params) => {
    return http({
        url: '/api/v1/cashier/session/pending/cancel',
        method: 'post',
        params
    })
}

/**
 * 取消会话订单
 * @param params
 * @returns {*}
 */
export const cancelSessionOrder = () => {
    return http({
        url: '/api/v1/cashier/session/cancel',
        method: 'post'
    })
}

/**
 * 订单打折
 * @param params   type 101 打折   102 减价
 * @returns {*}
 */
export const orderDiscount = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/manual',
        method: 'post',
        params
    })
}

/**
 * 取消订单打折
 * @param params
 * @returns {*}
 */
export const cancelOrderDiscount = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/manual/cancel',
        method: 'post',
        params
    })
}

/**
 * 订单抹零
 * @param params
 * @returns {*}
 */
export const orderRounding = () => {
    return http({
        url: '/api/v1/cashier/session/discount/rounding',
        method: 'post'
    })
}

/**
 * 取消订单抹零
 * @param params
 * @returns {*}
 */
export const cancelOrderRounding = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/rounding/cancel',
        method: 'post'
    })
}

/**
 * 查询抵用券是否被使用
 * @param params
 * @returns {*}
 */
export const queryVoucherUseState = (params) => {
    return http({
        url: '/api/v1/order/refund/voucher/bound',
        method: 'get',
        params
    })
}

/**
 * 校验会话
 * @param params
 * @returns {*}
 */
export const checkSession = (params) => {
    return http({
        url: '/api/v1/cashier/session/check',
        method: 'post',
        data: params
    })
}

/**
 * 查询订单列表
 * @param params
 * @returns {*}
 */
export const queryOrderList = (params) => {
    return http({
        url: '/api/v1/order/page',
        method: 'post',
        data: params
    })
}

/**
 * 查询订单详情
 * @param params
 * @returns {*}
 */
export const queryOrderDetail = (params) => {
    return http({
        url: '/api/v1/order/detail',
        method: 'get',
        params
    })
}

/**
 * 创建退款单
 * @param params
 * @returns {*}
 */
export const createRefundOrder = (params) => {
    return http({
        url: '/api/v1/order/refund/create',
        method: 'post',
        data: params
    })
}

/**
 * 删除订单
 * @param params
 * @returns {*}
 */
export const deleteOrder = (params) => {
    return http({
        url: '/api/v1/order/delete',
        method: 'post',
        params
    })
}

/**
 * 查询收银员列表
 * @param params
 * @returns {*}
 */
export const queryCashierList = (params) => {
    return http({
        url: '/api/v1/user/list',
        method: 'get',
        params
    })
}

/**
 * 查询订单列表
 * @param params
 * @returns {*}
 */
export const queryRefundList = (params) => {
    return http({
        url: '/api/v1/order/refund/list',
        method: 'get',
        params
    })
}

/**
 * 查询订单详情
 * @param params
 * @returns {*}
 */
export const queryRefundDetail = (params) => {
    return http({
        url: '/api/v1/order/refund/detail',
        method: 'get',
        params
    })
}

/**
 * 查询抵用券列表
 * @param params
 * @returns {*}
 */
export const queryVoucherList = (params) => {
    return http({
        url: '/api/v1/order/refund/voucher/list',
        method: 'get',
        params
    })
}

/**
 * 更新用户名
 * @param params
 * @returns {*}
 */
export const updateUserName = (params) => {
    return http({
        url: '/api/v1/me/username/update',
        method: 'post',
        params
    })
}

/**
 * 更新用户密码
 * @param params
 * @returns {*}
 */
export const updateUserPassword = (params) => {
    return http({
        url: '/api/v1/me/password/update',
        method: 'post',
        params
    })
}

/**
 * 标签预打
 * @param params
 * @returns {*}
 */
export const tagPrePrint = (params) => {
    return http({
        url: '/api/v1/product/price/tag/preprint',
        method: 'post',
        data: params,
        responseType: 'arraybuffer'
    })
}

/**
 * A4纸预打
 * @param params
 * @returns {*}
 */
export const paperPrePrint = (params) => {
    return http({
        url: '/api/v1/product/price/tag/preprint/a4',
        method: 'post',
        data: params,
        responseType: 'arraybuffer'
    })
}

/**
 * 公司搜索
 * @param params
 * @returns {*}
 */
export const invoiceSearch = (params) => {
    return http({
        url: '/api/v1/cashier/company/search',
        method: 'get',
        params
    })
}

/**
 * 查询员工日总结
 * @param params
 * @returns {*}
 */
export const queryEmployeeStats = () => {
    return http({
        url: '/api/v1/cashier/order/stats',
        method: 'get'
    })
}

/**
 * 查询全部日总结
 * @param params
 * @returns {*}
 */
export const queryDailyStats = () => {
    return http({
        url: '/api/v1/cashier/order/day/stats',
        method: 'get'
    })
}

/**
 * 查询商品详情
 * @param params
 * @returns {*}
 */
export const queryProductDetail = (params) => {
    return http({
        url: '/api/v1/product/detail',
        method: 'post',
        params
    })
}

/**
 * 更新商品
 * @param params
 * @returns {*}
 */
export const updateProduct = (params) => {
    return http({
        url: '/api/v1/product/update',
        method: 'post',
        data: params
    })
}

/**
 * 查询会员列表
 * @param params
 * @returns {*}
 */
export const queryMemberList = (params) => {
    return http({
        url: '/api/v1/member/page',
        method: 'post',
        data: params
    })
}

/**
 * 查询会员详情
 * @param params
 * @returns {*}
 */
export const queryMemberDetail = (params) => {
    return http({
        url: '/api/v1/member/detail',
        method: 'post',
        data: params
    })
}

/**
 * 创建会员
 * @param params
 * @returns {*}
 */
export const createMember = (params) => {
    return http({
        url: '/api/v1/member/create',
        method: 'post',
        data: params
    })
}

/**
 * 更新会员
 * @param params
 * @returns {*}
 */
export const updateMember = (params) => {
    return http({
        url: '/api/v1/member/update',
        method: 'post',
        data: params
    })
}

/**
 * 查询会员等级
 * @param params
 * @returns {*}
 */
export const queryMemberLevelList = () => {
    return http({
        url: '/api/v1/member/level/detail',
        method: 'get'
    })
}

/**
 * 查询国家列表
 * @param params
 * @returns {*}
 */
export const queryCountryList = () => {
    return http({
        url: '/api/v1/region/country/list',
        method: 'get',
    })
}

/**
 * 查询省列表
 * @param params
 * @returns {*}
 */
export const queryProvinceList = (params) => {
    return http({
        url: '/api/v1/region/province/list',
        method: 'get',
        params
    })
}

/**
 * 查询城市列表
 * @param params
 * @returns {*}
 */
export const queryCityList = (params) => {
    return http({
        url: '/api/v1/region/city/list',
        method: 'get',
        params
    })
}

/**
 * 查询税率列表
 * @param params
 * @returns {*}
 */
export const queryTaxRateList = () => {
    return http({
        url: '/api/v1/tax/rate/type/selector',
        method: 'post'
    })
}

/**
 * 搜索会员列表
 * @param params
 * @returns {*}
 */
export const searchMemberList = (params) => {
    return http({
        url: '/api/v1/cashier/member/search',
        method: 'get',
        params
    })
}

/**
 * 绑定会员
 * @param params
 * @returns {*}
 */
export const bindMember = (params) => {
    return http({
        url: '/api/v1/cashier/member/bind',
        method: 'get',
        params
    })
}

/**
 * 清除会员
 * @param params
 * @returns {*}
 */
export const clearMember = (params) => {
    return http({
        url: '/api/v1/cashier/member/clean',
        method: 'get',
        params
    })
}

/**
 * 会员积分抵扣
 * @param params
 * @returns {*}
 */
export const sessionPointsDeduct = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/points',
        method: 'post',
        params
    })
}

/**
 * 取消会员积分抵扣
 * @param params
 * @returns {*}
 */
export const cancelPointsDeduct = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/points/cancel',
        method: 'post',
        params
    })
}

/**
 * 更新订单票据类型
 * @param params
 * @returns {*}
 */
export const updateOrderReceipt = (params) => {
    return http({
        url: '/api/v1/order/update/receipt',
        method: 'post',
        data: params
    })
}

/**
 * 更新购物车商品
 * @param params
 * @returns {*}
 */
export const updateCartProduct = (params) => {
    return http({
        url: '/api/v1/cashier/item/refresh/product',
        method: 'post',
        data: params
    })
}

/**
 * 绑定优惠券
 * @param params
 * @returns {*}
 */
export const bindDiscountCoupon = (params) => {
    return http({
        url: '/api/v1/cashier/session/discount/coupon',
        method: 'post',
        params
    })
}

/**
 * 取消优惠券
 * @param params
 * @returns {*}
 */
export const cancelDiscountCoupon = () => {
    return http({
        url: '/api/v1/cashier/session/discount/coupon/cancel',
        method: 'post'
    })
}

/**
 * 整单备注
 * @param params
 * @returns {*}
 */
export const updateOrderRemark = (params) => {
    return http({
        url: '/api/v1/cashier/session/remark',
        method: 'post',
        params
    })
}

/**
 * 同步博浩产品
 * @param params
 * @returns {*}
 */
export const syncBohaoProduct = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/productData',
        method: 'post'
    })
}

/**
 * 同步博浩会员
 * @param params
 * @returns {*}
 */
export const syncBohaoMember = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/memberData',
        method: 'post'
    })
}

/**
 * 同步博浩供应商
 * @param params
 * @returns {*}
 */
export const syncBohaoSupplier = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/vendorData',
        method: 'post'
    })
}

/**
 * 同步博浩订单
 * @param params
 * @returns {*}
 */
export const syncBohaoOrder = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/orderData',
        method: 'post'
    })
}

/**
 * 同步博浩全部数据
 * @param params
 * @returns {*}
 */
export const syncBohaoTotal = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/totalData',
        method: 'post'
    })
}

/**
 * 同步博浩全部数据
 * @param params
 * @returns {*}
 */
export const syncBohaoRunScript = () => {
    return http({
        url: '/api/v1/ops/sync/bohao/script/run',
        method: 'post'
    })
}

/**
 * 获取版本信息
 * @param params
 * @returns {*}
 */
export const queryVersionInfo = () => {
    return http({
        url: '/api/v1/system/desktop/upgrade/check',
        method: 'get'
    })
}

/**
 * 获取Dojo列表
 * @param params
 * @returns {*}
 */
export const queryDojoList = () => {
    return http({
        url: '/api/v1/pay/dojo/selector',
        method: 'post'
    })
}

/**
 * 创建支付意图
 * @param params
 * @returns {*}
 */
export const createPayIntent = (params) => {
    return http({
        url: '/api/v1/pay/dojo/create/pay/intent',
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
        url: '/api/v1/pay/dojo/create/pay/session',
        method: 'post',
        data: params
    })
}

/**
 * 取消支付会话
 * @param params
 * @returns {*}
 */
export const cancelPaySession = (params) => {
    return http({
        url: '/api/v1/pay/dojo/cancel/pay/session',
        method: 'post',
        data: params
    })
}

/**
 * 查询支付结果
 * @param params
 * @returns {*}
 */
export const queryPayResult = (params) => {
    return http({
        url: '/api/v1/pay/dojo/get/pay/session',
        method: 'post',
        data: params
    })
}

/**
 * 确认是否签名
 * @param params
 * @returns {*}
 */
export const confirmPaySign = (params) => {
    return http({
        url: '/api/v1/pay/dojo/confirm/sign',
        method: 'post',
        data: params
    })
}
