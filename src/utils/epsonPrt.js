import {
	Message
} from 'element-ui'
// 打印机对象
let printer = {};

// 打印机连接失败提示
function addInfoCharge(data) {
    return new Promise((resolve, reject) => {
        if (data.fpStatus.substring(0, 1) === '0' && data.fpStatus.substring(1, 2) === '0') {
            resolve(true);
        } else if (data.fpStatus.substring(0, 1) === '2') {
            Message.error({
                message: 'Stato Stampante - Carta in esaurimento'
            })
            resolve(false);
        } else if (data.fpStatus.substring(0, 1) === '3') {
            Message.error({
                message: 'Stato Stampante - Offline (fine carta o coperchio aperto)'
            })
            resolve(false);
        } else if (data.fpStatus.substring(1, 2) === '1') {
            Message.error({
                message: 'Stato DGFE - Prossimo ad Esaurimento'
            })
            resolve(false);
        } else if (data.fpStatus.substring(1, 2) === '2') {
            Message.error({
                message: 'Stato DGFE - Da formattare'
            })
            resolve(false);
        } else if (data.fpStatus.substring(1, 2) === '3') {
            Message.error({
                message: 'Stato DGFE - Precedente'
            })
            resolve(false);
        } else if (data.fpStatus.substring(1, 2) === '4') {
            Message.error({
                message: 'Stato DGFE - Di altro misuratore'
            })
            resolve(false);
        } else if (data.fpStatus.substring(1, 2) === '5') {
            Message.error({
                message: 'Stato DGFE - Esaurito'
            })
            resolve(false);
        } else if (data.fpStatus.substring(2, 3) === '0') {
            Message.error({
                message: 'Stato Cassetto - Aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(2, 3) === '1') {
            Message.error({
                message: 'Stato Cassetto - Chiuso'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '0') {
            Message.error({
                message: 'Stato Scontrino - Fiscale aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '1') {
            Message.error({
                message: 'Stato Scontrino - Fiscale/Non fiscale chiuso'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '2') {
            Message.error({
                message: 'Stato Scontrino - Non fiscale aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '3') {
            Message.error({
                message: 'Stato Scontrino - Pagamento in corso'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '4') {
            Message.error({
                message: 'Stato Scontrino - Errore ultimo comando ESC/POS con Fiscale/Non fiscale chiuso'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '5') {
            Message.error({
                message: 'Stato Scontrino - Scontrino in negativo'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '6') {
            Message.error({
                message: 'Stato Scontrino - Errore ultimo comando ESC/POS con Non fiscale aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '7') {
            Message.error({
                message: 'Stato Scontrino - Attesa chiusura scontrino modalit&agrave; JAVAPOS'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '8') {
            Message.error({
                message: 'Stato Scontrino - Documento fiscale aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === '9') {
            Message.error({
                message: 'Stato Scontrino - Nota di credito aperta da PC'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === 'A') {
            Message.error({
                message: 'Stato Scontrino - Titolo aperto'
            })
            resolve(false);
        } else if (data.fpStatus.substring(3, 4) === 'B') {
            Message.error({
                message: 'Stato Scontrino - Titolo chiuso'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '0') {
            Message.error({
                message: 'Stato Operativo - Stato registrazione'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '1') {
            Message.error({
                message: 'Stato Operativo - Stato X'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '2') {
            Message.error({
                message: 'Stato Operativo - Stato Z'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '3') {
            Message.error({
                message: 'Stato Operativo - Stato Set'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '4') {
            Message.error({
                message: 'Stato Operativo - Modalit&agrave; Biglietteria'
            })
            resolve(false);
        } else if (data.fpStatus.substring(4, 5) === '5') {
            Message.error({
                message: 'Stato Operativo - Nota di credito aperta da tasteria'
            })
            resolve(false);
        } else {
            Message.error({
                message: 'Risposta errataa'
            })
            resolve(false);
        }
    })
    
}

// 取消打印
function cancelPrint(ip) {
    return new Promise((resolve, reject) => {
        let content = '<printerCommand>' + '<resetPrinter />' + '</printerCommand>';
        let epos = new window.epson.fiscalPrint();
        epos.onreceive = function(res, tag_list_names, add_info) {
            if (res.success) {
                if (res.status == 2) {
                    resolve(false);
                }
            } else {
                addInfoCharge(add_info).then((dt) => {
                    resolve(false);
                });
            }
        }
        epos.onerror = function(res) {
            Message.error({
                message: 'Network Error'
            })
            resolve(false);
        }
        epos.send("http://" + ip + "/cgi-bin/fpmate.cgi?devid=local_printer", content);
    })
}

// 检测打印机
function testPrinter(ip) {
    return new Promise((resolve, reject) => {
        let content = '<printerCommand><queryPrinterStatus /></printerCommand>';
        let epos = new window.epson.fiscalPrint();
        epos.onreceive = function(res, names, info) {
            if (res.success) {
                if (res.status == 2) {
                    resolve(true);
                }
            } else {
                addInfoCharge(info).then((dt) => {
                    resolve(false);
                });
            }
        }
        epos.onerror = function(res) {
            Message.error({
                message: 'Network Error'
            })
            cancelPrint(ip).then((dt) => {
                resolve(false);
            });
        }
        epos.send(`http://${ip}/cgi-bin/fpmate.cgi?devid=local_printer`, content);
    })
}
// 打印税票
printer.taxPrint = function(ip, data) {
    return new Promise((resolve, reject) => {
        let content = '';
        content += '<printerFiscalReceipt>' + '<beginFiscalReceipt operator = "1" />';
        //加入抽奖码
        if (data.lotteryCode) {
            content += '<printRecLotteryID code="' + data.lotteryCode + '" />'
        }
        for (let i = 0; i < data.items.length; i++) {
            if (Number(data.items[i].finalPrice) !== 0) { //菜品费为0 的不打印
                if (data.enableAliasPrint && data.items[i].alias) {
                    content += '<printRecItem operator="1" description="' + data.items[i].alias + '" quantity="' + data.items[i].count + '" unitPrice="' + (data.items[i].settlePrice * 1).toFixed(2).replace('.', ',') + '" department="2" justification="1" />';
                } else {
                    content += '<printRecItem operator="1" description="' + data.items[i].name + '" quantity="' + data.items[i].count + '" unitPrice="' + (data.items[i].settlePrice * 1).toFixed(2).replace('.', ',') + '" department="2" justification="1" />';
                }
            }
        }
        if (data.discountAmount !== 0) {
            content += '<printRecSubtotalAdjustment operator="1" description="Sconto" adjustmentType="1" amount="' + Math.abs(data.discountAmount * 1).toString().replace('.', ',') + '" department="2" justification="1" />';
        } else {
            content += '<printRecSubtotal operator="1" option="0" />';
        }
        if (data.cashAmount != 0) { //现金
            content += '<printRecTotal operator="1" description="Contanti" payment="' + (data.cashAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="0" index="1" justification="1" />';
        }
        if (data.cardAmount != 0) { //刷卡
            content += '<printRecTotal operator="1" description="Carta" payment="' + (data.cardAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="2" index="1" justification="1" />';
        }
        if (data.bizumAmount != 0) { //BIZUM
            content += '<printRecTotal operator="1" description="BIZUM" payment="' + (data.bizumAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="2" index="1" justification="1" />';
        }
        if (data.ticketAmount != 0) { //饭票
            content += '<printRecTotal operator="1" description="Ticket singolo" payment="' + (data.ticketAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="3" index="1" justification="1" />';
        }
        if (data.unpaidAmount != 0) { //未支付
            content += '<printRecTotal operator="1" description="Non riscosso" payment="' + (data.unpaidAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="5" index="0" justification="1" />';
        }
        if (data.voucherAmount != 0) { //抵用券
            content += '<printRecTotal operator="1" description="Buoni sconto" payment="' + (data.voucherAmount * 1).toFixed(2).replace('.', ',') + '" paymentType="5" index="0" justification="1" />';
        }
        if (data.cashAmount == 0 && data.cardAmount == 0 && data.ticketAmount == 0 && data.unpaidAmount == 0 && data.voucherAmount == 0) {
            content += '<printRecTotal operator="1" description="Contanti" payment="0" paymentType="0" index="1" justification="1" />';
        }
        
        content += '<endFiscalReceipt operator = "1" />' +
                '</printerFiscalReceipt>';
        
        let epos = new window.epson.fiscalPrint();
        //检测再发送
        testPrinter(ip).then((dt) => {
            if (dt) {
                epos.send(`http://${ip}/cgi-bin/fpmate.cgi?devid=local_printer`, content);
                resolve(true);
            } else {
                resolve(false);
            }
        })
    });
}

// 日总结
printer.dailySum = function(ip) {
    return new Promise((resolve, reject) => {
		let content = '';
		content += '<printerFiscalReport>';
		content += '<printXZReport operator="1"/>';
		content += '</printerFiscalReport>';
        let epos = new window.epson.fiscalPrint();
		//检测再发送
		testPrinter(ip).then((dt) => {
			if (dt) {
				epos.send("http://" + ip + "/cgi-bin/fpmate.cgi?devid=local_printer", content);
				resolve(true);
			} else {
				resolve(false);
			}
		})
	});
}

// 开钱箱
printer.openBox = function(ip) {
    return new Promise((resolve, reject) => {
		let content = '';
		content += '<printerCommand>';
		content += '<openDrawer operator="1" />';
		content += '</printerCommand>';
        let epos = new window.epson.fiscalPrint();
		//检测再发送
		testPrinter(ip).then((dt) => {
			if (dt) {
				epos.send("http://" + ip + "/cgi-bin/fpmate.cgi?devid=local_printer", content);
				resolve(true);
			} else {
				resolve(false);
			}
		})
	});
}

export default {
    install: function(Vue) {
        Vue.prototype.$epsonPrinter = printer;
    }
}
