import serialHelper from './serial-helper.js';

// 显示器品牌
let displayBrand;
/**
 * 发送进制数据
 * @param hexArray
 * @returns {Promise<void>}
 */
const sendHexData = async (hexArray) => {
    await serialHelper.sendHexSerial(hexArray);
}

/**
 * 发送普通数据
 * @param str
 * @returns {Promise<void>}
 */
const sendData = async (str) => {
    await serialHelper.sendSerial(str);
}

/**
 * 格式化小数
 * @param num
 * @returns {*}
 */
const formatDisplayNumber = (num) => {
    if (Number.isInteger(num)) {
        return num.toFixed(2);
    }
    const decimalPart = num.toString().split('.')[1];
    if (decimalPart && decimalPart.length >= 2) {
        return num;
    } else {
        return num.toFixed(2);
    }
}

/**
 * 数字转换为ASCII编码 16进制
 * @param val
 * @returns {string|number}
 */
const asciiStringToHex = (num) => {
    let str = num.toString()
    return Array.from(str).map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
}

/**
 * 打开串口
 * @param port
 * @param baudRate
 * @returns {Promise<void>}
 */
export const openDisplayer = async (port, baudRate = 9600) => {
    if (!port) throw new Error('必须传入串口对象');
    displayBrand = localStorage.getItem("customerDisplayBrand")
    await serialHelper.openSerial(port, baudRate);
}

/**
 * 关闭显示器
 * @returns {Promise<void>}
 */
export const closeDisplayer = async () => {
    await serialHelper.closeSerial();
}

/**
 * 初始化客显
 * @param hexArray
 * @returns {Promise<void>}
 */
export const initDisplayer = () => {
    sendHexData('1B 40')
}

/**
 * 设置显示类型
 * @param hexArray
 * @returns {Promise<void>}
 */
export const setDisplayerType = (type) => {
    if (displayBrand === 'VFD220') {
        if (type === 'price') {
            sendHexData('1B 75 42 70 72 69 63 65 0D')
        } else if (type === 'total') {
            sendHexData('1B 75 42 74 6F 74 61 6C 0D')
        }
    } else if (displayBrand === 'CITAQ8') {
        if (type === 'price') {
            sendHexData('1B 73 31')
        } else if (type === 'total') {
            sendHexData('1B 73 32')
        }
    }
}

/**
 * 发送显示金额
 * @param str
 * @returns {Promise<void>}
 */
export const sendDisplayerAmount = (money) => {
    let endArr = ['0D']
    let num = formatDisplayNumber(money)
    let moneyArr = asciiStringToHex(num)
    if (displayBrand === 'VFD220') {
        let startArr = ['1B', '75', '41']
        let hexStr = [...startArr, ...moneyArr, ...endArr].join(' ')
        sendHexData(hexStr)
    } else if (displayBrand === 'CITAQ8') {
        let startArr = ['1B', '51', '41']
        let hexStr = [...startArr, ...moneyArr, ...endArr].join(' ')
        sendHexData(hexStr)
    }
}

/**
 * 清屏
 * @param position
 * @returns {Promise<void>}
 */
export const clearDisplayer = (position = '') => {
    if (displayBrand === 'VFD220') {
        if (position === 'top') {
            let hexStr = '1B 75 41 20 0D'
            sendHexData(hexStr)
        } else if (position === 'bottom') {
            let hexStr = '1B 75 42 20 0D'
            sendHexData(hexStr)
        }
    } else if (displayBrand === 'CITAQ8') {
        let hexStr = 'C'
        sendHexData(hexStr)
    }
}


