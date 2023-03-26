export function aStar(start, goal, grid) {
  if (!start || !goal || start === goal) return false;

  const visitedNodes = [];
  start.distance = 0;
  const notVisitedNodes = getAllNodes(grid);
  while (!!notVisitedNodes.length) {
    sortNodesByDistance(notVisitedNodes);
    const closestNode = notVisitedNodes.shift();
    // skip if the node is a wall
    if (closestNode.isWall) continue;
    // if the distance is infinity, the start is surrounded by walls
    if (closestNode.distance === Infinity) return visitedNodes;
    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    if (closestNode === goal) return visitedNodes;
    updateNotVisitedNodes(closestNode, grid, start, goal);
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function updateNotVisitedNodes(node, grid, start, goal) {
  const notVisitedNodes = getNotVisitedNeighbors(node, grid);
  for (const neighbor of notVisitedNodes) {
    neighbor.g =
      Math.abs(start.row - neighbor.row) + Math.abs(start.col - neighbor.col);
    neighbor.h =
      Math.abs(neighbor.row - goal.row) + Math.abs(neighbor.col - goal.col);
    neighbor.distance = neighbor.g + neighbor.h;
    neighbor.previousNode = node;
  }
}

function getNotVisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function sortNodesByDistance(notVisitedNodes) {
  notVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

export function displayAStar(goalNode) {
  const path = [];
  let cur = goalNode;
  while (cur !== null) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
}
