const { spawn, exec } = require('child_process');

let readProcess = null;

// 工具函数：十六进制字符串转字节数组
function parseHexString(hexString) {
    return hexString
            .trim()
            .replace(/[^0-9a-fA-F ]/g, '')
            .split(/\s+/)
            .map(b => parseInt(b, 16))
            .filter(n => !isNaN(n));
}

// 开启串口（仅执行一次 PowerShell 启动）
function openSerial(port, baud = 9600) {
    if (readProcess) {
        return;
    }
    if (!port) return;
    // 启动 PowerShell 持续通信脚本
    readProcess = spawn('powershell.exe', ['-NoExit', '-Command', '-'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    // 初始化 PowerShell 串口连接
    const initScript = `
    $port = new-Object System.IO.Ports.SerialPort "${port}", ${baud}, "None", 8, "One";
    $port.Open();
  `;
    readProcess.stdin.write(initScript + '\n');
    
    readProcess.stderr.on('data', err => {
        console.error('[串口错误]', err.toString());
    });
    
    readProcess.on('close', code => {
        readProcess = null;
    });
}

// 写入十六进制数据
function sendHexSerial(hexString) {
    if (!readProcess) {
        console.warn('[串口] 尚未打开，请先调用 openSerial()');
        return;
    }
    
    const bytes = parseHexString(hexString);
    if (bytes.length === 0) {
        console.warn('[串口] 数据格式错误');
        return;
    }
    
    const writeScript = `
    $bytes = [byte[]](${bytes.join(',')});
    $port.Write($bytes, 0, $bytes.Length);
  `;
    readProcess.stdin.write(writeScript + '\n');
}

// 关闭串口
function closeSerial() {
    if (readProcess) {
        readProcess.stdin.write('$port.Close()\n');
        readProcess.stdin.end();
        readProcess = null;
    }
}

module.exports = {
    openSerial,
    closeSerial,
    sendHexSerial,
};
