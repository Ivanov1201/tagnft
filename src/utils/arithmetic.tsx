const NFT_SELL_PRICE = 0.01;
const NFT_BUY_PRICE = 0.0102;

const calc_sell_weth_from_count = (_count: number) => {
  return Math.round((NFT_SELL_PRICE * _count) * 100 ) / 100;
};

const calc_buy_weth_from_count = (_count: number) => {
  return Math.round((NFT_BUY_PRICE * _count) * 10000 ) / 10000;
};

export {
  calc_sell_weth_from_count,
  calc_buy_weth_from_count
};