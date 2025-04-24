
/**
 * epson打印机
 */
// 日总结
export const epsonDailySummary = () => {
    const code = 'printerFiscalReport\r\nprintZTotReport|1\r\n'
    wirteEpsonCode(code);
}
// 开钱箱
export const epsonCashBox = () => {
    const code = 'printerCommand\r\nopenDrawer|1\r\n'
    wirteEpsonCode(code);
}
// 税务小票
export const epsonTaxPrint = (data) => {
    let code = 'printerFiscalReceipt\r\nPrinter|1\r\n';
    //加入抽奖码
    if (data.lotteryCode) {
        code += 'printRecLotteryCode|1|' + data.lotteryCode + '\r\n';
    }
    for (let i = 0; i < data.items.length; i++) {
        if (Number(data.items[i].finalPrice) !== 0) { //菜品费为0 的不打印
            if(data.enableAliasPrint && data.items[i].alias){
                code += 'printRecItem|1|' + data.items[i].alias + '|' + data.items[i].count + '|' + (data.items[i].settlePrice * 1).toFixed(2).toString().replace('.', ',') + '|2|1\r\n'
            }else{
                code += 'printRecItem|1|' + data.items[i].name + '|' + data.items[i].count + '|' + (data.items[i].settlePrice * 1).toFixed(2).toString().replace('.', ',') + '|2|1\r\n'
            }
        }
    }
    if (data.discountAmount !== 0) { //打折金额
        if (data.discountAmount > 0) {
            //减价
            code += 'printRecSubtotalAdjustment|1|Sconto|1|' + Math.abs(data.discountAmount * 1).toString().replace('.', ',') + '|2|1\r\n'
        } else {
            //加价
            code += 'printRecSubtotalAdjustment|1|Sconto|6|' + Math.abs(data.discountAmount * 1).toString().replace('.', ',') + '|2|1\r\n'
        }
    } else {
        code += 'printRecSubtotal|1|0\r\n'; //小结
    }
    
    if (data.cashAmount != 0) { //现金
        code += 'printRecTotal|1|Contanti|' + (data.cashAmount * 1).toFixed(2).toString().replace('.', ',') + '|0|1|1\r\n'
    }
    if (data.cardAmount != 0) { //刷卡
        code += 'printRecTotal|1|Carta|' + (data.cardAmount * 1).toFixed(2).toString().replace('.', ',') + '|2|1|1\r\n'
    }
    if (data.bizumAmount != 0) { //BIZUM
        code += 'printRecTotal|1|BIZUM|' + (data.bizumAmount * 1).toFixed(2).toString().replace('.', ',') + '|3|1|1\r\n'
    }
    if (data.ticketAmount != 0) { //饭票
        code += 'printRecTotal|1|Ticket singolo|' + (data.ticketAmount * 1).toFixed(2).toString().replace('.', ',') + '|3|1|1\r\n'
    }
    if (data.unpaidAmount != 0) { //未支付
        code += 'printRecTotal|1|Non riscosso|' + (data.unpaidAmount * 1).toFixed(2).toString().replace('.', ',') + '|5|0|1\r\n'
    }
    if (data.voucherAmount != 0) { //抵用券
        code += 'printRecTotal|1|Buoni sconto|' + (data.voucherAmount * 1).toFixed(2).toString().replace('.', ',') + '|3|1|1\r\n'
    }
    if (data.cashAmount == 0 && data.cardAmount == 0 && data.ticketAmount == 0 && data.unpaidAmount == 0 && data.voucherAmount == 0) {
        code += 'printRecTotal|1|Contanti|0|0|1|1\r\n'
    }
    wirteEpsonCode(code);
}
// 写入文件
function wirteEpsonCode(code) {
    var fs = require('fs');
    fs.writeFile('C:/Users/Athome/Epson/IN/scontrino.txt', code, {
        encoding: 'utf-8'
    }, function(error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('写入成功');
    })
}

