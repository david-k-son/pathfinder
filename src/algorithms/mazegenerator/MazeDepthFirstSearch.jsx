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
    updateNotVisitedNodes(closestNode, grid, notVisitedNodes, walls, goal);
  }
  return [visitedNodes, walls];
}
function updateNotVisitedNodes(node, grid, notVisitedNodes, walls, goal) {
  const nodesToCheck = getNotVisitedNeighbors(node, grid);
  const nodesToVisit = createWall(nodesToCheck, walls, goal);
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

function createWall(neighbors, walls, goal) {
  // DO NOT MAKE AN IMPOSSIBLE MAZE
  // THERE MUST BE AT LEAST ONE DIRECTION A NODE CAN TRAVEL
  neighbors = neighbors.filter((neighbor) => neighbor != goal);
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
