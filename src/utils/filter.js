import moment from "moment";
import Decimal from 'decimal.js'

/**
 * 格式化日期
 * @param str
 * @returns {string}
 */
const filterDate = (str) => {
    if (!str) return ''
    return moment(str).format('YYYY-MM-DD')
}

/**
 * 格式化时间
 * @param str
 * @returns {string}
 */
const filterTime = (str) => {
    if (!str) return ''
    return moment(str).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化时间（欧洲）
 * @param str
 * @returns {string}
 */
const filterEuropeTime = (str) => {
    if (!str) return ''
    return moment(str).format('DD/MM/YYYY HH:mm:ss')
}

/**
 * 格式化小数
 * @param val
 * @returns {string|number}
 */
const filteFloat = (val) => {
    if (val) {
        return val.toString().replace(/\./g, ',')
    } else {
        return 0
    }
}

/**
 * 使用小数（四舍五入）
 * @param val
 * @returns {string|number}
 */
const filterUseFloat = (val, n = 2) => {
    if (val) {
        let num = Number(val)
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_HALF_UP).toFixed(n).replace('.', ',')
    } else {
        return 0
    }
}

/**
 * 使用小数
 * @param val
 * @returns {string|number}
 */
const filterSaveFloat = (val, n = 2) => {
    if (val) {
        let num = Number(val)
        return new Decimal(num).toDecimalPlaces(n, Decimal.ROUND_DOWN).toFixed(n).replace('.', ',')
    } else {
        return 0
    }
}

export { filterDate, filterTime, filterEuropeTime, filteFloat, filterUseFloat, filterSaveFloat }
