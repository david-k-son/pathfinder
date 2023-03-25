import React, { useState, useEffect } from "react";
// import Grid from "./Grid";
import Cell from "./Cell";
import { dijkstra, displayDijkstra } from "../algorithms/Dijkstra";

import "./Pathfinder.css";

export default function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const rowSize = 23;
  const colSize = 50;
  let startRow = 11;
  let startCol = 5;
  let goalRow = 11;
  let goalCol = 10;

  useEffect(() => {
    generateGrid();
  }, []);
  useEffect(() => {
    displayGrid();
  }, [grid]);

  const onMouseDown = (row, col) => {
    setIsMousePressed(true);
    const newGrid = createWalls(row, col);
    setGrid(newGrid);
  };
  const onMouseEnter = (row, col) => {
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
    console.log(visited);
    console.log(path);
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
    // displayGrid();
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
  const displayGrid = () => {
    grid.map((row, rowIdx) => {
      return (
        <div className="row" key={`r${rowIdx}`}>
          {row.map((cell, cellIdx) => {
            const { row, col, isStart, isGoal, isWall } = cell;
            return (
              <Cell
                key={`c${cellIdx}`}
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
    });
    console.log(grid);
  };

  const resetBoard = () => {
    const cells = document.querySelectorAll("div.cell");
    for (const cell of cells) {
      cell.classList.remove("node-path", "node-visited");
    }
    console.log(cells);
  };

  return (
    <div>
      <div className="nav">
        <p>Pathfinder Visualizer</p>
        <div className="path-algorithms">Algorithms</div>
        <div className="maze-algorithms">Maze Generator</div>
        <button onClick={visualizeDijkstra}>RUN</button>
        <button onClick={resetBoard}>RESET</button>
      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div className="row" key={`r${rowIdx}`}>
              {row.map((cell, cellIdx) => {
                const { row, col, isStart, isGoal, isWall } = cell;
                return (
                  <Cell
                    key={`c${cellIdx}`}
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
