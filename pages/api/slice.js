import { getBlocksInPeriod, getBlocksWithSizes } from "@/controller/RPC";

export default async function handler(req, res) {
  const { start, end } = req.query;

  console.log("received start", start, "end", end);

  const blockHeaders = await getBlocksInPeriod(start, end);
  console.log("got block headers:", blockHeaders?.length);
  //   const blocks = await getBlocksWithSizes(blockHeaders);
  //    console.log("got blocks:", blocks?.length);
  //   res.json({ blocks });

  res.json({ blockHeaders });
}
