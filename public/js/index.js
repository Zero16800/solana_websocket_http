function isValidSolanaAddress(address) {
    // Solana 地址通常采用Base58编码，长度为44个字符
    const solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{44})$/;
    
    // 使用正则表达式测试地址是否符合规范
    return solanaAddressRegex.test(address);
}



let ws_text;

function initializeWebSocket() {
    ws_text = new WebSocket('ws://localhost:8899'); // 连接到 Solana 开发网络节点的 WebSocket 地址

    ws_text.onopen = function() {
        console.log('已连接到 WebSocket');
    };

    ws_text.onerror = function(error) {
        console.error('WebSocket 出现错误:', error);
    };
}

initializeWebSocket(); // 初始化 WebSocket

document.getElementById('subscribeButton').addEventListener('click', () => {
    const accountAddress = document.getElementById('accountInput').value;
    
    if (accountAddress === '') {
        alert('账户地址不能为空，请输入有效的 Solana 账户地址！');
    } else {
        console.log(accountAddress);

        // 检查 WebSocket 是否为 OPEN 状态，然后发送数据
        if (ws_text.readyState === WebSocket.OPEN) {
            const data_info = JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'accountSubscribe',
                params: [
                    accountAddress,
                    {
                        encoding: 'jsonParsed',
                        commitment: 'finalized'
                    }
                ]
            });

            ws_text.send(data_info);
        } else {
            console.log('WebSocket is not in the OPEN state. Reinitializing WebSocket...');
            ws_text.close();
            initializeWebSocket(); // 重新初始化 WebSocket
        }
    }
});
// ws_text.onmessage = function (event) {
//     const message = JSON.parse(event.data);
    
//     if (message.method === 'accountNotification') {
//         const accountInfo = message.params.result.value;
//         const balance = accountInfo.lamports; // 获取余额信息，单位为lamports
//         const solBalance = (balance / 1000000000).toFixed(1); // 转换为SOL单位

//         console.log('余额信息变化:', solBalance, 'SOL');

//         // 在此处更新页面显示余额信息
//         document.getElementById('accountInfo').textContent = '最新余额: ' + solBalance  + 'SOL';
//     }

// };



// 添加一个订阅成功的事件处理函数
let subscribed = false; 
ws_text.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    // console.log(message)
    if (message.method == 'accountNotification') {
        if (message.method === 'accountNotification') {
            const accountInfo = message.params.result.value;
            const balance = accountInfo.lamports; // 获取余额信息，单位为lamports
            const solBalance = (balance / 1000000000).toFixed(1); // 转换为SOL单位
    
            console.log('余额信息变化:', solBalance, 'SOL');
    
            // 在此处更新页面显示余额信息
            document.getElementById('accountInfo').textContent = '最新余额: ' + solBalance  + ' SOL';
            
        }
    } else {
        if (message.error && message.error.message) {
            const json_date=(JSON.stringify({
                message:message.error.message,
            }));
            console.log(json_date);
            // alert(message.error.message);
        } else {
            if (subscribed) {
                alert('你已经订阅了，请不要再重复订阅');
            } else if (message.result !== undefined) {
                alert('恭喜你订阅成功');
                subscribed = true; 
            }
        }
    }    
});





document.getElementById('subscribeButton').addEventListener('click', async function() {
    const accountAddress = document.getElementById('accountInput').value.trim();
    if (!isValidSolanaAddress(accountAddress)) {
        alert('兄弟！请提供有效的 Solana 地址....');
        return;
    }else{
    const response = await fetch(`/accountInfo?address=${accountAddress}`);
    const data = await response.json();
    console.log(data)
    const accountInfovit = document.getElementById('accountInfocurrentBlock')
    const accountInfoDiv = document.getElementById('accountInfobalance');
    accountInfoDiv.innerHTML = `${data.balance} SOL`;
    accountInfovit.innerHTML = `${data.currentBlock}`;
    }
});