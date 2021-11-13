from heapq import heapify, heappush, heappop

from pathfinder.algorithms.Nodes import Node

from dataclasses import dataclass, field
from typing import Any


@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: Any = field(compare=False)


class Graph:
    # TODO remove for loop from self.nodes initilization and mix it with the second for loop
    
    def __init__(self, grid):
        """
        precondition: grid will contain a uniform amount of nodes per row
        """
        self.nodes = [[Node() for column in range(len(grid[1]))]
                      for row in range(len(grid))]
        self.v = 0
        self.edges = {}
        self.visited = []
        self.path = []
        self.distances = {}
        for row in range(len(grid)):
            for col in range(len(grid[row])):
                self.v += 1  # number of vertices
                node = self.nodes[row][col]
                node.value = grid[row][col]
                node.x = col
                node.y = row
                self.edges[node] = {}
                if not node.is_wall():
                    
                    if col < len(grid[row])-1:
                        neighbor = self.nodes[row][col+1]
                        neighbor.value = grid[row][col+1]
                        neighbor.x = col+1
                        neighbor.y = row
                        self.add_edge(node, neighbor, 1)

                    if row < len(grid)-1:
                        neighbor = self.nodes[row+1][col]
                        neighbor.value = grid[row+1][col]
                        neighbor.x = col
                        neighbor.y = row+1
                        self.add_edge(node, neighbor, 1)

                    if row > 0:
                        neighbor = self.nodes[row-1][col]
                        neighbor.value = grid[row-1][col]
                        neighbor.x = col
                        neighbor.y = row-1
                        self.add_edge(node, neighbor, 1)
                    if col > 0:
                        neighbor = self.nodes[row][col-1]
                        neighbor.value = grid[row][col-1]
                        neighbor.x = col-1
                        neighbor.y = row
                        self.add_edge(node, neighbor, 1)
                    
                    

                    

    def add_edge(self, u, v, weight):
        # this new set up the edges dict will have the same interface as the adjacency maP
        # i.e edges[u][v] will still out put a weight if the nodes exist in memory
        # space complexity goes from O(n^2) to O(n*e) or 4n-(2*width + 2*height)(all nodes have 4 edges, except grid borders)

        if not v.is_wall():
            if u not in self.edges:
                self.edges[u] = {v: weight}
            else:
                self.edges[u][v] = weight
                
            if v not in self.edges:
                self.edges[v] = {u: weight}
            else:
                self.edges[v][u] = weight

    def dijkstra(self, start_vertex):
        
        # TODO handle casse where there is no start and end ndoe, or case where they overlap each other
        
        paths = {self.nodes[i][j]: float('inf') for i in range(len(self.nodes))
                 for j in range(len(self.nodes[i]))}
        paths[start_vertex] = 0

        pq = []
        heappush(pq, PrioritizedItem(0, start_vertex))
        while pq:
            
            current_vertex = heappop(pq).item
            self.visited.append(current_vertex)
            for neighbor in self.edges[current_vertex]:
                weight = self.edges[current_vertex][neighbor]
                if neighbor not in self.visited:
                    old_cost = paths[neighbor]
                    new_cost = paths[current_vertex] + weight
                    if new_cost < old_cost:
                        heappush(pq, PrioritizedItem(new_cost, neighbor))
                        paths[neighbor] = new_cost
                        neighbor.set_prev(current_vertex)
        self.distances = paths
        return self.distances, self.visited

    def shortest(self, node):
        if node.previous:
            self.path.append(node.previous)
            self.shortest(node.previous)
            
        return
        
    def get_paths(self,target):
        self.path.append(target)
        self.shortest(target)
        return self.path
    

if __name__ == "__main__":

    ...
