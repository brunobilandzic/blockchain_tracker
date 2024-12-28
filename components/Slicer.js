import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { getColorString } from "./Mempool";
import { PiSortAscending } from "react-icons/pi";
import { TbSortAscending } from "react-icons/tb";

const DEFAULT_SIZE = 10;

export default function Slicer() {
  const [chainInfo, setChainInfo] = useState({});
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);

  const getChainInfo = useCallback(async () => {
    setLoading(true);
    const res = await axios.get("/api/slice", {
      params: {
        start: getTimeParam(params.start, params.startTime),
        end: getTimeParam(params.end, params.endTime),
      },
    });
    setChainInfo(res.data?.blockHeaders);
    setLoading(false);
  }, [params]);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getChainInfo();
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {chainInfo?.length > 0 && <BlockChain headers={chainInfo} />}
          <ChooseParameters
            params={params}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}

const BlockChain = ({ headers }) => {
  const [blocks, setBlocks] = useState([...headers]);
  const nTx = nTxAvarage(headers);
  const [isAscending, setIsAscending] = useState(false);
  const [sort, setSort] = useState("");

  const sortHeaders = () => {
    let sorted = [...blocks];
    sorted = sorted
      .sort((a, b) => {
        if (isAscending) {
          return a[sort] - b[sort];
        } else {
          return b[sort] - a[sort];
        }
      })
      .map((h) => h);
    setBlocks(sorted);
  };

  const sortChange = (e) => {
    setSort(e.target.value);
  };

  useEffect(() => {
    sort != "" && sortHeaders();
  }, [sort, isAscending]);

  const toggleSort = () => {
    setIsAscending(!isAscending);
    sortHeaders();
  };
  return (
    <div className={``}>
      <div className="flex flex-col mb-8 items-center gap-2">
        <h1 className="text-2xl font-bold">Block Chain Slicer </h1>
        <div className="flex gap-2">
          Sort By:
          <select onChange={sortChange}>
            <option value="">None</option>
            <option value="nTx">Number transactions</option>
            <option value="height">Height</option>
          </select>
          <div className="cursor-pointer text-xl" onClick={toggleSort}>
            {!isAscending ? <PiSortAscending /> : <TbSortAscending />}
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap  items-end">
        {blocks?.map((h) => (
          <BlockHeader size={h.nTx / nTx} key={h.hash} header={h} />
        ))}
      </div>
    </div>
  );
};

const ChooseParameters = ({ params, handleChange, handleSubmit }) => {
  return (
    <form
      className="grid grid-cols-4 w-1/3 gap-2 mt-10 mx-auto mb-5"
      onSubmit={handleSubmit}>
      <label>Start:</label>

      <input
        type="date"
        name="start"
        value={params.start}
        onChange={handleChange}
      />

      <label>Start Time:</label>
      <input
        type="time"
        name="startTime"
        value={params.startTime}
        onChange={handleChange}
      />
      <label>End:</label>
      <input
        type="date"
        name="end"
        value={params.end}
        onChange={handleChange}
      />
      <label>End Time:</label>
      <input
        type="time"
        name="endTime"
        value={params.endTime}
        onChange={handleChange}
      />
      <div className="col-span-4 row-span-4"></div>

      <button
        className="bg-slate-400 py-1 hover:bg-slate-300 text-slate-800 rounded-lg col-span-4"
        type="submit">
        Submit
      </button>
    </form>
  );
};

const BlockHeader = ({ header, size }) => {
  return (
    <div
      style={{
        width: `${remWidth(size)}rem`,
        height: `${remWidth(size)}rem`,
        backgroundColor: getColorString(size),
      }}
      className={` text-gray-800 rounded-lg p-2 border flex flex-col justify-center items-center`}>
      {" "}
      <div className="">
        {header.nTx}
        <i>tx</i>
      </div>
      <div>
        {header.height}
        <i>h</i>
      </div>
    </div>
  );
};

const initialParams = {
  start: new Date().toISOString().split("T")[0],
  end: new Date().toISOString().split("T")[0],
  startTime: "13:00",
  endTime: "23:59",
  speed: 1,
};

const getTimeParam = (date, time) => {
  return (
    new Date(date).getTime() / 1000 +
    time.split(":")[0] * 60 * 60 +
    time.split(":")[1] * 60
  );
};

const nTxAvarage = (headers) => {
  const total = headers.reduce((acc, h) => acc + h.nTx, 0);
  return total / headers.length;
};

const remWidth = (relSize) => {
  let size = relSize * DEFAULT_SIZE;

  size = Math.floor(size);

  return size % 2 === 0 ? size : size + 1;
};
