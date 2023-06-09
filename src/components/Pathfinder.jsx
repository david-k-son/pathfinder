import React, { useState, useEffect } from "react";
// import Grid from "./Grid";
import Cell from "./Cell";
import Nav from "./Nav";

import { dijkstra, displayDijkstra } from "../algorithms/pathfinder/Dijkstra";
import { aStar, displayAStar } from "../algorithms/pathfinder/Astar";
import { bfs, displayBfs } from "../algorithms/pathfinder/BreadthFirstSearch";
import { dfs, displayDfs } from "../algorithms/pathfinder/DepthFirstSearch";

import {
  mazeDfs,
  displayMazeDfs,
} from "../algorithms/mazegenerator/MazeDepthFirstSearch";

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

  const [algorithm, setAlgorithm] = useState("Path-A*");
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
    console.log(algorithm);
    if (algorithm === "Algorithms-A*") {
      visualizeAlgorithm(aStar, displayAStar, true);
    } else if (algorithm === "Algorithms-Dijkstra") {
      visualizeAlgorithm(dijkstra, displayDijkstra, true);
    } else if (algorithm === "Algorithms-BFS") {
      visualizeAlgorithm(bfs, displayBfs, true);
    } else if (algorithm === "Algorithms-DFS") {
      visualizeAlgorithm(dfs, displayDfs, true);
    } else {
      // RUN MAZE ALGORITHM
      setReset("Reset-Path");
      if (algorithm === "Generate Maze-DFS") {
        visualizeMaze(mazeDfs);
      }
    }
  };

  const visualizeAlgorithm = (algorithm, displayAlgorithm, isPath) => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    let visited = [];
    if (isPath) {
      visited = algorithm(start, goal, grid);
    } else {
      visited = algorithm(start, goal, grid)[0];
    }
    const path = displayAlgorithm(goal);
    animateAlgorithm(visited, path, isPath);
  };
  const visualizeMaze = (algorithm) => {
    const start = grid[startRow][startCol];
    const goal = grid[goalRow][goalCol];
    const res = algorithm(start, goal, grid);
    const path = res[0];
    const walls = res[1];
    animateWalls(path, walls);
  };
  const animateAlgorithm = (visited, path, isPath) => {
    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        if (isPath) {
          setTimeout(() => {
            animatePath(path);
          }, 10 * i);
        } else {
          // setTimeout(() => {
          //   resetBoard();
          // }, 10 * i);
        }
        return;
      } else {
        // const node = visited[i];
        setTimeout(() => {
          const node = visited[i];
          document
            .querySelector(`#c-r${node.row}-c${node.col}`)
            .classList.add("node-visited");
        }, 10 * i);
      }
    }
  };
  const animateWalls = (visited, walls) => {
    // for (let i = 0; i < visited.length; i++) {
    //   const node = visited[i];
    //   if (i < walls.length) {
    //     const wall = walls[i];
    //     setTimeout(() => {
    //       document
    //         .querySelector(`#c-r${wall.row}-c${wall.col}`)
    //         .classList.add("wall");
    //       document
    //         .querySelector(`#c-r${node.row}-c${node.col}`)
    //         .classList.add("node-visited");
    //     }, 10 * i);
    //   } else {
    //     setTimeout(() => {
    //       document
    //         .querySelector(`#c-r${node.row}-c${node.col}`)
    //         .classList.add("node-visited");
    //     }, 10 * i);
    //   }
    // }
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      setTimeout(() => {
        setTimeout(() => {
          if (i < visited.length) {
            const node = visited[i];
            document
              .querySelector(`#c-r${node.row}-c${node.col}`)
              .classList.add("node-visited-maze");
          }
        }, 5 * i);
        document
          .querySelector(`#c-r${wall.row}-c${wall.col}`)
          .classList.add("wall");
      }, 10 * i);
    }
    return;
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
    console.log(reset);
    const cells = document.querySelectorAll("div.cell");
    if (reset === "Reset-Complete") {
      for (const cell of cells) {
        cell.classList.remove("node-path", "wall");
      }
    } else if (reset === "Reset-Path") {
      for (const cell of cells) {
        cell.classList.remove("node-path");
      }
    } else if (reset === "Reset-Walls") {
      for (const cell of cells) {
        cell.classList.remove("wall");
      }
    }
    for (const cell of cells) {
      cell.classList.remove("node-visited", "node-visited-maze");
    }

    for (const r of grid) {
      for (const c of r) {
        c.distance = Infinity;
        c.isVisited = false;
        if (reset !== "Reset-Path") c.isWall = false;
      }
    }
    if (reset !== "Reset-Path") {
      const nodes = document.querySelectorAll(".cell");
      for (const node of nodes) {
        node.classList.remove("wall");
      }
    }
    setGrid(grid);
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
