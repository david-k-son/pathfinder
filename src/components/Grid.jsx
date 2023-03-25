import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { dijkstra } from "../algorithms/Dijkstra";

import "./Grid.css";

export default function Grid({
  rowSize,
  colSize,
  startRow,
  startCol,
  goalRow,
  goalCol,
  grid,
}) {
  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    // const g = [];
    for (let i = 0; i < rowSize; i++) {
      const r = [];
      for (let j = 0; j < colSize; j++) {
        r.push(generateCell(i, j));
      }
      // grid.push(r);
    }
    // grid = g;
    dijkstra([7, 5], [7, 25], rowSize, colSize, grid);
  };
  const generateCell = (row, col) => {
    return {
      row,
      col,
      isStart: row === startRow && col === startCol,
      isGoal: row === goalRow && col === goalCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div className="row" key={`r${rowIdx}`}>
            {row.map((cell, cellIdx) => {
              const { row, col, isStart, isGoal, isWall } = cell;
              return (
                <Cell
                  row={row}
                  col={col}
                  isStart={isStart}
                  isGoal={isGoal}
                  isWall={isWall}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
