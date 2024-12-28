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

export async function getBlocksInPeriod(startTime, endTime) {
  try {
    const startTimeISO = new Date(startTime * 1000).toISOString();
    const endTimeISO = new Date(endTime * 1000).toISOString();
    let hash = await brunoClient.getBestBlockHash();
    let header = await brunoClient.getBlockHeader(hash, true);

    console.log(`Fetching blocks between ${startTimeISO} and ${endTimeISO}`);
    console.log(`Best hash: ${hash}`);

    let blocksInPeriod = [];
    let i = 0;
    let blockTimeISO = new Date(header.time * 1000).toISOString();
    while (header.time > endTime) {
      blockTimeISO = new Date(header.time * 1000).toISOString();
      console.log(
        `header after period. changing ${i} (${
          i * 10
        } minutes) hash with time ${blockTimeISO} to ${
          header.previousblockhash
        }`
      );
      hash = header.previousblockhash;
      header = await brunoClient.getBlockHeader(hash, true);
      i++;
    }

    console.log(
      `First block in period: ${hash} no ${i} with time ${blockTimeISO}`
    );

    i = 0;
    while (header.time >= startTime) {
      blockTimeISO = new Date(header.time * 1000).toISOString();
      console.log(
        `header in period. adding ${i} (${
          i * 10
        } minutes) hash with time ${blockTimeISO}`
      );
      blocksInPeriod.push(header);
      hash = header.previousblockhash;
      header = await brunoClient.getBlockHeader(hash, true);
      i++;
    }

    return blocksInPeriod;
  } catch (err) {
    console.error("Error fetching blocks:", err);
  }
}

export const getBlocks = async (headers) => {
  console.log("recieved in rpce headers:", headers?.length);
  const blocks = [];

  const fetchBlocksPromises = headers?.map(async (header) => {
    const block = await brunoClient.getBlock(header.hash);
    blocks.push(block);
    console.log(`fetched block &{block.hash} with ${block.size} bytes`);
    return block;
  });

  await Promise.all(fetchBlocksPromises);

  return blocks;
};
