async function fetchRealCryptoPrices(baseCurr) {
    try {
        // Pedido à API pública da CoinGecko convertendo para a moeda pretendida (ex: eur, usd)
        const targetCurr = baseCurr.toLowerCase();
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=${targetCurr}`);
        const data = await response.json();
        
        const symbol = getCurrencySymbol(baseCurr);
        const btcPrice = data.bitcoin[targetCurr] || 0;
        const ethPrice = data.ethereum[targetCurr] || 0;

        document.getElementById('crypto-btc-price').innerText = formatMoney(btcPrice, symbol);
        document.getElementById('crypto-eth-price').innerText = formatMoney(ethPrice, symbol);
    } catch (error) {
        console.error('Erro ao procurar cotações reais:', error);
    }
}