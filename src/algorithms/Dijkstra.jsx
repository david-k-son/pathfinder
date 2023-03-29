export function dijkstra(start, goal, grid) {
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
    updateNotVisitedNodes(closestNode, grid);
    while (notVisitedNodes.length && notVisitedNodes[0].isVisited) {
      notVisitedNodes.shift();
    }
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

function updateNotVisitedNodes(node, grid) {
  const notVisitedNodes = getNotVisitedNeighbors(node, grid);
  for (const neighbor of notVisitedNodes) {
    neighbor.distance = node.distance + 1;
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

export function displayDijkstra(goalNode) {
  const path = [];
  let cur = goalNode;
  while (cur !== null) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
}
