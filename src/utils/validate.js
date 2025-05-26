
/**
 * 校验IP
 * @param
 * @returns {*}
 */
export const validateIp = (str) => {
    const reg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return reg.test(str)
}

/**
 * 校验端口
 * @param
 * @returns {*}
 */
export const validatePort = (str) => {
    const reg = /^(0|[1-9]\d{0,4})$/
    return reg.test(str)
}

/**
 * 校验浮点数
 * @param
 * @returns {*}
 */
export const validateFloat = (str) => {
    const value = str.toString().replace(',', '.')
    const reg = /^(0\.\d*[1-9]\d*|[1-9]\d*\.\d+|[1-9]\d*)$/
    return reg.test(value)
}

/**
 * 校验浮点数（包含正负数和0）
 * @param
 * @returns {*}
 */
export const validateAllFloat = (str) => {
    const value = str.toString().replace(',', '.')
    const reg = /^-?\d+(\.\d+)?$/;
    return reg.test(value)
}
/**
 * 校验浮点数或0
 * @param
 * @returns {*}
 */
export const validateZeroFloat = (str) => {
    const value = str.toString().replace(',', '.')
    const reg = /^(0|[1-9]\d*(\.\d+)?|0\.\d*[1-9]\d*)$/
    return reg.test(value)
}

/**
 * 校验正整数
 * @param
 * @returns {*}
 */
export const validateInteger = (str) => {
    const reg = /^[1-9]\d*$/
    return reg.test(str)
}

/**
 * 校验正整数或0
 * @param
 * @returns {*}
 */
export const validateZeroInteger = (str) => {
    const reg = /^(0|[1-9]\d*)$/
    return reg.test(str)
}


