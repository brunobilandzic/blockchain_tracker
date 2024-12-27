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

export const blockChainInfo = async () => {
  const chainInfo = await brunoClient.getBlockchainInfo();
  console.log("chain info:\n", chainInfo);
  return chainInfo;
};


async function getBlocksInPeriod(startTime, endTime) {
  try {
    const blocksInPeriod = [];

    // Get the best block hash to start
    let blockHash = await brunoClient.getBestBlockHash();

    while (blockHash) {
      // Fetch the block data
      const block = await brunoClient.getBlock(blockHash);
      const blockTime = block.time;

      // Stop if the block's timestamp is before the start time
      if (blockTime < startTime) break;

      // Collect blocks within the time range
      if (blockTime >= startTime && blockTime <= endTime) {
        blocksInPeriod.push({
          hash: block.hash,
          height: block.height,
          time: block.time,
        });
      }

      // Move to the previous block
      blockHash = block.previousblockhash;
    }

    return blocksInPeriod;
  } catch (err) {
    console.error("Error fetching blocks:", err);
  }
}