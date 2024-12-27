import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Builder() {
  const [chainInfo, setChainInfo] = useState({});
  const [params, setParams] = useState(initialParams);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(params);
  };

  useEffect(() => {
    const getChainInfo = async () => {
      const res = await axios.get("/api/blockchaininfo", {
        params: {
          start: 0,
          end: 10,
        },
      });
      setChainInfo(res.data);
    };

    // getChainInfo();
  }, []);

  useEffect(() => {
    console.log("Chain Info:", chainInfo);
  }, [chainInfo]);

  return (
    <div>
      <h1>Blockchain Info</h1>
      <pre>{JSON.stringify(chainInfo, null, 2)}</pre>
      <ChooseParameters
        params={params}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

const ChooseParameters = ({ params, handleChange, handleSubmit }) => {
  return (
    <form className="flex gap-4" onSubmit={handleSubmit}>
      <div className="flex gap-1">
        <label>Start:</label>
        <input
          type="date"
          name="start"
          value={params.start}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>End:</label>
        <input
          type="date"
          name="end"
          value={params.end}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Speed:</label>
        <input
          className="w-20"
          type="number"
          name="speed"
          value={params.speed}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const initialParams = {
  start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
  end: new Date().toISOString().split("T")[0],
  speed: 1,
};
