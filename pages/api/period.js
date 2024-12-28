import { getBlocksInPeriod } from "@/controller/RPC";

export default async function handler(req, res) {
  const { start, end } = req.query;

  console.log("received start", start, "end", end);

  const blockHeaders = await getBlocksInPeriod(start, end);
  console.log("got block headers:", blockHeaders.length);
  res.json(blockHeaders.length);
}
