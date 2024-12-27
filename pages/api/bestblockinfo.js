// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// api route called api/bestblockinfo
// returns {bestblockhash, bestblockheight, tlen}
import { BestInfo } from "@/controller/RPC";

export default async function handler(req, res) {
  const binfo = await BestInfo();
  console.log(binfo);
  res.status(200).json({ ...binfo });
}
