import React, { useState, useEffect } from "react";
// import Grid from "./Grid";
import Cell from "./Cell";
import Nav from "./Nav";

import { dijkstra, displayDijkstra } from "../algorithms/Dijkstra";
import { aStar, displayAStar } from "../algorithms/Astar";
import { bfs, displayBfs } from "../algorithms/BreadthFirstSearch";

import "./Pathfinder.css";

export default function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [startRow, setStartRow] = useState(8);
  const [startCol, setStartCol] = useState(5);
  const [goalRow, setGoalRow] = useState(8);
  const [goalCol, setGoalCol] = useState(35);
  const rowSize = 18;
  const colSize = 40;

  const [algorithm, setAlgorithm] = useState("A*");
  const [reset, setReset] = useState("Complete");
  const [moveStart, setMoveStart] = useState(false);
  const [moveGoal, setMoveGoal] = useState(false);

  useEffect(() => {
    generateGrid();
  }, []);

  const selectAlgorithm = (algorithm) => {
    setAlgorithm(algorithm);
  };
  const selectReset = (state) => {
    setReset(state);
  };
  const moveTheGoal = (state) => {
    setMoveGoal(state);
  };
  const moveTheStart = (state) => {
    setMoveStart(state);
  };

  const runAlgorithm = () => {
    if (algorithm === "A*") {
      visualizeAStar();
    } else if (algorithm === "Dijkstra") {
      visualizeDijkstra();
    } else if (algorithm === "BFS") {
      visualizeBFS();
    }
  };

  const visualizeAStar = () => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    const visited = aStar(start, goal, grid);
    const path = displayAStar(goal);
    animateAlgorithm(visited, path);
  };

  const visualizeDijkstra = () => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    const visited = dijkstra(start, goal, grid);
    const path = displayDijkstra(goal);
    animateAlgorithm(visited, path);
  };

  const visualizeBFS = () => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    const visited = bfs(start, goal, grid);
    const path = displayBfs(goal);
    animateAlgorithm(visited, path);
  };

  const animateAlgorithm = (visited, path) => {
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
    if (reset === "Complete") {
      const cells = document.querySelectorAll("div.cell");
      for (const cell of cells) {
        cell.classList.remove("node-path", "node-visited", "wall");
      }
    } else if (reset === "Path") {
      const cells = document.querySelectorAll("div.cell");
      for (const cell of cells) {
        cell.classList.remove("node-path", "node-visited");
      }
    } else if (reset === "Walls") {
      const cells = document.querySelectorAll("div.cell");
      for (const cell of cells) {
        cell.classList.remove("node-visited", "wall");
      }
    }
    for (const r of grid) {
      for (const c of r) {
        c.distance = Infinity;
        c.isVisited = false;
        if (reset !== "Path") c.isWall = false;
        c.previousNode = null;
      }
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

  return (
    <div>
      <Nav
        selectAlgorithm={selectAlgorithm}
        selectReset={selectReset}
        moveTheStart={moveTheStart}
        moveTheGoal={moveTheGoal}
        runAlgorithm={runAlgorithm}
        resetBoard={resetBoard}
        algorithm={algorithm}
        reset={reset}
      />

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
