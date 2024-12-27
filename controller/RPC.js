const Client = require("bitcoin-core");
const { config } = require("./config");

const brunoClient = new Client(config("mainnet"));

export const BestInfo = async () => {
  const bestHash = await brunoClient.getBestBlockHash();
  const block = await brunoClient.getBlockHeader(bestHash, true);
  console.log("best block:\n", block);
  return {
    bestHash,
    bestHeight: block.height,
    tlen: block.nTx,
  };
};
export const getMempoolSize = async () => {
  const mempoolInfo = await brunoClient.getMempoolInfo();
  console.log("mempool info:\n", mempoolInfo);
  return mempoolInfo.size;
};
