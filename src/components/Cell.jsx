import React from "react";
import "./Cell.css";

export default function Cell({ row, col, isStart, isGoal, isWall }) {
  let params = "";
  if (isStart) {
    params += "start ";
  }
  if (isGoal) {
    params += "goal ";
  }
  if (isWall) {
    params += "wall ";
  }
  return <div id={`c-r${row}-c${col}`} className={`cell ${params}`}></div>;
}
