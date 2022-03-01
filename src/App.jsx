import React, { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import Chart from "./Canvas";

const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.65;

function App() {
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState(900)
  useEffect(() => {
    d3.csv(`/all-time-goal-kickers.csv`).then((data) => {
      const newData = data.reduce((prevData, d, i) => {
        prevData.push({
          Player: d.Player,
          Gls: +d.Gls,
          id: i,
        });
        return prevData;
      }, []);
      setData(newData);
    });
  }, []);

  return (<>
    <div className="canvas-holder">
      {data && <Chart width={width} height={height} data={data} goals={goals} />}
    </div>
    <div>
      <button onClick={() => setGoals('all')}>All</button>
      <button onClick={() => setGoals(1)}>&gt;1</button>
      <button onClick={() => setGoals(10)}>&gt;10</button>
      <button onClick={() => setGoals(900)}>&gt;900</button>
    </div>
    </>
  );
}

export default App;
