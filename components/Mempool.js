import axios from "axios";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Mempool() {
  const [bestBlockInfo, setBestBlockInfo] = useState({});
  const [mempoolInfo, setMempoolInfo] = useState({});


  const getMempoolSize = async () => {
    if (!bestBlockInfo.tlen) return;
    const res = await axios.get("/api/mempoolsize");
    setMempoolInfo({
      size: res.data.mempoolsize,
      relativeSize: res.data.mempoolsize / bestBlockInfo.tlen,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getBestBlockInfo();
    if (bestBlockInfo.tlen) {
      getMempoolSize();
    }
      getMempoolSize();
    },5000);

    return () => clearInterval(interval);
  }, [bestBlockInfo, mempoolInfo]);

  const getBestBlockInfo = async () => {
    const res = await axios.get("/api/bestblockinfo");
    const hashRepr = hashRepresentation(res.data.bestHash);
    setBestBlockInfo({
      ...hashRepr,
      bestHeight: res.data.bestHeight,
      bestHash: res.data.bestHash,
      tlen: res.data.tlen,
    });
  };

  useEffect(() => {
    getBestBlockInfo();
  }, []);

  useEffect(() => {
    if (bestBlockInfo.tlen) {
      getMempoolSize();
    }
  }, [bestBlockInfo]);

  useEffect(() => {
    console.log("Best Block Info:", bestBlockInfo);
    console.log("Mempool Size:", mempoolInfo);
  }, [bestBlockInfo, mempoolInfo]);

  useEffect(() => {
    if (!bestBlockInfo.tlen || !mempoolInfo.relativeSize) return;
    initBody();
    addBackground(mempoolInfo.relativeSize);
  }, [bestBlockInfo, mempoolInfo]);

  const hashRepresentation = (hash) => {
    const bestRepr = hash.replace(/^0*/, "").slice(0, 8);
    const reprArr = bestRepr.split("");

    let reachedLetter = false;
    const bestTarget = reprArr.filter((char, i) => {
      console.log("reach letter ", reachedLetter);

      if (!reachedLetter && !isNaN(parseInt(char))) {
        return true;
      }
      if (isNaN(parseInt(char))) {
        reachedLetter = true;
      }
      // console.log(char, isNaN(parseInt(char)));
    });

    return {
      bestRepr,
      bestTarget,
    };
  };
  return (
    <>{(bestBlockInfo.tlen && mempoolInfo.relativeSize )?
      <div className="flex flex-col w-2/3 mx-auto mt-10">
        <div className="text-xl font-bold">Best Block Info:</div>
        <div className="text-lg">Best Block Hash: {bestBlockInfo.bestRepr}</div>
        <div className="text-lg">
          Best Block Height: {bestBlockInfo.bestHeight}
        </div>
        <div className="text-lg">
          Number of Transactions: {bestBlockInfo.tlen}
        </div>
        <div className="text-lg">Target: {bestBlockInfo.bestTarget}</div>
        <div>
          <div className="text-xl font-bold">Mempool Info:</div>
          <div className="text-lg">
            Mempool Size: {parseFloat(mempoolInfo.size)}
          </div>
          <div className="text-lg">
            Relative Size: {(mempoolInfo.relativeSize * 100).toFixed(2)}%
          </div>
          <div className="mt-5 mb-1  text-center">
            <label htmlFor="progress" className="font-bold mt-5 text-xl">
              Mempool Progress:
            </label>
          </div>
          <div className="bg-slate-300 h-8  rounded-xl   ">
            <div
              id="progress"
              className="bg-black h-full rounded-lg"
              style={{
                width: `${mempoolInfo.relativeSize < 1
                    ? mempoolInfo.relativeSize * 100
                    : 100
                  }%`,
              }}></div>
          </div>
          {mempoolInfo.relativeSize > 1 && (
            <MempoolExceeds diffRelative={mempoolInfo.relativeSize} />
          )}
        </div>
      </div>
      : 
      <div className="flex justify-center items-center h-screen">
        <div className="text-3xl">Loading...</div>
      </div>
    }
    </>
  );
}

const MempoolExceeds = ({ diffRelative }) => {
  const [exceedsBy, setExceedsBy] = useState("");

  useEffect(() => {
    setExceedsBy(((diffRelative - 1) * 100).toFixed(2));
  }, [diffRelative]);

  return (
    <div className="mt-5">
      <div className="text-xl font-bold">Mempool Exceeds Best Block:</div>
      <div className="text-lg">By {exceedsBy}%</div>
    </div>
  );
};

const initBody = () => {
  const body = document.body;

  // body.style.width = "screen.width";
  // body.style.height = "screen.height";
};

const getColorString = (diffRelative) => {
  let redAmount, greenAmount, blueAmount;

  console.log(diffRelative);

  if (diffRelative < 0.5) {
    redAmount = 255;
    greenAmount = 255 * diffRelative;
    blueAmount = 0;
  } else if (diffRelative < 0.75) {
    redAmount = 255 * (1 - diffRelative);
    greenAmount = 255 * diffRelative;
    blueAmount = 0;
  } else if (diffRelative < 1) {
    redAmount = 0;
    greenAmount = 255 * diffRelative;
    blueAmount = 0;
  } else if (diffRelative < 1.5) {
    redAmount = 0;
    greenAmount = 255;
    blueAmount = 255 * (diffRelative - 1);
  } else {
    redAmount = 0;
    greenAmount = 255 * (1 - (diffRelative - 1));
    blueAmount = 255 * (diffRelative - 1);
  }
  const colorString = `rgb(${redAmount}, ${greenAmount}, ${blueAmount})`;
  console.log(colorString);
  return colorString;
};

const getProgressColor = (diffRelative) => {};

const addBackground = (diffRelative) => {
  document.body.style.backgroundColor = getColorString(diffRelative);
};
