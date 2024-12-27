import { blockChainInfo } from "@/controller/RPC";

export default async function handler(req, res) {
  const chainInfo = await blockChainInfo();

  const { start, end } = req.query;

  console.log("start:", start, "end:", end);
  res.json(chainInfo);
}
