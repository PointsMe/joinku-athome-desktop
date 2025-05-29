import Decimal from 'decimal.js'
/**
 * 计算总价格
 * @param data [{price: 10, count: 1}]
 * @returns {*}
 */
import moment from "moment";

export const countTotalPrice = (data, property = 'price') => {
    const totalPrice = data.reduce((pre, next) => {
        return pre + Number(next[property]) * next.count;
    }, 0)
    return totalPrice
}

/**
 * 计算属性值总和
 * @param data [{属性: 值}]
 * @returns {*}
 */
export const countPropertyTotal = (data, property = 'price') => {
    const countTotal = data.reduce((pre, next) => {
        return pre + Number(next[property])
    }, 0)
    return countTotal
}

/**
 * 格式化国际时间
 * @param data [{属性: 值}]
 * @returns {*}
 */
export const formatIsoTime = (date) => {
    if (!date) return ''
    return moment(date).format('YYYY-MM-DDTHH:mm:ssZZ')
}

/**
 * 格式化浮点数
 * @param data [{属性: 值}]
 * @returns {*}
 */
export const formatFloat = (str) => {
    return Number(str.toString().replace(',', '.'))
}

/**
 * 使用小数（四舍五入）
 * @param val
 * @returns {string|number}
 */
export const formatFloatRound = (val, n = 2) => {
    if (val) {
        const num = Number(val.toString().replace(',', '.'))
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_HALF_UP).toNumber();
    } else {
        return 0
    }
}

/**
 * 保留小数（四舍五入）使用逗号
 * @param val
 * @returns {string|number}
 */
export const formatUseDot = (val, n = 2) => {
    if (val || val === 0) {
        let num = Number(val)
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_HALF_UP).toFixed(n).replace('.', ',')
    } else {
        return ''
    }
}

/**
 * 保留小数 (第n位后直接舍去)
 * @param val
 * @returns {string|number}
 */
export const formatFloatFloor = (val, n = 2) => {
    if (val) {
        const num = Number(val.toString().replace(',', '.'))
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_DOWN).toNumber();
    } else {
        return 0
    }
}

/**
 * 格式化计算小数 (第n位后直接舍去)
 * @param val
 * @returns {string|number}
 */
export const formatCalculateFloat = (val, n = 2) => {
    if (val) {
        const factor = Math.pow(10, 6);
        const num = Math.round(val * factor) / factor;
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_DOWN).toNumber();
    } else {
        return 0
    }
}

/**
 * Decimal 减法 (第n位后直接舍去)
 * @param val1: 被减数
 * @param val2: 减数
 * @param n: 保留小数位
 * @returns {string|number}
 */
export const decimalMinusFloor = (val1, val2, n = 2) => {
    return new Decimal(val1).minus(val2).toDecimalPlaces(n, Decimal.ROUND_DOWN).toNumber();
}

/**
 * Decimal 减法 (四舍五入保留n位小数)
 * @param val1: 被减数
 * @param val2: 减数
 * @param n: 保留小数位
 * @returns {string|number}
 */
export const decimalMinusRound = (val1, val2, n = 2) => {
    return new Decimal(val1).minus(val2).toDecimalPlaces(n, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * Decimal 乘法 (第n位后直接舍去)
 * @param val1: 被乘数
 * @param val2: 乘数
 * @param n: 保留小数位
 * @returns {string|number}
 */
export const decimalTimesFloor = (val1, val2, n = 2) => {
    return new Decimal(val1).times(val2).toDecimalPlaces(n, Decimal.ROUND_DOWN).toNumber();
}

/**
 * Decimal 乘法 (四舍五入保留n位小数)
 * @param val1: 被乘数
 * @param val2: 乘数
 * @param n: 保留小数位
 * @returns {string|number}
 */
export const decimalTimesRound = (val1, val2, n = 2) => {
    return new Decimal(val1).times(val2).toDecimalPlaces(n, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * 倒计时
 * @returns
 */
export const getCountDownTime = (date) => {
    if (!date) return ''
    // 当前时间
    const nowTime = new Date().getTime()
    // 参考时间
    const referTime = new Date(date).getTime()
    if ((referTime - nowTime) < 0) {
        return ''
    }
    // 把剩余时间毫秒数转化为秒
    let times = (referTime - nowTime) / 1000;
    // 时
    let hour = Math.floor(times / 60 / 60 % 24)
    // 分
    let minutes = Math.floor(times / 60 % 60) + ''
    minutes = minutes.padStart(2, '0')
    // 秒
    let seconds = Math.floor(times % 60) + ''
    seconds = seconds.padStart(2, '0')
    if (hour > 0) {
        hour = hour.toString().padStart(2, '0')
        return `${hour}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
}

/**
 * 防抖
 * 在连续的操作中，无论进行了多长时间，
 * 只有某一次的操作后在指定的时间内没有再操作，这一次才被判定有效
 * @param {*} fn 回调函数
 * @param {*} delay 间隔时间
 * @returns
 */
export const Debounce = (fn, delay = 300) => {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    }
}

/**
 * 节流
 * 一定时间内一定执行而且只执行一次。我们通常规定300ms执行一下的话，
 * 在规定时间内执行了很多次，只有一次是有效的
 * @param {*} fn 回调函数
 * @param {*} delay 间隔时长
 * @returns
 */
export const Throttle = (fn, delay = 300) => {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, delay);
    };
}

