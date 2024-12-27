import { getMempoolSize } from "@/controller/RPC";

export default async function handler(req, res) {
  const mempoolsize = await getMempoolSize();
  console.log(mempoolsize);
  res.status(200).json({ mempoolsize });
}
