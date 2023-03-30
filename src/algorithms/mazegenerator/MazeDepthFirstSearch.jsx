export function mazeDfs(start, goal, grid) {
  if (!start || !goal || start === goal) return false;

  const visitedNodes = [];
  const notVisitedNodes = [start];
  const walls = [];
  while (!!notVisitedNodes.length) {
    const closestNode = notVisitedNodes.pop();
    // skip if the node has been visited
    if (closestNode.isVisited) continue;

    closestNode.isVisited = true;

    visitedNodes.push(closestNode);
    // if (closestNode.row === goal.row && closestNode.col === goal.col) {
    //   console.log("found goal");
    //   console.log(closestNode === goal);
    //   return visitedNodes;
    // }
    updateNotVisitedNodes(closestNode, grid, notVisitedNodes, walls);
    // while (notVisitedNodes.length && notVisitedNodes[0].isVisited) {
    //   notVisitedNodes.pop();
    // }
  }
  return [visitedNodes, walls];
}
function updateNotVisitedNodes(node, grid, notVisitedNodes, walls) {
  const nodesToCheck = getNotVisitedNeighbors(node, grid);
  const nodesToVisit = createWall(nodesToCheck, walls);
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

function createWall(neighbors, walls) {
  // DO NOT MAKE AN IMPOSSIBLE MAZE
  // THERE MUST BE AT LEAST ONE DIRECTION A NODE CAN TRAVEL
  if (neighbors.length <= 1) return neighbors;
  const rng = Math.floor(Math.random() * neighbors.length);
  const rngNode = neighbors[rng];
  rngNode.isWall = true;
  rngNode.isVisited = true;
  walls.push(rngNode);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function displayMazeDfs(goalNode) {
  const path = [];
  let cur = goalNode;
  while (cur !== null) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
}
