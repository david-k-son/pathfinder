export function bfs(start, goal, grid) {
  if (!start || !goal || start === goal) return false;

  const visitedNodes = [];
  start.distance = 0;
  const notVisitedNodes = [start];
  while (!!notVisitedNodes.length) {
    // sortNodesByDistance(notVisitedNodes);

    const closestNode = notVisitedNodes.shift();
    // console.log(closestNode.isVisited);
    // skip if the node is a wall
    if (closestNode.isWall) {
      console.log("is wall");
      continue;
    }
    // if the distance is infinity, the start is surrounded by walls
    if (closestNode.distance === Infinity) {
      console.log("is infinity");
      return visitedNodes;
    }
    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    if (closestNode.row === goal.row && closestNode.col === goal.col) {
      console.log("found goal");
      console.log(closestNode === goal);
      return visitedNodes;
    }
    updateNotVisitedNodes(closestNode, grid, notVisitedNodes);
    while (notVisitedNodes.length && notVisitedNodes[0].isVisited) {
      notVisitedNodes.shift();
    }
  }
}
function updateNotVisitedNodes(node, grid, notVisitedNodes) {
  const nodesToVisit = getNotVisitedNeighbors(node, grid);
  for (const neighbor of nodesToVisit) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
    notVisitedNodes.push(neighbor);
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

export function displayBfs(goalNode) {
  const path = [];
  let cur = goalNode;
  while (cur !== null) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
}
