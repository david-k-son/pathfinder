import React, { useState, useEffect } from "react";
// import Grid from "./Grid";
import Cell from "./Cell";
import DropdownMenu from "./DropdownMenu";
import { dijkstra, displayDijkstra } from "../algorithms/Dijkstra";
import { aStar, displayAStar } from "../algorithms/Astar";

import "./Pathfinder.css";

export default function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [startRow, setStartRow] = useState(11);
  const [startCol, setStartCol] = useState(5);
  const [goalRow, setGoalRow] = useState(11);
  const [goalCol, setGoalCol] = useState(10);
  const rowSize = 18;
  const colSize = 40;
  // let startRow = 11;
  // let startCol = 5;
  // let goalRow = 11;
  // let goalCol = 10;

  const [algorithm, setAlgorithm] = useState("A*");

  const [moveStart, setMoveStart] = useState(false);
  const [moveGoal, setMoveGoal] = useState(false);

  useEffect(() => {
    generateGrid();
  }, []);

  const selectAlgorithm = (algorithm) => {
    setAlgorithm(algorithm);
  };

  const moveTheGoal = () => {
    const g = document.querySelector(".goal");
    g.classList.add("opacity");
    setMoveGoal(true);
    g.classList.remove(".goal", ".opacity");
  };
  const moveTheStart = () => {
    const s = document.querySelector(".start");
    s.classList.add("opacity");
    setMoveStart(true);
    s.classList.remove(".start", ".opacity");
  };

  const runAlgorithm = () => {
    if (algorithm === "A*") {
      visualizeAStar();
    } else if (algorithm === "Dijkstra") {
      visualizeDijkstra();
    }
  };

  const onMouseDown = (row, col) => {
    if (moveGoal) {
      const newGrid = grid.slice();
      newGrid[row][col].isGoal = true;
      newGrid[goalRow][goalCol].isGoal = false;
      setGoalRow(row);
      setGoalCol(col);
      setGrid(newGrid);
      setMoveGoal(false);
      document.querySelector(`#c-r${row}-c${col}`).classList.add("goal");
      return;
    }
    if (moveStart) {
      const newGrid = grid.slice();
      newGrid[row][col].isStart = true;
      newGrid[startRow][startCol].isStart = false;
      setStartRow(row);
      setStartCol(col);
      setGrid(newGrid);
      setMoveStart(false);
      document.querySelector(`#c-r${row}-c${col}`).classList.add("start");
      return;
    }
    // DO NOT MAKE WALLS OVER THE START OR THE GOAL
    if (
      (row === startRow && col === startCol) ||
      (row === goalRow && col === goalCol)
    ) {
      return;
    }
    setIsMousePressed(true);
    const newGrid = createWalls(row, col);
    setGrid(newGrid);
  };
  const onMouseEnter = (row, col) => {
    // DO NOT MAKE WALLS OVER THE START OR THE GOAL
    if (
      (row === startRow && col === startCol) ||
      (row === goalRow && col === goalCol)
    ) {
      return;
    }
    if (!isMousePressed) return;
    const newGrid = createWalls(row, col);
    setGrid(newGrid);
  };
  const onMouseUp = () => {
    setIsMousePressed(false);
  };

  const createWalls = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    node.isWall = !node.isWall;
    return newGrid;
  };

  const visualizeDijkstra = () => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    const visited = dijkstra(start, goal, grid);
    const path = displayDijkstra(goal);
    animateAlgorithm(visited, path);
  };

  const visualizeAStar = () => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    console.log(goalRow, goalCol);
    const visited = aStar(start, goal, grid);
    console.log(visited);
    const path = displayAStar(goal);
    console.log(path);
    animateAlgorithm(visited, path);
  };

  const animateAlgorithm = (visited, path) => {
    console.log("ANIMATE!");
    console.log(visited);
    console.log(path);
    for (let i = 0; i <= visited.length; i++) {
      const node = visited[i];
      if (i == visited.length) {
        setTimeout(() => {
          animatePath(path);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        document
          .querySelector(`#c-r${node.row}-c${node.col}`)
          .classList.add("node-visited");
      }, 10 * i);
    }
  };

  const animatePath = (path) => {
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      setTimeout(() => {
        document
          .querySelector(`#c-r${node.row}-c${node.col}`)
          .classList.add("node-path");
      }, 50 * i);
    }
  };

  const generateGrid = () => {
    const g = [];
    for (let i = 0; i < rowSize; i++) {
      const r = [];
      for (let j = 0; j < colSize; j++) {
        r.push(generateCell(i, j));
      }
      g.push(r);
    }
    setGrid(g);
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

  const resetBoard = () => {
    const cells = document.querySelectorAll("div.cell");
    for (const cell of cells) {
      cell.classList.remove("node-path", "node-visited", "wall");
    }
    for (const r of grid) {
      for (const c of r) {
        c.distance = Infinity;
        c.isVisited = false;
        c.isWall = false;
        c.previousNode = null;
      }
    }
  };

  return (
    <div>
      <div className="nav">
        <div className="nav-top">
          <p>Pathfinder Visualizer</p>
          <DropdownMenu
            title={"Algorithms"}
            options={["A*", "Dijkstra"]}
            selection={selectAlgorithm}
          />
          <div className="maze-algorithms">Maze Generator</div>
          <button onClick={runAlgorithm}>{`Run: ${algorithm}`}</button>
          <button onClick={resetBoard}>RESET</button>
        </div>
        <div className="nav-bottom">
          <button onClick={moveTheStart}>Move Start</button>
          <button onClick={moveTheGoal}>Move Goal</button>
        </div>
      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div className="row" key={`grid-row-${rowIdx}`}>
              {row.map((cell, cellIdx) => {
                const { row, col, isStart, isGoal, isWall } = cell;
                return (
                  <Cell
                    key={`cell-${cellIdx}`}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isGoal={isGoal}
                    isWall={isWall}
                    onMouseDown={onMouseDown}
                    onMouseEnter={onMouseEnter}
                    onMouseUp={onMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
