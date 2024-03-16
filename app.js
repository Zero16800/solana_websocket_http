const express = require('express');
const solanaWeb3 = require('@solana/web3.js');
const app = express();
const connection = new solanaWeb3.Connection('http://localhost:8899/');

app.get('/accountInfo', async (req, res) => {
  const yourAccountAddress = req.query.address;
  const balance = await connection.getBalance(new solanaWeb3.PublicKey(yourAccountAddress));
  const solBalance = (balance / 1000000000).toFixed(1); // 将余额从 Lamports 转换为 SOL
  const currentBlock = await connection.getSlot();
  console.log(yourAccountAddress)
  if (!yourAccountAddress) {
    return res.status(400).json({ error: '请提供有效的Solana账户地址' });
  }
  res.json({ balance: solBalance, currentBlock});
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});