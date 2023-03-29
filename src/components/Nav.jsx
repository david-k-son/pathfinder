import React from "react";
import DropdownMenu from "./DropdownMenu";

import "./Nav.css";

export default function Nav({
  selectAlgorithm,
  selectReset,
  moveTheStart,
  moveTheGoal,
  runAlgorithm,
  resetBoard,
  algorithm,
  reset,
}) {
  const moveStartNav = () => {
    const s = document.querySelector(".start");
    s.classList.add("opacity");
    moveTheStart(true);
    s.classList.remove(".start", ".opacity");
  };
  const moveGoalNav = () => {
    const g = document.querySelector(".goal");
    g.classList.add("opacity");
    moveTheGoal(true);
    g.classList.remove(".goal", ".opacity");
  };

  return (
    <div className="nav">
      <div className="nav-top">
        <p>Pathfinder Visualizer</p>
        <DropdownMenu
          title={"Algorithms"}
          options={["A*", "Dijkstra", "BFS", "DFS"]}
          selection={selectAlgorithm}
        />
        <DropdownMenu
          title={"Generate Maze"}
          options={["Random"]}
          selection={selectAlgorithm}
        />
        <DropdownMenu
          title={"Reset"}
          options={["Complete", "Path", "Walls"]}
          selection={selectReset}
        />
      </div>
      <div className="nav-bottom">
        <button onClick={moveStartNav}>Move Start</button>
        <button onClick={moveGoalNav}>Move Goal</button>
        <button onClick={runAlgorithm}>{`Run: ${algorithm}`}</button>
        <button onClick={resetBoard}>{`Reset: ${reset}`}</button>
      </div>
    </div>
  );
}
